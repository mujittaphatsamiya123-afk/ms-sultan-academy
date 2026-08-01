import { createClient } from '@/lib/supabase/server'
import { Receipt } from 'lucide-react'

export default async function PaymentHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: payments } = await supabase
    .from('payments')
    .select('id, amount, status, payment_type, invoice_number, discount_amount, coupon_code, created_at, course:courses(title)')
    .eq('student_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Payment History</h1>

      {!payments || payments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <Receipt className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold">No payments yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p: any) => (
            <div key={p.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-sm">{p.course?.title || `${p.payment_type} plan`}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {p.invoice_number} · {new Date(p.created_at).toLocaleDateString()}
                  {p.coupon_code && ` · Coupon: ${p.coupon_code}`}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">₦{Number(p.amount).toLocaleString()}</p>
                <span className={`text-xs font-semibold ${p.status === 'success' ? 'text-brand-600' : p.status === 'pending' ? 'text-gold-600' : 'text-red-500'}`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
