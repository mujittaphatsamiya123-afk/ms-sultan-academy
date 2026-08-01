'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2, CheckCircle2 } from 'lucide-react'
import AuthCard from '@/components/auth/AuthCard'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    setLoading(false)
    if (error) return setError(error.message)
    setSent(true)
  }

  return (
    <AuthCard title="Reset Your Password" subtitle="We'll send you a link to reset it.">
      {sent ? (
        <div className="text-center py-4">
          <CheckCircle2 className="mx-auto text-brand-500 mb-3" size={40} />
          <p className="font-semibold mb-1">Check your email</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            We sent a password reset link to {email}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm p-3 rounded-xl">{error}</div>}
          <div>
            <label className="block text-sm font-medium mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-semibold py-3.5 rounded-xl transition-all">
            {loading && <Loader2 size={18} className="animate-spin" />}
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <p className="text-center text-sm text-slate-500 pt-2">
            <Link href="/login" className="text-brand-600 font-semibold">Back to Login</Link>
          </p>
        </form>
      )}
    </AuthCard>
  )
}
