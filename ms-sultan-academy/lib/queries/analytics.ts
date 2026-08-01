import { createClient } from '@/lib/supabase/server'

export async function getCoursePerformance() {
  const supabase = await createClient()
  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, price, is_free')
    .eq('is_published', true)

  const results = await Promise.all(
    (courses || []).map(async (c) => {
      const { count: enrollments } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', c.id)

      const { count: completions } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', c.id)
        .eq('completed', true)

      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .eq('course_id', c.id)
        .eq('status', 'success')

      const revenue = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0)

      return {
        id: c.id,
        title: c.title,
        enrollments: enrollments || 0,
        completions: completions || 0,
        completionRate: enrollments ? Math.round(((completions || 0) / enrollments) * 100) : 0,
        revenue,
      }
    })
  )

  return results.sort((a, b) => b.enrollments - a.enrollments)
}

export async function getQuizPerformance() {
  const supabase = await createClient()
  const { data: quizzes } = await supabase.from('quizzes').select('id, title')

  const results = await Promise.all(
    (quizzes || []).map(async (q) => {
      const { data: attempts } = await supabase
        .from('quiz_attempts')
        .select('score, passed')
        .eq('quiz_id', q.id)

      const total = attempts?.length || 0
      const passed = attempts?.filter((a) => a.passed).length || 0
      const avgScore = total ? Math.round(attempts!.reduce((sum, a) => sum + a.score, 0) / total) : 0

      return {
        id: q.id,
        title: q.title,
        attempts: total,
        passRate: total ? Math.round((passed / total) * 100) : 0,
        avgScore,
      }
    })
  )

  return results.filter((r) => r.attempts > 0).sort((a, b) => b.attempts - a.attempts)
}

export async function getStudentGrowth() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('created_at')
    .eq('role', 'student')
    .order('created_at', { ascending: true })

  const monthly: Record<string, number> = {}
  ;(data || []).forEach((p) => {
    const month = new Date(p.created_at).toLocaleString('default', { month: 'short', year: '2-digit' })
    monthly[month] = (monthly[month] || 0) + 1
  })

  return Object.entries(monthly).map(([month, count]) => ({ month, count }))
}
