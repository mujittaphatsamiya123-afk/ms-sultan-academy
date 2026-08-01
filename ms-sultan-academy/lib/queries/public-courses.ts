import { createClient } from '@/lib/supabase/server'

export async function getPublishedCourses({
  search,
  categorySlug,
}: {
  search?: string
  categorySlug?: string
}) {
  const supabase = await createClient()

  let query = supabase
    .from('courses')
    .select('id, title, slug, description, thumbnail_url, price, is_free, level, category:categories(name, slug)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.ilike('title', `%${search}%`)
  }

  const { data } = await query
  let courses = data || []

  if (categorySlug) {
    courses = courses.filter((c: any) => c.category?.slug === categorySlug)
  }

  return courses
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('*, category:categories(name, slug)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  return data
}

export async function getCourseLessonsPublic(courseId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lessons')
    .select('id, title, duration_minutes, position')
    .eq('course_id', courseId)
    .order('position', { ascending: true })

  return data || []
}

export async function getEnrollmentStatus(userId: string | null, courseId: string) {
  if (!userId) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from('enrollments')
    .select('id, progress_percentage, completed')
    .eq('student_id', userId)
    .eq('course_id', courseId)
    .maybeSingle()

  return data
}

// Public-facing: used by the courses catalog filter pills
export async function getAllCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return data || []
}
