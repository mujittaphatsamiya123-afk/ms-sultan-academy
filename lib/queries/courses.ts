import { createClient } from '@/lib/supabase/server'

export async function getAllCoursesAdmin() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('id, title, slug, thumbnail_url, price, is_free, is_published, level, category:categories(name)')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getCourseById(courseId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .single()
  return data
}

export async function getLessonsByCourse(courseId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('lessons')
    .select('*, resources(*)')
    .eq('course_id', courseId)
    .order('position', { ascending: true })
  return data || []
}

// Admin-scoped: returns every category, no filtering (used in course creation forms)
export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('*').order('name')
  return data || []
}
