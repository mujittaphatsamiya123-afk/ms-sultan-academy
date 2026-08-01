import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllQuizzesAdmin } from '@/lib/queries/quizzes'
import QuizzesTable from '@/components/dashboard/admin/QuizzesTable'

export default async function AdminQuizzesPage() {
  const quizzes = await getAllQuizzesAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Quizzes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{quizzes.length} total quizzes</p>
        </div>
        <Link
          href="/admin/quizzes/new"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Quiz</span>
        </Link>
      </div>
      <QuizzesTable quizzes={quizzes as any} />
    </div>
  )
}
