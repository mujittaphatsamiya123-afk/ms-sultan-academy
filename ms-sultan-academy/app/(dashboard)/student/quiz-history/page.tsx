import { ClipboardCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function QuizHistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('id, score, passed, attempted_at, quiz:quizzes(title, category)')
    .eq('student_id', user!.id)
    .order('attempted_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Quiz History</h1>
      {!attempts || attempts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <ClipboardCheck className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold">No quiz attempts yet</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 font-medium">Quiz</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Result</th>
                <th className="px-4 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((a: any) => (
                <tr key={a.id} className="border-b border-slate-50 dark:border-slate-800/50">
                  <td className="px-4 py-3 font-medium">{a.quiz?.title}</td>
                  <td className="px-4 py-3 font-semibold">{a.score}%</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${a.passed ? 'bg-brand-500/10 text-brand-600' : 'bg-red-500/10 text-red-500'}`}>
                      {a.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{new Date(a.attempted_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
