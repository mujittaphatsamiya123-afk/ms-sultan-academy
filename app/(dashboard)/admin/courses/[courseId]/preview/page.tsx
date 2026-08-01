import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getCourseById, getLessonsByCourse } from '@/lib/queries/courses'
import VideoPlayer from '@/components/lessons/VideoPlayer'
import ResourceList from '@/components/lessons/ResourceList'
import PreviewLessonSidebar from '@/components/dashboard/admin/PreviewLessonSidebar'

export default async function CoursePreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>
  searchParams: Promise<{ lesson?: string }>
}) {
  const { courseId } = await params
  const { lesson: lessonParam } = await searchParams

  const course = await getCourseById(courseId)
  if (!course) notFound()

  const lessons = await getLessonsByCourse(courseId)
  const currentLesson = lessons.find((l) => l.id === lessonParam) || lessons[0]

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <Link href={`/admin/courses/${courseId}`} className="text-sm text-slate-500 hover:text-brand-600 flex items-center gap-1">
          <ChevronLeft size={16} /> Back to Editor
        </Link>
        <span className="text-xs font-semibold bg-gold-500/10 text-gold-600 px-3 py-1.5 rounded-full">
          PREVIEW MODE — Admin Only
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-6">{course.title}</h1>

      {!currentLesson ? (
        <p className="text-slate-400">No lessons added yet.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <VideoPlayer videoUrl={currentLesson.video_url} title={currentLesson.title} />
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5">
              <h2 className="text-xl font-bold mb-2">{currentLesson.title}</h2>
              {currentLesson.content && (
                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">{currentLesson.content}</p>
              )}
            </div>
            <ResourceList resources={(currentLesson as any).resources || []} />
          </div>
          <PreviewLessonSidebar courseId={courseId} lessons={lessons as any} currentLessonId={currentLesson.id} />
        </div>
      )}
    </div>
  )
}
