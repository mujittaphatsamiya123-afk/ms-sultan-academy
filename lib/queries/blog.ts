import { createClient } from '@/lib/supabase/server'

export async function getPublishedBlogPosts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('id, title, slug, content, excerpt, cover_image_url, created_at, author:profiles(full_name)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return data || []
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('*, author:profiles(full_name)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  return data
}
