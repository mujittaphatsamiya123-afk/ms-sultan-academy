import { Users, BookOpen, GraduationCap, Wallet } from 'lucide-react'
import { getAdminStats, getRevenueByMonth } from '@/lib/queries/admin'
import StatCard from '@/components/dashboard/StatCard'
import AnalyticsChart from '@/components/dashboard/admin/AnalyticsChart'

export default async function AdminOverviewPage() {
  const stats = await getAdminStats()
  const revenueData = await getRevenueByMonth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Admin Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Here's how M.S Sultan Academy is performing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Students" value={stats.totalStudents} />
        <StatCard icon={BookOpen} label="Total Courses" value={stats.totalCourses} accent="gold" />
        <StatCard icon={GraduationCap} label="Total Enrollments" value={stats.totalEnrollments} />
        <StatCard
          icon={Wallet}
          label="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          accent="gold"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 sm:p-6">
        <h2 className="font-bold text-lg mb-1">Revenue Overview</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
          Monthly successful payments
        </p>
        <AnalyticsChart data={revenueData} />
      </div>
    </div>
  )
}
