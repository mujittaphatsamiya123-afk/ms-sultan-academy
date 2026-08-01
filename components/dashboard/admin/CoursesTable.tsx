'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteCourse, togglePublish } from '@/lib/actions/courses'

interface Course {
  id: string
  title: string
  slug: string
  thumbnail_url: string | null
  price: number
  is_free: boolean
  is_published: boolean
  level: string
  category: { name: string } | null
}

export default function CoursesTable({ courses }: { courses: Course[] }) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setBusyId(id)
    await deleteCourse(id)
    setBusyId(null)
    router.refresh()
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    setBusyId(id)
    const result = await togglePublish(id, !current)
    setBusyId(null)
    if (result.error) {
      alert(result.error)
      return
    }
    router.refresh()
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {courses.map((course) => (
        <div
          key={course.id}
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden"
        >
          <div className="relative h-36 bg-slate-100 dark:bg-slate-800">
            {course.thumbnail_url && (
              <Image src={course.thumbnail_url} alt={course.title} fill className="object-cover" />
            )}
            <span
              className={`absolute top-2 left-2 text-xs font-semibold px-2.5 py-1 rounded-full ${
                course.is_published
                  ? 'bg-brand-500 text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {course.is_published ? 'Published' : 'Draft'}
            </span>
          </div>

          <div className="p-4">
            <span className="text-xs font-medium text-brand-600 uppercase">
              {course.category?.name || 'Uncategorized'}
            </span>
            <h3 className="font-bold mt-1 mb-2 line-clamp-2">{course.title}</h3>
            <p className="text-sm font-semibold mb-4">
              {course.is_free ? 'Free' : `₦${Number(course.price).toLocaleString()}`}
            </p>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/courses/${course.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 py-2 rounded-lg transition-colors"
              >
                <Pencil size={14} /> Edit
              </Link>
              <button
                onClick={() => handleTogglePublish(course.id, course.is_published)}
                disabled={busyId === course.id}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title={course.is_published ? 'Unpublish' : 'Publish'}
              >
                {course.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button
                onClick={() => handleDelete(course.id, course.title)}
                disabled={busyId === course.id}
                className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}

      {courses.length === 0 && (
        <p className="col-span-full text-center py-16 text-slate-400">
          No courses yet — create your first one!
        </p>
      )}
    </div>
  )
}
