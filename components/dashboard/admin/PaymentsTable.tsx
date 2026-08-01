interface Payment {
  id: string
  amount: number
  status: string
  payment_type: string
  paystack_reference: string
  created_at: string
  student: { full_name: string | null; email: string } | null
  course: { title: string } | null
}

const statusColors: Record<string, string> = {
  success: 'bg-brand-500/10 text-brand-600',
  pending: 'bg-gold-500/10 text-gold-600',
  failed: 'bg-red-500/10 text-red-600',
}

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Reference</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <td className="px-4 py-3">
                  <p className="font-medium">{p.student?.full_name || '—'}</p>
                  <p className="text-xs text-slate-400">{p.student?.email}</p>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300 capitalize">
                  {p.course?.title || p.payment_type}
                </td>
                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                  ₦{Number(p.amount).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[p.status]}`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs font-mono whitespace-nowrap">
                  {p.paystack_reference}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {payments.length === 0 && (
          <p className="text-center py-10 text-slate-400 text-sm">No payments yet</p>
        )}
      </div>
    </div>
  )
}
