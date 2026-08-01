'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

async function assertIsAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Not authenticated' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { ok: false as const, error: 'Forbidden' }

  return { ok: true as const, supabase, adminId: user.id }
}

export async function updateUserRole(userId: string, role: 'student' | 'admin') {
  const check = await assertIsAdmin()
  if (!check.ok) return { error: check.error }
  const { supabase, adminId } = check

  if (userId === adminId && role !== 'admin') {
    return { error: 'You cannot remove your own admin role.' }
  }

  const { error } = await supabase.from('profiles').update({ role }).eq('id', userId)
  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function suspendUser(userId: string, reason: string) {
  const check = await assertIsAdmin()
  if (!check.ok) return { error: check.error }
  const { supabase, adminId } = check

  if (userId === adminId) return { error: 'You cannot suspend your own account.' }

  const { error } = await supabase
    .from('profiles')
    .update({ is_suspended: true, suspended_at: new Date().toISOString(), suspended_reason: reason })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function reinstateUser(userId: string) {
  const check = await assertIsAdmin()
  if (!check.ok) return { error: check.error }
  const { supabase } = check

  const { error } = await supabase
    .from('profiles')
    .update({ is_suspended: false, suspended_at: null, suspended_reason: null })
    .eq('id', userId)

  if (error) return { error: error.message }

  revalidatePath('/admin/users')
  return { success: true }
}

export async function inviteAdmin(email: string, fullName: string) {
  const check = await assertIsAdmin()
  if (!check.ok) return { error: check.error }
  const { supabase } = check

  const { createAdminClient } = await import('@/lib/supabase/admin')
  const adminClient = createAdminClient()

  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName },
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
  })

  if (error) return { error: error.message }

  if (data.user) {
    await supabase.from('profiles').update({ role: 'admin' }).eq('id', data.user.id)
  }

  revalidatePath('/admin/users')
  return { success: true }
}
