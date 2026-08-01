'use client'

import { useState, useCallback, useRef } from 'react'
import { Eye, EyeOff, Cloud, CloudOff, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FileUploader from './FileUploader'
import { updateBlogPost, togglePublishPost, deleteBlogPost } from '@/lib/actions/blog'

interface Post {
  id: string
  title: string
  content: string | null
  excerpt: string | null
  category: string | null
  tags: string[] | null
  meta_description: string | null
  cover_image_url: string | null
  is_published: boolean
}

export default function BlogPostEditor({ post }: { post: Post }) {
  const router = useRouter()
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content || '')
  const [excerpt, setExcerpt] = useState(post.excerpt || '')
  const [category, setCategory] = useState(post.category || '')
  const [tags, setTags] = useState((post.tags || []).join(', '))
  const [metaDescription, setMetaDescription] = useState(post.meta_description || '')
  const [coverImageUrl, setCoverImageUrl] = useState(post.cover_image_url || '')
  const [isPublished, setIsPublished] = useState(post.is_published)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerAutosave = useCallback(
    (updates: Record<string, any>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setSaveState('saving')
      debounceRef.current = setTimeout(async () => {
        await updateBlogPost(post.id, updates)
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 2000)
      }, 800)
    },
    [post.id]
  )

  const handleTogglePublish = async () => {
    const next = !isPublished
    setIsPublished(next)
    await togglePublishPost(post.id, next)
  }

  const handleDelete = async () => {
    if (!confirm('Delete this blog post? This cannot be undone.')) return
    await deleteBlogPost(post.id)
    router.push('/admin/blog')
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Blog Post</h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
            {saveState === 'saving' ? (
              <><CloudOff size={12} /> Saving...</>
            ) : saveState === 'saved' ? (
              <><Cloud size={12} className="text-brand-500" /> All changes saved</>
            ) : (
              <><Cloud size={12} /> Auto-saves as you type</>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePublish}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              isPublished ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            {isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
            {isPublished ? 'Published' : 'Draft'}
          </button>
          <button onClick={handleDelete} className="p-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <input
          value={title}
          onChange={(e) => { setTitle(e.target.value); triggerAutosave({ title: e.target.value }) }}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-lg font-semibold"
        />

        <textarea
          value={excerpt}
          onChange={(e) => { setExcerpt(e.target.value); triggerAutosave({ excerpt: e.target.value }) }}
          rows={2}
          placeholder="Short excerpt"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={category}
            onChange={(e) => { setCategory(e.target.value); triggerAutosave({ category: e.target.value }) }}
            placeholder="Category"
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            value={tags}
            onChange={(e) => {
              setTags(e.target.value)
              triggerAutosave({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })
            }}
            placeholder="Tags, comma separated"
            className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <textarea
          value={metaDescription}
          onChange={(e) => { setMetaDescription(e.target.value); triggerAutosave({ meta_description: e.target.value }) }}
          rows={2}
          placeholder="SEO meta description"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none text-sm"
        />

        <FileUploader
          bucket="thumbnails"
          accept="image/*"
          label="Cover Image"
          maxSizeMB={5}
          onUploaded={(url) => { setCoverImageUrl(url); triggerAutosave({ cover_image_url: url }) }}
        />
      </div>

      <label className="block text-sm font-medium mb-1.5">Content (Markdown)</label>
      <textarea
        value={content}
        onChange={(e) => { setContent(e.target.value); triggerAutosave({ content: e.target.value }) }}
        rows={16}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 font-mono text-sm resize-y"
      />
    </div>
  )
}
