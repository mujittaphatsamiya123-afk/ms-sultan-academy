'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function ReferralLinkBox({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false)

  const referralLink =
    typeof window !== 'undefined'
      ? `${window.location.origin}/register?ref=${referralCode}`
      : `/register?ref=${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-brand-600 to-brand-500 rounded-2xl p-6">
      <p className="text-brand-50 text-sm font-medium mb-2">Your Referral Link</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-sm font-mono truncate">
          {referralLink}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 bg-white text-brand-600 font-bold px-5 py-3 rounded-xl transition-transform hover:-translate-y-0.5"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  )
}
