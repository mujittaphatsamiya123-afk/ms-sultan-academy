'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
}

export async function createBlogPost(data: {
  title: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  metaDescription: string
  coverImageUrl: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const slug = `${slugify(data.title)}-${Date.now().toString(36)}`

  const { data: post, error } = await supabase
    .from('blog_posts')
    .insert({
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt,
      category: data.category,
      tags: data.tags,
      meta_description: data.metaDescription,
      cover_image_url: data.coverImageUrl,
      author_id: user.id,
      is_published: false,
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath('/admin/blog')
  return { data: post }
}

export async function updateBlogPost(postId: string, updates: Record<string, any>) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').update(updates).eq('id', postId)
  if (error) return { error: error.message }
  revalidatePath('/admin/blog')
  revalidatePath(`/admin/blog/${postId}`)
  return { success: true, savedAt: new Date().toISOString() }
}

export async function togglePublishPost(postId: string, isPublished: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').update({ is_published: isPublished }).eq('id', postId)
  if (error) return { error: error.message }
  revalidatePath('/admin/blog')
  return { success: true }
}

export async function deleteBlogPost(postId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('blog_posts').delete().eq('id', postId)
  if (error) return { error: error.message }
  revalidatePath('/admin/blog')
  return { success: true }
}
