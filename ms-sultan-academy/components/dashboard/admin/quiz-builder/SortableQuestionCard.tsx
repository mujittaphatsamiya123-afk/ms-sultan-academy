'use client'

import { useState, useRef } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, CheckCircle2, Cloud } from 'lucide-react'
import { updateQuestion, deleteQuestion } from '@/lib/actions/quiz-builder'

interface Question {
  id: string
  question: string
  options: string[]
  correct_option: number
  explanation: string | null
  position: number
}

export default function SortableQuestionCard({
  question,
  index,
  quizId,
  onDeleted,
  onUpdated,
}: {
  question: Question
  index: number
  quizId: string
  onDeleted: () => void
  onUpdated: (updates: Partial<Question>) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })
  const [saved, setSaved] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const autosave = (updates: Record<string, any>) => {
    onUpdated(updates)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      await updateQuestion(question.id, quizId, updates)
      setSaved(true)
      setTimeout(() => setSaved(false), 1500)
    }, 700)
  }

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...question.options]
    newOptions[idx] = value
    autosave({ options: newOptions })
  }

  const handleDelete = async () => {
    if (!confirm('Delete this question?')) return
    await deleteQuestion(question.id, quizId)
    onDeleted()
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 sm:p-5"
    >
      <div className="flex items-start gap-3 mb-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 mt-1 text-slate-300 hover:text-slate-500 touch-none"
        >
          <GripVertical size={18} />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
              {index + 1}
            </span>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-brand-600">
                <Cloud size={11} /> Saved
              </span>
            )}
          </div>

          <textarea
            value={question.question}
            onChange={(e) => autosave({ question: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 font-medium resize-none text-sm"
          />
        </div>

        <button onClick={handleDelete} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 flex-shrink-0">
          <Trash2 size={15} />
        </button>
      </div>

      <div className="space-y-2 ml-9">
        {question.options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <button
              onClick={() => autosave({ correct_option: idx })}
              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                question.correct_option === idx
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-slate-300 dark:border-slate-600'
              }`}
              title="Mark as correct answer"
            >
              {question.correct_option === idx && <CheckCircle2 size={14} />}
            </button>
            <input
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>
        ))}
      </div>

      <div className="ml-9 mt-3">
        <label className="block text-xs font-medium text-slate-500 mb-1">Explanation (shown after answering)</label>
        <textarea
          value={question.explanation || ''}
          onChange={(e) => autosave({ explanation: e.target.value })}
          rows={2}
          placeholder="Why is this the correct answer?"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none text-sm"
        />
      </div>
    </div>
  )
}
