import Link from 'next/link'
import { Wallet, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function StudentSubscriptionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_plan, subscription_expires_at')
    .eq('id', user!.id)
    .single()

  const isActive =
    profile?.subscription_expires_at &&
    new Date(profile.subscription_expires_at) > new Date()

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Subscription</h1>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 max-w-lg">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
            <Wallet size={22} />
          </span>
          <div>
            <p className="text-sm text-slate-500">Current Plan</p>
            <p className="text-xl font-bold capitalize">{profile?.subscription_plan || 'Free'}</p>
          </div>
        </div>

        {profile?.subscription_plan !== 'free' && (
          <p className="text-sm text-slate-500 mb-4">
            {isActive
              ? `Renews or expires on ${new Date(profile!.subscription_expires_at!).toLocaleDateString()}`
              : 'Your subscription has expired.'}
          </p>
        )}

        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-brand-600 font-semibold text-sm"
        >
          {profile?.subscription_plan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}{' '}
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
