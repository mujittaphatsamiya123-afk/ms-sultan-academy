'use client'

import { useState, useCallback, useRef } from 'react'
import { Eye, EyeOff, Cloud, CloudOff } from 'lucide-react'
import { autosaveQuiz, togglePublishQuiz } from '@/lib/actions/quiz-builder'
import QuestionList from './QuestionList'

interface Quiz {
  id: string
  title: string
  description: string | null
  category: string | null
  difficulty: string
  pass_percentage: number
  time_limit_minutes: number | null
  is_published: boolean
}

interface Question {
  id: string
  question: string
  options: string[]
  correct_option: number
  explanation: string | null
  position: number
}

export default function QuizEditor({
  quiz,
  initialQuestions,
}: {
  quiz: Quiz
  initialQuestions: Question[]
}) {
  const [title, setTitle] = useState(quiz.title)
  const [description, setDescription] = useState(quiz.description || '')
  const [difficulty, setDifficulty] = useState(quiz.difficulty)
  const [category, setCategory] = useState(quiz.category || '')
  const [passPercentage, setPassPercentage] = useState(quiz.pass_percentage)
  const [timeLimit, setTimeLimit] = useState<number | ''>(quiz.time_limit_minutes || '')
  const [isPublished, setIsPublished] = useState(quiz.is_published)

  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerAutosave = useCallback(
    (updates: Record<string, any>) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      setSaveState('saving')
      debounceRef.current = setTimeout(async () => {
        await autosaveQuiz(quiz.id, updates)
        setSaveState('saved')
        setTimeout(() => setSaveState('idle'), 2000)
      }, 800)
    },
    [quiz.id]
  )

  const handleTogglePublish = async () => {
    const next = !isPublished
    setIsPublished(next)
    await togglePublishQuiz(quiz.id, next)
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Quiz Builder</h1>
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
        <button
          onClick={handleTogglePublish}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            isPublished ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          {isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
          {isPublished ? 'Published' : 'Draft'}
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              triggerAutosave({ title: e.target.value })
            }}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              triggerAutosave({ description: e.target.value })
            }}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-500">Category</label>
            <input
              value={category}
              onChange={(e) => { setCategory(e.target.value); triggerAutosave({ category: e.target.value }) }}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-500">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => { setDifficulty(e.target.value); triggerAutosave({ difficulty: e.target.value }) }}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-500">Pass %</label>
            <input
              type="number" min={0} max={100}
              value={passPercentage}
              onChange={(e) => { setPassPercentage(Number(e.target.value)); triggerAutosave({ pass_percentage: Number(e.target.value) }) }}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-slate-500">Time Limit</label>
            <input
              type="number" min={1} placeholder="mins"
              value={timeLimit}
              onChange={(e) => {
                const val = e.target.value === '' ? '' : Number(e.target.value)
                setTimeLimit(val)
                triggerAutosave({ time_limit_minutes: val === '' ? null : val })
              }}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        </div>
      </div>

      <QuestionList quizId={quiz.id} initialQuestions={initialQuestions} />
    </div>
  )
}
