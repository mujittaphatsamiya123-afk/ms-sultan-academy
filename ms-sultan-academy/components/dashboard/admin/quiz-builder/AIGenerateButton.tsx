'use client'

import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { addQuestion } from '@/lib/actions/quiz-builder'

export default function AIGenerateButton({
  quizId,
  startPosition,
  onGenerated,
}: {
  quizId: string
  startPosition: number
  onGenerated: (questions: any[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [lessonContent, setLessonContent] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    if (lessonContent.trim().length < 20) return setError('Paste more lesson content (at least a few sentences).')
    setLoading(true)
    setError('')

    const res = await fetch('/api/ai/generate-quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lessonContent, numQuestions, difficulty: 'beginner' }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setError(data.error || 'Generation failed')

    const created = []
    for (let i = 0; i < data.questions.length; i++) {
      const q = data.questions[i]
      const result = await addQuestion({
        quizId,
        question: q.question,
        options: q.options,
        correctOption: q.correctOption,
        explanation: q.explanation,
        position: startPosition + i,
      })
      if (result.data) created.push(result.data)
    }
    onGenerated(created)
    setOpen(false)
    setLessonContent('')
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-semibold text-brand-600 border border-brand-200 dark:border-brand-800 px-4 py-2.5 rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors mb-4"
      >
        <Sparkles size={16} /> Generate with AI
      </button>
    )
  }

  return (
    <div className="bg-brand-500/5 border border-brand-200 dark:border-brand-800 rounded-2xl p-5 mb-4 space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <label className="block text-sm font-medium">Paste lesson content to generate questions from</label>
      <textarea
        value={lessonContent}
        onChange={(e) => setLessonContent(e.target.value)}
        rows={5}
        placeholder="Paste the lesson script or notes here..."
        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none text-sm"
      />
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Number of questions</label>
        <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} min={1} max={15}
          className="w-20 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500" />
      </div>
      <div className="flex gap-2">
        <button onClick={handleGenerate} disabled={loading}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-semibold px-5 py-2.5 rounded-xl text-sm">
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Generating...' : 'Generate Questions'}
        </button>
        <button onClick={() => setOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500">
          Cancel
        </button>
      </div>
    </div>
  )
}
