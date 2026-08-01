'use server'

import { createClient } from '@/lib/supabase/server'

export async function validateCoupon(code: string, amount: number) {
  const supabase = await createClient()
  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase().trim())
    .eq('is_active', true)
    .maybeSingle()

  if (!coupon) return { error: 'Invalid coupon code' }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { error: 'This coupon has expired' }
  }
  if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
    return { error: 'This coupon has reached its usage limit' }
  }

  const discount =
    coupon.discount_type === 'percentage'
      ? Math.round(amount * (Number(coupon.discount_value) / 100))
      : Number(coupon.discount_value)

  const finalAmount = Math.max(0, amount - discount)

  return { success: true, discount, finalAmount, couponCode: coupon.code }
}
