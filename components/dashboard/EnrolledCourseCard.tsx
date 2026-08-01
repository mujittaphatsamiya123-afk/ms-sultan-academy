import Link from 'next/link'
import Image from 'next/image'
import { PlayCircle } from 'lucide-react'

interface Props {
  courseId: string
  slug: string
  title: string
  thumbnail: string | null
  level: string
  progress: number
  completed: boolean
}

export default function EnrolledCourseCard({
  slug,
  title,
  thumbnail,
  level,
  progress,
  completed,
}: Props) {
  return (
    <Link
      href={`/student/courses/${slug}`}
      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="relative h-36 bg-slate-100 dark:bg-slate-800">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <PlayCircle size={40} />
          </div>
        )}
        {completed && (
          <span className="absolute top-2 right-2 bg-brand-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Completed
          </span>
        )}
      </div>

      <div className="p-4">
        <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">
          {level}
        </span>
        <h3 className="font-bold mt-1 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>

        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{progress}% complete</p>
      </div>
    </Link>
  )
}
