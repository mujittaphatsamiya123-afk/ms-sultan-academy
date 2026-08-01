import { getCoursePerformance, getQuizPerformance, getStudentGrowth } from '@/lib/queries/analytics'
import AnalyticsChart from '@/components/dashboard/admin/AnalyticsChart'

export default async function AdminAnalyticsPage() {
  const [courses, quizzes, growth] = await Promise.all([
    getCoursePerformance(),
    getQuizPerformance(),
    getStudentGrowth(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Deep performance insights across the platform</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6">
        <h2 className="font-bold mb-4">Student Growth</h2>
        <AnalyticsChart data={growth.map((g) => ({ month: g.month, revenue: g.count }))} />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        <h2 className="font-bold p-6 pb-0">Course Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3 font-medium">Course</th>
                <th className="px-6 py-3 font-medium">Enrollments</th>
                <th className="px-6 py-3 font-medium">Completion Rate</th>
                <th className="px-6 py-3 font-medium">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 dark:border-slate-800/50">
                  <td className="px-6 py-3 font-medium">{c.title}</td>
                  <td className="px-6 py-3">{c.enrollments}</td>
                  <td className="px-6 py-3">{c.completionRate}%</td>
                  <td className="px-6 py-3 font-semibold">₦{c.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {courses.length === 0 && <p className="text-center py-10 text-slate-400 text-sm">No published courses yet</p>}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        <h2 className="font-bold p-6 pb-0">Quiz Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm mt-4">
            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3 font-medium">Quiz</th>
                <th className="px-6 py-3 font-medium">Attempts</th>
                <th className="px-6 py-3 font-medium">Pass Rate</th>
                <th className="px-6 py-3 font-medium">Avg Score</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((q) => (
                <tr key={q.id} className="border-b border-slate-50 dark:border-slate-800/50">
                  <td className="px-6 py-3 font-medium">{q.title}</td>
                  <td className="px-6 py-3">{q.attempts}</td>
                  <td className="px-6 py-3">{q.passRate}%</td>
                  <td className="px-6 py-3">{q.avgScore}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          {quizzes.length === 0 && <p className="text-center py-10 text-slate-400 text-sm">No quiz attempts yet</p>}
        </div>
      </div>
    </div>
  )
}
