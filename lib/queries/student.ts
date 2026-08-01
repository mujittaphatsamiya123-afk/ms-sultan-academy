import { createClient } from '@/lib/supabase/server'

export async function getStudentProfile(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export async function getEnrolledCourses(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select(
      `
      id,
      progress_percentage,
      completed,
      enrolled_at,
      course:courses (
        id, title, slug, thumbnail_url, level
      )
    `
    )
    .eq('student_id', userId)
    .order('enrolled_at', { ascending: false })

  return data || []
}

export async function getUnreadNotificationsCount(userId: string) {
  const supabase = await createClient()
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false)

  return count || 0
}

export async function getRecentNotifications(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  return data || []
}
