import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import {
  getCourseWithLessonsForPlayer,
  checkEnrollment,
  getCompletedLessonIds,
} from '@/lib/queries/lessons'
import VideoPlayer from '@/components/lessons/VideoPlayer'
import LessonSidebar from '@/components/lessons/LessonSidebar'
import ResourceList from '@/components/lessons/ResourceList'
import LessonCompleteButton from '@/components/lessons/LessonCompleteButton'
import QuizPlayer from '@/components/lessons/QuizPlayer'
import AITeacherWidget from '@/components/ai-teacher/AITeacherWidget'

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>
}) {
  const { slug, lessonId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const data = await getCourseWithLessonsForPlayer(slug)
  if (!data) notFound()

  const enrollment = await checkEnrollment(user.id, data.course.id)
  if (!enrollment) redirect(`/courses/${slug}`)

  const currentLesson = data.lessons.find((l) => l.id === lessonId)
  if (!currentLesson) notFound()

  const completedIds = await getCompletedLessonIds(user.id, data.course.id)
  const isCurrentDone = completedIds.includes(currentLesson.id)

  const currentIndex = data.lessons.findIndex((l) => l.id === lessonId)
  const prevLesson = data.lessons[currentIndex - 1]
  const nextLesson = data.lessons[currentIndex + 1]
  const isLastLesson = currentIndex === data.lessons.length - 1

  const quiz = (currentLesson as any).quizzes?.[0]
  let quizQuestions: any[] = []
  if (quiz) {
    const { data: questions } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('position', { ascending: true })
    quizQuestions = questions || []
  }

  return (
    <>
      <div>
        <div className="mb-6">
          <Link
            href="/student"
            className="text-sm text-slate-500 hover:text-brand-600 flex items-center gap-1 mb-2"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">{data.course.title}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer videoUrl={currentLesson.video_url} title={currentLesson.title} />

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                {isCurrentDone && (
                  <span className="flex items-center gap-1 text-xs font-semibold bg-brand-500/10 text-brand-600 px-3 py-1.5 rounded-full whitespace-nowrap">
                    <CheckCircle2 size={14} /> Completed
                  </span>
                )}
              </div>
              {currentLesson.content && (
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">
                  {currentLesson.content}
                </p>
              )}
            </div>

            <ResourceList resources={(currentLesson as any).resources || []} />

            {quiz && quizQuestions.length > 0 && (
              <div className="mt-4">
                <QuizPlayer
                  quizId={quiz.id}
                  title={quiz.title}
                  questions={quizQuestions}
                  passPercentage={quiz.pass_percentage}
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              {prevLesson ? (
                <Link
                  href={`/student/courses/${slug}/lesson/${prevLesson.id}`}
                  className="flex items-center gap-1.5 text-sm font-semibold px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <ChevronLeft size={16} /> Previous
                </Link>
              ) : (
                <div />
              )}

              <LessonCompleteButton
                lessonId={currentLesson.id}
                courseId={data.course.id}
                courseSlug={slug}
                isCompleted={isCurrentDone}
                nextLessonId={nextLesson?.id}
                isLastLesson={isLastLesson}
              />

              {nextLesson && (
                <Link
                  href={`/student/courses/${slug}/lesson/${nextLesson.id}`}
                  className="flex items-center gap-1.5 text-sm font-semibold px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Next <ChevronRight size={16} />
                </Link>
              )}
            </div>
          </div>

          <div className="order-first lg:order-last">
            <LessonSidebar
              courseSlug={slug}
              lessons={data.lessons as any}
              currentLessonId={lessonId}
              completedIds={completedIds}
            />
          </div>
        </div>
      </div>
      <AITeacherWidget courseId={data.course.id} lessonContext={currentLesson.content || currentLesson.title} />
    </>
  )
}
