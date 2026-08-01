import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Eye } from 'lucide-react'
import { getCourseById, getLessonsByCourse } from '@/lib/queries/courses'
import LessonManager from '@/components/dashboard/admin/LessonManager'

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const course = await getCourseById(courseId)
  if (!course) notFound()

  const lessons = await getLessonsByCourse(courseId)

  return (
    <div>
      <div className="mb-6">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            course.is_published
              ? 'bg-brand-500/10 text-brand-600'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}
        >
          {course.is_published ? 'Published' : 'Draft'}
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold mt-2">{course.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{course.description}</p>

        <Link
          href={`/admin/courses/${courseId}/preview`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 mt-3"
        >
          <Eye size={16} /> Preview as Student
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-4">Lessons ({lessons.length})</h2>
      <LessonManager courseId={courseId} lessons={lessons as any} />
    </div>
  )
}
