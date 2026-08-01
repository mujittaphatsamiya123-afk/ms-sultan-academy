import { createClient } from '@/lib/supabase/server'

export async function getAllCertificatesAdmin() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('certificates')
    .select('id, certificate_url, issued_at, student:profiles(full_name, email), course:courses(title)')
    .order('issued_at', { ascending: false })
  return data || []
}
