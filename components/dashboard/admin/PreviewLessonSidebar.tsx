'use client'

import Link from 'next/link'
import { PlayCircle, Circle } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  duration_minutes: number | null
}

export default function PreviewLessonSidebar({
  courseId,
  lessons,
  currentLessonId,
}: {
  courseId: string
  lessons: Lesson[]
  currentLessonId: string
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-bold text-sm">Course Content</h3>
        <p className="text-xs text-slate-500 mt-0.5">{lessons.length} lessons · Preview Mode</p>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {lessons.map((lesson, i) => {
          const isActive = lesson.id === currentLessonId
          return (
            <Link
              key={lesson.id}
              href={`/admin/courses/${courseId}/preview?lesson=${lesson.id}`}
              className={`flex items-center gap-3 px-4 py-3.5 border-b border-slate-50 dark:border-slate-800/50 last:border-0 transition-colors ${
                isActive ? 'bg-brand-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              {isActive ? (
                <PlayCircle size={18} className="text-brand-500 flex-shrink-0" />
              ) : (
                <Circle size={18} className="text-slate-300 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className={`text-sm truncate ${isActive ? 'font-bold text-brand-700 dark:text-brand-400' : 'font-medium'}`}>
                  {i + 1}. {lesson.title}
                </p>
                {lesson.duration_minutes && <p className="text-xs text-slate-400">{lesson.duration_minutes} min</p>}
              </div>
            </Link>
          )
        })}
        {lessons.length === 0 && <p className="text-center py-8 text-slate-400 text-sm">No lessons yet</p>}
      </div>
    </div>
  )
}
