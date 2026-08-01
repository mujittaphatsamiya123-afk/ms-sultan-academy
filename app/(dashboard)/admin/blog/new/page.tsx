'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import FileUploader from '@/components/dashboard/admin/FileUploader'
import { createBlogPost } from '@/lib/actions/blog'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [metaDescription, setMetaDescription] = useState('')
  const [content, setContent] = useState('# Start writing...\n\nUse **markdown** to format your post.')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!title.trim()) return setError('Title is required')
    setLoading(true)
    const result = await createBlogPost({
      title,
      content,
      excerpt,
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      metaDescription,
      coverImageUrl,
    })
    setLoading(false)
    if (result.error) return setError(result.error)
    router.push(`/admin/blog/${result.data!.id}`)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">New Blog Post</h1>
      {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm p-3 rounded-xl mb-4">{error}</div>}

      <div className="space-y-4 mb-6">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-lg font-semibold" />

        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} placeholder="Short excerpt (shown on blog cards)"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category e.g. Freelancing Tips"
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500" />
          <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags, comma separated"
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} placeholder="SEO meta description (~155 characters)"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none text-sm" />

        <FileUploader bucket="thumbnails" accept="image/*" label="Cover Image" maxSizeMB={5} onUploaded={(url) => setCoverImageUrl(url)} />
      </div>

      <label className="block text-sm font-medium mb-1.5">Content (Markdown)</label>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={16}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm resize-y"
      />
      <p className="text-xs text-slate-400 mt-1 mb-6">
        Supports # headings, **bold**, *italic*, [links](url), ![images](url), and lists.
      </p>

      <button onClick={handleSubmit} disabled={loading}
        className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-semibold px-8 py-3.5 rounded-xl">
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </div>
  )
}
