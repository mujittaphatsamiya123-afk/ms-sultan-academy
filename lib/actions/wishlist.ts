'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function toggleWishlist(courseId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('student_id', user.id)
    .eq('course_id', courseId)
    .maybeSingle()

  if (existing) {
    await supabase.from('wishlist').delete().eq('id', existing.id)
    revalidatePath('/student/wishlist')
    return { success: true, wishlisted: false }
  }

  await supabase.from('wishlist').insert({ student_id: user.id, course_id: courseId })
  revalidatePath('/student/wishlist')
  return { success: true, wishlisted: true }
}
