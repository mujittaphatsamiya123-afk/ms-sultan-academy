import { createClient } from '@/lib/supabase/server'

export async function getAllUsersAdmin() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, role, subscription_plan, is_suspended, suspended_reason, created_at')
    .order('created_at', { ascending: false })
  return data || []
}
