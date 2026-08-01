'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { createQuiz } from '@/lib/actions/quiz-builder'

interface Lesson {
  id: string
  title: string
  course: { title: string } | null
}

export default function NewQuizForm({ lessons }: { lessons: Lesson[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('beginner')
  const [passPercentage, setPassPercentage] = useState(70)
  const [timeLimit, setTimeLimit] = useState<number | ''>('')
  const [lessonId, setLessonId] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return setError('Quiz title is required')

    setLoading(true)
    const result = await createQuiz({
      title,
      description,
      category,
      difficulty,
      passPercentage,
      timeLimitMinutes: timeLimit === '' ? null : Number(timeLimit),
      lessonId: lessonId || null,
    })
    setLoading(false)

    if (result.error) return setError(result.error)
    router.push(`/admin/quizzes/${result.data!.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {error && <div className="bg-red-50 dark:bg-red-900/20 text-red-600 text-sm p-3 rounded-xl">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1.5">Quiz Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Freelancing Basics Quiz"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Category</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Freelancing"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Pass Percentage</label>
          <input type="number" value={passPercentage} onChange={(e) => setPassPercentage(Number(e.target.value))} min={0} max={100}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Time Limit (minutes, optional)</label>
          <input type="number" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value === '' ? '' : Number(e.target.value))} min={1}
            placeholder="No limit"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">Attach to Lesson (optional)</label>
        <select value={lessonId} onChange={(e) => setLessonId(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500">
          <option value="">Standalone quiz (no lesson)</option>
          {lessons.map((l) => (
            <option key={l.id} value={l.id}>{l.course?.title} — {l.title}</option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading}
        className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-semibold px-8 py-3.5 rounded-xl shadow-lg shadow-brand-500/20 transition-all">
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? 'Creating...' : 'Create Quiz & Add Questions'}
      </button>
    </form>
  )
}
