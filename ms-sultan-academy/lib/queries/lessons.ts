import { createClient } from '@/lib/supabase/server'

export async function getCourseWithLessonsForPlayer(courseSlug: string) {
  const supabase = await createClient()
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug')
    .eq('slug', courseSlug)
    .single()

  if (!course) return null

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, video_url, content, duration_minutes, position, resources(*), quizzes(id, title, pass_percentage)')
    .eq('course_id', course.id)
    .order('position', { ascending: true })

  return { course, lessons: lessons || [] }
}

export async function checkEnrollment(userId: string, courseId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select('id, progress_percentage, completed')
    .eq('student_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  return data
}

export async function getCompletedLessonIds(userId: string, courseId: string) {
  const supabase = await createClient()
  const { data: lessonIds } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)

  if (!lessonIds || lessonIds.length === 0) return []

  const { data } = await supabase
    .from('lesson_progress')
    .select('lesson_id')
    .eq('student_id', userId)
    .eq('is_completed', true)
    .in('lesson_id', lessonIds.map((l) => l.id))

  return (data || []).map((d) => d.lesson_id)
}
