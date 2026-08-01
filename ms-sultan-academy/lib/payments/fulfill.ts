import { createClient } from '@/lib/supabase/server'
import { sendEmail, emailTemplate } from '@/lib/email/send'

export async function fulfillPayment(reference: string, metadata: any) {
  const supabase = await createClient()

  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('paystack_reference', reference)
    .single()

  if (!payment || payment.status === 'success') return // already processed

  await supabase.from('payments').update({ status: 'success' }).eq('paystack_reference', reference)

  const { data: studentProfile } = await supabase
    .from('profiles')
    .select('email, referred_by')
    .eq('id', payment.student_id)
    .single()

  if (payment.payment_type === 'course' && payment.course_id) {
    await supabase.from('enrollments').upsert(
      { student_id: payment.student_id, course_id: payment.course_id },
      { onConflict: 'student_id,course_id' }
    )

    await supabase.from('notifications').insert({
      user_id: payment.student_id,
      title: 'Payment Successful',
      message: `You've been enrolled in ${metadata?.courseTitle || 'your course'}!`,
    })

    if (studentProfile?.email) {
      await sendEmail({
        to: studentProfile.email,
        subject: 'Payment Confirmed',
        html: emailTemplate(
          'Payment Successful',
          `You've been enrolled in ${metadata?.courseTitle || 'your course'}. Happy learning!`,
          'Start Learning',
          `${process.env.NEXT_PUBLIC_APP_URL}/student`
        ),
      })
    }

    // Reward referrer if applicable
    if (studentProfile?.referred_by) {
      const rewardAmount = Number(payment.amount) * 0.1
      await supabase
        .from('referrals')
        .update({ status: 'rewarded', reward_amount: rewardAmount })
        .eq('referred_id', payment.student_id)

      await supabase.from('notifications').insert({
        user_id: studentProfile.referred_by,
        title: 'Referral Reward Earned! 🎉',
        message: `You earned ₦${rewardAmount.toLocaleString()} from a referral purchase.`,
      })
    }
  } else if (payment.payment_type === 'subscription' && metadata?.plan) {
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + 1)

    await supabase
      .from('profiles')
      .update({
        subscription_plan: metadata.plan,
        subscription_expires_at: expiresAt.toISOString(),
      })
      .eq('id', payment.student_id)

    await supabase.from('notifications').insert({
      user_id: payment.student_id,
      title: 'Subscription Activated',
      message: `Your ${metadata.plan} plan is now active for 1 month.`,
    })
  }
}
