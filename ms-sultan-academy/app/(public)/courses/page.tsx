import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CourseCard from '@/components/courses/CourseCard'
import CourseFilters from '@/components/courses/CourseFilters'
import { createClient } from '@/lib/supabase/server'
import { getPublishedCourses, getAllCategories } from '@/lib/queries/public-courses'

export const metadata = {
  title: 'Explore Courses | M.S Sultan Academy',
  description:
    'Browse practical courses on freelancing, AI tools, and digital skills to start earning online.',
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  const { search, category } = await searchParams
  const [courses, categories] = await Promise.all([
    getPublishedCourses({ search, categorySlug: category }),
    getAllCategories(),
  ])

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let wishlistedIds: string[] = []
  if (user) {
    const { data: wishlist } = await supabase.from('wishlist').select('course_id').eq('student_id', user.id)
    wishlistedIds = (wishlist || []).map((w) => w.course_id)
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 min-h-[60vh]">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2">Explore Courses</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Practical skills to start earning online — many courses are completely free.
          </p>
        </div>

        <Suspense>
          <CourseFilters categories={categories} />
        </Suspense>

        {courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 font-medium">No courses found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <CourseCard
                key={course.id}
                courseId={course.id}
                slug={course.slug}
                title={course.title}
                description={course.description}
                thumbnail={course.thumbnail_url}
                isFree={course.is_free}
                price={course.price}
                level={course.level}
                categoryName={course.category?.name}
                isWishlisted={wishlistedIds.includes(course.id)}
                showWishlist={!!user}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
