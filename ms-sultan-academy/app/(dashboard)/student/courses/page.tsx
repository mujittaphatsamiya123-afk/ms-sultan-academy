import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getEnrolledCourses } from '@/lib/queries/student'
import EnrolledCourseCard from '@/components/dashboard/EnrolledCourseCard'

export default async function MyCoursesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const enrollments = await getEnrolledCourses(user!.id)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Courses</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{enrollments.length} enrolled</p>
        </div>
        <Link href="/courses" className="text-sm font-semibold text-brand-600 flex items-center gap-1">
          Browse More <ArrowRight size={14} />
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <BookOpen className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold mb-1">You haven't enrolled in any course yet</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
            Browse our courses and start learning today — many are free!
          </p>
          <Link
            href="/courses"
            className="inline-block bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Explore Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {enrollments.map((e: any) => (
            <EnrolledCourseCard
              key={e.id}
              courseId={e.course.id}
              slug={e.course.slug}
              title={e.course.title}
              thumbnail={e.course.thumbnail_url}
              level={e.course.level}
              progress={e.progress_percentage}
              completed={e.completed}
            />
          ))}
        </div>
      )}
    </div>
  )
}
