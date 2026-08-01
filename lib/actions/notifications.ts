'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient()
  await supabase.from('notifications').update({ is_read: true }).eq('id', notificationId)
  revalidatePath('/student/notifications')
}

export async function markAllNotificationsRead(userId: string) {
  const supabase = await createClient()
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false)
  revalidatePath('/student/notifications')
  revalidatePath('/student')
}
