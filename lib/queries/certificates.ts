import { createClient } from '@/lib/supabase/server'

export async function getStudentCertificates(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('certificates')
    .select('id, certificate_url, issued_at, course:courses(title, thumbnail_url)')
    .eq('student_id', userId)
    .order('issued_at', { ascending: false })

  return data || []
}
