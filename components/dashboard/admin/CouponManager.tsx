'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import { createCoupon, toggleCoupon, deleteCoupon } from '@/lib/actions/admin-coupons'

interface Coupon {
  id: string
  code: string
  discount_type: string
  discount_value: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  is_active: boolean
}

export default function CouponManager({ coupons }: { coupons: Coupon[] }) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [code, setCode] = useState('')
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage')
  const [discountValue, setDiscountValue] = useState(10)
  const [maxUses, setMaxUses] = useState<number | ''>('')
  const [expiresAt, setExpiresAt] = useState('')

  const handleCreate = async () => {
    if (!code.trim()) return setError('Coupon code is required')
    setLoading(true)
    setError('')
    const result = await createCoupon({
      code,
      discountType,
      discountValue,
      maxUses: maxUses === '' ? null : Number(maxUses),
      expiresAt: expiresAt || null,
    })
    setLoading(false)
    if (result.error) return setError(result.error)
    setShowForm(false)
    setCode('')
    router.refresh()
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
          <Plus size={16} /> New Coupon
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 mb-5 space-y-3">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CODE e.g. WELCOME10"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
            <select value={discountType} onChange={(e) => setDiscountType(e.target.value as any)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500">
              <option value="percentage">Percentage Off</option>
              <option value="fixed">Fixed Amount Off (₦)</option>
            </select>
            <input type="number" value={discountValue} onChange={(e) => setDiscountValue(Number(e.target.value))} placeholder="Value"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
            <input type="number" value={maxUses} onChange={(e) => setMaxUses(e.target.value === '' ? '' : Number(e.target.value))} placeholder="Max uses (optional)"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
          </div>
          <button onClick={handleCreate} disabled={loading} className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-semibold px-6 py-2.5 rounded-xl text-sm">
            {loading && <Loader2 size={14} className="animate-spin" />} Create Coupon
          </button>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Discount</th>
                <th className="px-4 py-3 font-medium">Uses</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 dark:border-slate-800/50">
                  <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                  <td className="px-4 py-3">{c.discount_type === 'percentage' ? `${c.discount_value}%` : `₦${c.discount_value}`}</td>
                  <td className="px-4 py-3 text-slate-500">{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                  <td className="px-4 py-3">
                    <button onClick={async () => { await toggleCoupon(c.id, !c.is_active); router.refresh() }}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c.is_active ? 'bg-brand-500/10 text-brand-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                      {c.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={async () => { if (confirm('Delete coupon?')) { await deleteCoupon(c.id); router.refresh() } }} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {coupons.length === 0 && <p className="text-center py-10 text-slate-400 text-sm">No coupons yet</p>}
        </div>
      </div>
    </div>
  )
}
