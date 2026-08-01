import { createClient } from '@/lib/supabase/server'

export async function getAllAITools() {
  const supabase = await createClient()
  const { data } = await supabase.from('ai_tools').select('*').order('name')
  return data || []
}
