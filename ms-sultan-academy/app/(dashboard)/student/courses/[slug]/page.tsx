import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCourseWithLessonsForPlayer, checkEnrollment, getCompletedLessonIds } from '@/lib/queries/lessons'

export default async function CourseRedirectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const data = await getCourseWithLessonsForPlayer(slug)
  if (!data) notFound()

  const enrollment = await checkEnrollment(user.id, data.course.id)
  if (!enrollment) redirect(`/courses/${slug}`)

  if (data.lessons.length === 0) {
    redirect('/student')
  }

  const completedIds = await getCompletedLessonIds(user.id, data.course.id)
  const nextLesson = data.lessons.find((l) => !completedIds.includes(l.id)) || data.lessons[0]

  redirect(`/student/courses/${slug}/lesson/${nextLesson.id}`)
}
