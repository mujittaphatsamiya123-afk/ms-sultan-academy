'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, EyeOff, HelpCircle, Clock } from 'lucide-react'
import { deleteQuiz, togglePublishQuiz } from '@/lib/actions/quiz-builder'

interface Quiz {
  id: string
  title: string
  category: string | null
  difficulty: string
  time_limit_minutes: number | null
  is_published: boolean
  quiz_questions: { count: number }[]
}

const difficultyColors: Record<string, string> = {
  beginner: 'bg-brand-500/10 text-brand-600',
  intermediate: 'bg-gold-500/10 text-gold-600',
  advanced: 'bg-red-500/10 text-red-600',
}

export default function QuizzesTable({ quizzes }: { quizzes: Quiz[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete quiz "${title}"? This cannot be undone.`)) return
    setBusyId(id)
    await deleteQuiz(id)
    setBusyId(null)
    router.refresh()
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    setBusyId(id)
    await togglePublishQuiz(id, !current)
    setBusyId(null)
    router.refresh()
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Difficulty</th>
              <th className="px-4 py-3 font-medium">Questions</th>
              <th className="px-4 py-3 font-medium">Time Limit</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-4 py-3 font-medium">{quiz.title}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{quiz.category || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${difficultyColors[quiz.difficulty]}`}>
                    {quiz.difficulty}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  <span className="flex items-center gap-1">
                    <HelpCircle size={13} /> {quiz.quiz_questions?.[0]?.count ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {quiz.time_limit_minutes ? (
                    <span className="flex items-center gap-1"><Clock size={13} /> {quiz.time_limit_minutes}m</span>
                  ) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${quiz.is_published ? 'bg-brand-500/10 text-brand-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {quiz.is_published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/quizzes/${quiz.id}`} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
                      <Pencil size={14} />
                    </Link>
                    <button onClick={() => handleTogglePublish(quiz.id, quiz.is_published)} disabled={busyId === quiz.id} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
                      {quiz.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => handleDelete(quiz.id, quiz.title)} disabled={busyId === quiz.id} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {quizzes.length === 0 && <p className="text-center py-10 text-slate-400 text-sm">No quizzes yet — create your first one!</p>}
      </div>
    </div>
  )
}
