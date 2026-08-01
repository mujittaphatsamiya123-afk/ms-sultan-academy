import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { initializeTransaction } from '@/lib/paystack/client'
import { fulfillPayment } from '@/lib/payments/fulfill'

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const body = await request.json()
  const { type, courseId, plan, couponCode } = body

  let amount = 0
  let discountAmount = 0
  let metadata: Record<string, any> = { userId: user.id, type }

  if (type === 'course') {
    const { data: course } = await supabase
      .from('courses')
      .select('id, price, is_free, title')
      .eq('id', courseId)
      .single()

    if (!course || course.is_free) {
      return NextResponse.json({ error: 'Invalid course' }, { status: 400 })
    }

    const { data: existing } = await supabase
      .from('enrollments')
      .select('id')
      .eq('student_id', user.id)
      .eq('course_id', courseId)
      .maybeSingle()

    if (existing) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 })
    }

    amount = Number(course.price)
    metadata = { ...metadata, courseId: course.id, courseTitle: course.title }
  } else if (type === 'subscription') {
    const planPrices: Record<string, number> = { basic: 3500, pro: 7500 }
    amount = planPrices[plan] || 0
    metadata = { ...metadata, plan }
  }

  if (amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  if (couponCode) {
    const { data: coupon } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase().trim())
      .eq('is_active', true)
      .maybeSingle()

    if (
      coupon &&
      (!coupon.expires_at || new Date(coupon.expires_at) > new Date()) &&
      (!coupon.max_uses || coupon.used_count < coupon.max_uses)
    ) {
      discountAmount =
        coupon.discount_type === 'percentage'
          ? Math.round(amount * (Number(coupon.discount_value) / 100))
          : Number(coupon.discount_value)
      amount = Math.max(0, amount - discountAmount)

      await supabase.from('coupons').update({ used_count: coupon.used_count + 1 }).eq('id', coupon.id)
    }
  }

  const reference = `msa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`

  await supabase.from('payments').insert({
    student_id: user.id,
    course_id: type === 'course' ? courseId : null,
    amount,
    paystack_reference: reference,
    status: 'pending',
    payment_type: type,
    coupon_code: couponCode || null,
    discount_amount: discountAmount,
    invoice_number: invoiceNumber,
  })

  // 100% discount coupon: skip Paystack entirely, fulfill immediately
  if (amount === 0) {
    await fulfillPayment(reference, metadata)
    return NextResponse.json({ freeViaCoupon: true, reference })
  }

  const result = await initializeTransaction({
    email: user.email!,
    amount,
    reference,
    metadata,
  })

  if (!result.status) {
    return NextResponse.json({ error: result.message || 'Payment init failed' }, { status: 500 })
  }

  return NextResponse.json({ authorizationUrl: result.data.authorization_url })
}
