'use client'

import { useState } from 'react'
import { Mail, RefreshCcw, Loader2 } from 'lucide-react'
import AuthCard from '@/components/auth/AuthCard'
import { createClient } from '@/lib/supabase/client'

export default function VerifyEmailPage() {
  const [resending, setResending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResend = async () => {
    setResending(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      await supabase.auth.resend({ type: 'signup', email: user.email })
      setSent(true)
    }
    setResending(false)
  }

  return (
    <AuthCard title="Verify Your Email" subtitle="Almost there — just confirm your email address.">
      <div className="text-center py-4">
        <Mail className="mx-auto text-brand-500 mb-4" size={40} />
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          We sent a confirmation link to your email. Click it to activate your account, then refresh this page.
        </p>
        <button
          onClick={handleResend}
          disabled={resending || sent}
          className="flex items-center justify-center gap-2 mx-auto text-sm font-semibold text-brand-600 disabled:opacity-60"
        >
          {resending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCcw size={16} />}
          {sent ? 'Email sent!' : 'Resend confirmation email'}
        </button>
      </div>
    </AuthCard>
  )
}
