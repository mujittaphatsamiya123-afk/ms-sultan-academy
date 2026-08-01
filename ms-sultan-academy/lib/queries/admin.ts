import { createClient } from '@/lib/supabase/server'

export async function getAdminStats() {
  const supabase = await createClient()

  const [
    { count: totalStudents },
    { count: totalCourses },
    { count: totalEnrollments },
    { data: payments },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount, status').eq('status', 'success'),
  ])

  const totalRevenue = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0)

  return {
    totalStudents: totalStudents || 0,
    totalCourses: totalCourses || 0,
    totalEnrollments: totalEnrollments || 0,
    totalRevenue,
  }
}

export async function getRevenueByMonth() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('payments')
    .select('amount, created_at')
    .eq('status', 'success')
    .order('created_at', { ascending: true })

  if (!data) return []

  const monthly: Record<string, number> = {}
  data.forEach((p) => {
    const month = new Date(p.created_at).toLocaleString('default', {
      month: 'short',
      year: '2-digit',
    })
    monthly[month] = (monthly[month] || 0) + Number(p.amount)
  })

  return Object.entries(monthly).map(([month, revenue]) => ({ month, revenue }))
}

export async function getAllPayments() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('payments')
    .select(
      `
      id, amount, status, payment_type, paystack_reference, created_at,
      student:profiles ( full_name, email ),
      course:courses ( title )
    `
    )
    .order('created_at', { ascending: false })
    .limit(100)

  return data || []
}
