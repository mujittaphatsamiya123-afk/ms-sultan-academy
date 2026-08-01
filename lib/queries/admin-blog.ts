import { createClient } from '@/lib/supabase/server'

export async function getAllBlogPostsAdmin() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, category, is_published, created_at')
    .order('created_at', { ascending: false })
  return data || []
}

export async function getBlogPostByIdAdmin(postId: string) {
  const supabase = await createClient()
  const { data } = await supabase.from('blog_posts').select('*').eq('id', postId).single()
  return data
}
