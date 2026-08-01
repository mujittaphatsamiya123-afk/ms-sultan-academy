import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mssultanacademy.com'

  const { data: courses } = await supabase
    .from('courses')
    .select('slug, updated_at')
    .eq('is_published', true)

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .eq('is_published', true)

  const staticRoutes = [
    { url: `${baseUrl}`, lastModified: new Date(), priority: 1 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), priority: 0.9 },
    { url: `${baseUrl}/ai-tools`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), priority: 0.7 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), priority: 0.8 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), priority: 0.5 },
  ]

  const courseRoutes = (courses || []).map((c) => ({
    url: `${baseUrl}/courses/${c.slug}`,
    lastModified: new Date(c.updated_at),
    priority: 0.8,
  }))

  const blogRoutes = (posts || []).map((p) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.created_at),
    priority: 0.6,
  }))

  return [...staticRoutes, ...courseRoutes, ...blogRoutes]
}
