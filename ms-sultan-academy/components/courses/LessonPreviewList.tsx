import { Lock, PlayCircle } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  duration_minutes: number | null
}

export default function LessonPreviewList({
  lessons,
  unlocked,
}: {
  lessons: Lesson[]
  unlocked: boolean
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
      {lessons.map((lesson, i) => (
        <div
          key={lesson.id}
          className={`flex items-center gap-3 px-5 py-4 ${
            i !== lessons.length - 1 ? 'border-b border-slate-100 dark:border-slate-800' : ''
          }`}
        >
          <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-semibold text-slate-500 flex-shrink-0">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{lesson.title}</p>
            {lesson.duration_minutes && (
              <p className="text-xs text-slate-400">{lesson.duration_minutes} min</p>
            )}
          </div>
          {unlocked ? (
            <PlayCircle size={20} className="text-brand-500 flex-shrink-0" />
          ) : (
            <Lock size={16} className="text-slate-300 flex-shrink-0" />
          )}
        </div>
      ))}

      {lessons.length === 0 && (
        <p className="text-center py-8 text-slate-400 text-sm">
          Lessons coming soon for this course.
        </p>
      )}
    </div>
  )
}
