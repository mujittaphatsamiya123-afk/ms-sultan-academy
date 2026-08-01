'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'

interface Props {
  plan: 'free' | 'basic' | 'pro'
  name: string
  price: number
  features: string[]
  highlighted?: boolean
  isLoggedIn: boolean
  currentPlan?: string
}

export default function PricingCard({
  plan,
  name,
  price,
  features,
  highlighted,
  isLoggedIn,
  currentPlan,
}: Props) {
  const [loading, setLoading] = useState(false)

  const isCurrent = currentPlan === plan

  const handleSubscribe = async () => {
    if (!isLoggedIn) {
      window.location.href = '/register'
      return
    }
    if (plan === 'free' || isCurrent) return

    setLoading(true)
    const res = await fetch('/api/paystack/initialize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'subscription', plan }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      if (data.freeViaCoupon) {
        window.location.href = '/student?payment=success'
        return
      }
      window.location.href = data.authorizationUrl
    }
  }

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border-2 transition-all ${
        highlighted
          ? 'border-brand-500 bg-brand-500/5 shadow-xl scale-100 sm:scale-105'
          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
      }`}
    >
      {highlighted && (
        <span className="inline-block bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
          MOST POPULAR
        </span>
      )}
      <h3 className="font-bold text-xl mb-1">{name}</h3>
      <p className="text-3xl font-extrabold mb-6">
        {price === 0 ? 'Free' : `₦${price.toLocaleString()}`}
        {price > 0 && <span className="text-sm font-medium text-slate-400">/month</span>}
      </p>

      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check size={16} className="text-brand-500 flex-shrink-0 mt-0.5" />
            <span className="text-slate-600 dark:text-slate-300">{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading || isCurrent}
        className={`w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all ${
          isCurrent
            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
            : highlighted
            ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20'
            : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {isCurrent ? 'Current Plan' : plan === 'free' ? 'Get Started' : 'Subscribe Now'}
      </button>
    </div>
  )
}
