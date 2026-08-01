import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Signal, Clock, BookOpen } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import EnrollButton from '@/components/courses/EnrollButton'
import LessonPreviewList from '@/components/courses/LessonPreviewList'
import { createClient } from '@/lib/supabase/server'
import {
  getCourseBySlug,
  getCourseLessonsPublic,
  getEnrollmentStatus,
} from '@/lib/queries/public-courses'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await getCourseBySlug(slug)

  if (!course) return { title: 'Course Not Found | M.S Sultan Academy' }

  return {
    title: `${course.title} | M.S Sultan Academy`,
    description: course.description?.slice(0, 160) || 'Learn practical online income skills.',
    openGraph: {
      title: course.title,
      description: course.description?.slice(0, 160) || '',
      images: course.thumbnail_url ? [course.thumbnail_url] : [],
    },
  }
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const course = await getCourseBySlug(slug)
  if (!course) notFound()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [lessons, enrollment] = await Promise.all([
    getCourseLessonsPublic(course.id),
    getEnrollmentStatus(user?.id || null, course.id),
  ])

  const totalMinutes = lessons.reduce((sum, l) => sum + (l.duration_minutes || 0), 0)

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh]">
        <section className="bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950 py-10 md:py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-sm font-semibold text-brand-600 uppercase tracking-wide">
              {(course as any).category?.name}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-2 mb-4">{course.title}</h1>
            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-2xl">
              {course.description}
            </p>

            <div className="flex flex-wrap gap-5 mt-6 text-sm text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 capitalize">
                <Signal size={16} /> {course.level}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={16} /> {lessons.length} lessons
              </span>
              {totalMinutes > 0 && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 order-2 lg:order-1">
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              <LessonPreviewList lessons={lessons} unlocked={!!enrollment} />
            </div>

            <div className="order-1 lg:order-2">
              <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                  {course.thumbnail_url && (
                    <Image
                      src={course.thumbnail_url}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-3xl font-extrabold mb-4">
                    {course.is_free ? (
                      <span className="text-brand-500">Free</span>
                    ) : (
                      `₦${Number(course.price).toLocaleString()}`
                    )}
                  </p>
                  <EnrollButton
                    courseId={course.id}
                    isFree={course.is_free}
                    price={course.price}
                    isLoggedIn={!!user}
                    alreadyEnrolled={!!enrollment}
                  />
                  {enrollment && (
                    <div className="mt-4">
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-500"
                          style={{ width: `${enrollment.progress_percentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">
                        {enrollment.progress_percentage}% complete
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
