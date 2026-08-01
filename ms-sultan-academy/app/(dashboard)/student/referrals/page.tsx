import { Users, Wallet } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getReferralData } from '@/lib/queries/referrals'
import StatCard from '@/components/dashboard/StatCard'
import ReferralLinkBox from '@/components/dashboard/ReferralLinkBox'

export default async function ReferralsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { referralCode, referrals, totalEarned } = await getReferralData(user!.id)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Refer & Earn</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Share your link — earn 10% when your referrals make a purchase.
        </p>
      </div>

      <ReferralLinkBox referralCode={referralCode} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
        <StatCard icon={Users} label="Total Referrals" value={referrals.length} />
        <StatCard
          icon={Wallet}
          label="Total Earned"
          value={`₦${totalEarned.toLocaleString()}`}
          accent="gold"
        />
      </div>

      <h2 className="text-xl font-bold mb-4">Your Referrals</h2>

      {referrals.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <Users className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold mb-1">No referrals yet</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Share your referral link to start earning.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Reward</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r: any) => (
                <tr key={r.id} className="border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                  <td className="px-4 py-3 font-medium">{r.referred?.full_name || '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                        r.status === 'rewarded'
                          ? 'bg-brand-500/10 text-brand-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {r.reward_amount > 0 ? `₦${Number(r.reward_amount).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
