import { createClient } from '@/lib/supabase/server'

export async function getAllNotifications(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  return data || []
}
