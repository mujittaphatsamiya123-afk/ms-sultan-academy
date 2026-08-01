'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2, ShieldCheck } from 'lucide-react'

export default function CheckoutCard({
  courseId,
  title,
  thumbnail,
  price,
}: {
  courseId: string
  title: string
  thumbnail: string | null
  price: number
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [coupon, setCoupon] = useState('')

  const handlePay = async () => {
    setLoading(true)
    setError('')

    const res = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'course', courseId, couponCode: coupon || undefined }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    if (data.freeViaCoupon) {
      window.location.href = '/student?payment=success'
      return
    }

    window.location.href = data.authorizationUrl
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl max-w-md w-full">
      <div className="relative h-40 bg-slate-100 dark:bg-slate-800">
        {thumbnail && <Image src={thumbnail} alt={title} fill className="object-cover" />}
      </div>
      <div className="p-6">
        <h2 className="font-bold text-lg mb-1">{title}</h2>
        <p className="text-3xl font-extrabold text-brand-600 mb-4">
          ₦{price.toLocaleString()}
        </p>

        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-500 mb-1">Have a coupon?</label>
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/20 transition-all"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Redirecting to Paystack...' : 'Pay with Paystack'}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-4">
          <ShieldCheck size={14} /> Secured by Paystack — cards, bank transfer & USSD accepted
        </p>
      </div>
    </div>
  )
}
