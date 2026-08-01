'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function enrollInFreeCourse(courseId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'not_authenticated' }

  const { data: course } = await supabase
    .from('courses')
    .select('is_free')
    .eq('id', courseId)
    .single()

  if (!course?.is_free) return { error: 'This course requires payment' }

  const { error } = await supabase.from('enrollments').insert({
    student_id: user.id,
    course_id: courseId,
  })

  if (error) {
    if (error.code === '23505') return { error: 'Already enrolled' }
    return { error: error.message }
  }

  await supabase.from('notifications').insert({
    user_id: user.id,
    title: 'Enrollment Successful',
    message: `You've been enrolled in a new course. Happy learning!`,
  })

  revalidatePath('/student')
  return { success: true }
}
