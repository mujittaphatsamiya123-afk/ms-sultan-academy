'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function revokeCertificate(certificateId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const { data: cert } = await supabase.from('certificates').select('certificate_url').eq('id', certificateId).single()

  if (cert?.certificate_url) {
    const path = cert.certificate_url.split('/certificates/')[1]
    if (path) {
      const { createAdminClient } = await import('@/lib/supabase/admin')
      const adminClient = createAdminClient()
      await adminClient.storage.from('certificates').remove([path])
    }
  }

  const { error } = await supabase.from('certificates').delete().eq('id', certificateId)
  if (error) return { error: error.message }

  revalidatePath('/admin/certificates')
  return { success: true }
}
