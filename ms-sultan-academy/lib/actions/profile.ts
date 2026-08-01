'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(updates: { fullName: string; phone: string }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: updates.fullName, phone: updates.phone })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/student/profile')
  return { success: true }
}

export async function updateProfileAvatar(avatarUrl: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id)
  revalidatePath('/student/profile')
  return { success: true }
}
