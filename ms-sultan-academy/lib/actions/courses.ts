'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
}

export async function createCourse(formData: {
  title: string
  description: string
  categoryId: string
  price: number
  isFree: boolean
  level: string
  thumbnailUrl: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const slug = `${slugify(formData.title)}-${Date.now().toString(36)}`

  const { data, error } = await supabase
    .from('courses')
    .insert({
      title: formData.title,
      slug,
      description: formData.description,
      category_id: formData.categoryId || null,
      price: formData.isFree ? 0 : formData.price,
      is_free: formData.isFree,
      level: formData.level,
      thumbnail_url: formData.thumbnailUrl,
      created_by: user.id,
      is_published: false,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/admin/courses')
  return { data }
}

export async function updateCourse(courseId: string, updates: Record<string, any>) {
  const supabase = await createClient()
  const { error } = await supabase.from('courses').update(updates).eq('id', courseId)

  if (error) return { error: error.message }

  revalidatePath('/admin/courses')
  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function deleteCourse(courseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('courses').delete().eq('id', courseId)

  if (error) return { error: error.message }

  revalidatePath('/admin/courses')
  return { success: true }
}

// Publish guardrail: prevents publishing a course with zero lessons
export async function togglePublish(courseId: string, isPublished: boolean) {
  const supabase = await createClient()

  if (isPublished) {
    const { count } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('course_id', courseId)

    if (!count || count === 0) {
      return { error: 'Add at least one lesson before publishing this course.' }
    }
  }

  const { error } = await supabase.from('courses').update({ is_published: isPublished }).eq('id', courseId)
  if (error) return { error: error.message }

  revalidatePath('/admin/courses')
  return { success: true }
}

export async function createLesson(formData: {
  courseId: string
  title: string
  videoUrl: string
  content: string
  position: number
  durationMinutes: number
}) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lessons')
    .insert({
      course_id: formData.courseId,
      title: formData.title,
      video_url: formData.videoUrl,
      content: formData.content,
      position: formData.position,
      duration_minutes: formData.durationMinutes,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/admin/courses/${formData.courseId}`)
  return { data }
}

export async function deleteLesson(lessonId: string, courseId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('lessons').delete().eq('id', lessonId)

  if (error) return { error: error.message }

  revalidatePath(`/admin/courses/${courseId}`)
  return { success: true }
}

export async function addResource(formData: {
  lessonId: string
  courseId: string
  title: string
  fileUrl: string
  fileType: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('resources').insert({
    lesson_id: formData.lessonId,
    course_id: formData.courseId,
    title: formData.title,
    file_url: formData.fileUrl,
    file_type: formData.fileType,
  })

  if (error) return { error: error.message }

  revalidatePath(`/admin/courses/${formData.courseId}`)
  return { success: true }
}
