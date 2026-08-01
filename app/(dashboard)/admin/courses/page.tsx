import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllCoursesAdmin } from '@/lib/queries/courses'
import CoursesTable from '@/components/dashboard/admin/CoursesTable'

export default async function AdminCoursesPage() {
  const courses = await getAllCoursesAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Manage Courses</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{courses.length} total courses</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-5 py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all"
        >
          <Plus size={18} /> <span className="hidden sm:inline">New Course</span>
        </Link>
      </div>
      <CoursesTable courses={courses as any} />
    </div>
  )
}
