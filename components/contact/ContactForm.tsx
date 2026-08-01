'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { submitContactForm } from '@/lib/actions/contact'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await submitContactForm({ name, email, message })
    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    setSent(true)
    setName('')
    setEmail('')
    setMessage('')
  }

  if (sent) {
    return (
      <div className="bg-brand-500/10 border border-brand-200 dark:border-brand-800 rounded-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto text-brand-600 mb-3" size={40} />
        <h3 className="font-bold text-lg mb-1">Message Sent!</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          We'll get back to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5">Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
