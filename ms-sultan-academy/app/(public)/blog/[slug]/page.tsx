import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Calendar } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getBlogPostBySlug } from '@/lib/queries/blog'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) return { title: 'Post Not Found | M.S Sultan Academy' }

  return {
    title: `${post.title} | M.S Sultan Academy Blog`,
    description: post.meta_description || post.excerpt || post.content?.slice(0, 160) || '',
    openGraph: {
      title: post.title,
      description: post.meta_description || post.excerpt || '',
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {post.cover_image_url && (
          <div className="relative h-56 sm:h-72 rounded-2xl overflow-hidden mb-8">
            <Image src={post.cover_image_url} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
          <span>By {(post as any).author?.full_name || 'M.S Sultan Academy'}</span>
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="prose prose-slate dark:prose-invert max-w-none prose-img:rounded-2xl prose-a:text-brand-600">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content || ''}</ReactMarkdown>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {post.tags.map((tag: string) => (
              <span key={tag} className="text-xs font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
