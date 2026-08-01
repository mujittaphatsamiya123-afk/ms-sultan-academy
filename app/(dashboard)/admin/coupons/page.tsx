import { createClient } from '@/lib/supabase/server'
import CouponManager from '@/components/dashboard/admin/CouponManager'

export default async function AdminCouponsPage() {
  const supabase = await createClient()
  const { data: coupons } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Coupons</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Create discount codes for courses and subscriptions</p>
      </div>
      <CouponManager coupons={coupons || []} />
    </div>
  )
}
