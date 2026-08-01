'use client'

import { useState } from 'react'
import { Loader2, Megaphone, CheckCircle2 } from 'lucide-react'
import { sendAnnouncement } from '@/lib/actions/announcements'

export default function AnnouncementsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ count: number } | null>(null)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return
    setLoading(true)
    setResult(null)
    setError('')
    const res = await sendAnnouncement(title, message)
    setLoading(false)
    if (res.error) {
      setError(res.error)
      return
    }
    if (res.success) {
      setResult({ count: res.count! })
      setTitle('')
      setMessage('')
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Send Announcement</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Send a notification (in-app + email) to all registered students at once.
        </p>
      </div>

      <div className="max-w-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm p-3 rounded-xl">{error}</div>
        )}
        {result && (
          <div className="bg-brand-500/10 text-brand-600 text-sm p-3 rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} /> Sent to {result.count} students!
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. New Course Available!"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Write your announcement..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl transition-all"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Megaphone size={18} />}
          {loading ? 'Sending...' : 'Send to All Students'}
        </button>
      </div>
    </div>
  )
}
