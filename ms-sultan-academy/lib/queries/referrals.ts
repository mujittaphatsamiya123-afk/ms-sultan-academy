import { createClient } from '@/lib/supabase/server'

export async function getReferralData(userId: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', userId)
    .single()

  const { data: referrals } = await supabase
    .from('referrals')
    .select('id, status, reward_amount, created_at, referred:profiles!referrals_referred_id_fkey(full_name, email)')
    .eq('referrer_id', userId)
    .order('created_at', { ascending: false })

  const totalEarned = (referrals || [])
    .filter((r) => r.status === 'rewarded')
    .reduce((sum, r) => sum + Number(r.reward_amount), 0)

  return {
    referralCode: profile?.referral_code || '',
    referrals: referrals || [],
    totalEarned,
  }
}
