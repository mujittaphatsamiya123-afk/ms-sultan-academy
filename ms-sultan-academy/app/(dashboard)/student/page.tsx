import Link from 'next/link'
import { BookOpen, Award, TrendingUp, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStudentProfile, getEnrolledCourses } from '@/lib/queries/student'
import StatCard from '@/components/dashboard/StatCard'
import EnrolledCourseCard from '@/components/dashboard/EnrolledCourseCard'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const profile = await getStudentProfile(user!.id)
  const enrollments = await getEnrolledCourses(user!.id)

  const completedCount = enrollments.filter((e) => e.completed).length
  const inProgressCount = enrollments.length - completedCount

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'} 👋
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Let's continue building your online income skills.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={BookOpen} label="Enrolled Courses" value={enrollments.length} />
        <StatCard icon={TrendingUp} label="In Progress" value={inProgressCount} accent="gold" />
        <StatCard icon={Award} label="Completed" value={completedCount} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Your Courses</h2>
        <Link
          href="/courses"
          className="text-sm font-semibold text-brand-600 flex items-center gap-1"
        >
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
