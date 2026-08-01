'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createCourse } from '@/lib/actions/courses'
import FileUploader from './FileUploader'

interface Category {
  id: string
  name: string
}

export default function CourseForm({ categories }: { categories: Category[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [level, setLevel] = useState('beginner')
  const [isFree, setIsFree] = useState(true)
  const [price, setPrice] = useState(0)
  const [thumbnailUrl, setThumbnailUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) return setError('Course title is required')
    if (!thumbnailUrl) return setError('Please upload a course thumbnail')

    setLoading(true)
    const result = await createCourse({
      title,
      description,
      categoryId,
      price,
      isFree,
      level,
      thumbnailUrl,
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
      return
    }

    router.push(`/admin/courses/${result.data!.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1.5">Course Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Freelancing on Fiverr for Beginners"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="What will students learn in this course?"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
        <input
          type="checkbox"
          id="isFree"
          checked={isFree}
          onChange={(e) => setIsFree(e.target.checked)}
          className="w-5 h-5 accent-brand-500"
        />
        <label htmlFor="isFree" className="text-sm font-medium flex-1">
          This is a free course
        </label>
      </div>

      {!isFree && (
        <div>
          <label className="block text-sm font-medium mb-1.5">Price (₦)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min={0}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      )}

      <FileUploader
        bucket="thumbnails"
        accept="image/*"
        label="Course Thumbnail"
        maxSizeMB={5}
        onUploaded={(url) => setThumbnailUrl(url)}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? 'Creating...' : 'Create Course & Add Lessons'}
      </button>
    </form>
  )
}
