import { getAllPayments } from '@/lib/queries/admin'
import PaymentsTable from '@/components/dashboard/admin/PaymentsTable'

export default async function AdminPaymentsPage() {
  const payments = await getAllPayments()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Payments</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Track all course and subscription payments
        </p>
      </div>
      <PaymentsTable payments={payments as any} />
    </div>
  )
}
