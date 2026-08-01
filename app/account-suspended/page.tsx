import { ShieldAlert } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AccountSuspendedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = user
    ? await supabase.from('profiles').select('suspended_reason').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mx-auto mb-6">
          <ShieldAlert size={28} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Account Suspended</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-2">
          Your account has been suspended and you no longer have access to the platform.
        </p>
        {profile?.suspended_reason && (
          <p className="text-sm bg-slate-100 dark:bg-slate-800 rounded-xl p-4 mt-4">
            Reason: {profile.suspended_reason}
          </p>
        )}
        <p className="text-sm text-slate-400 mt-6">
          If you believe this is a mistake, contact support at support@mssultanacademy.com
        </p>
      </div>
    </div>
  )
}
