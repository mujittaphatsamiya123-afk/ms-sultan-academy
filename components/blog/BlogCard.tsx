import Link from 'next/link'
import Image from 'next/image'
import { Calendar, FileText } from 'lucide-react'

export default function BlogCard({
  slug,
  title,
  excerpt,
  coverImage,
  authorName,
  date,
}: {
  slug: string
  title: string
  excerpt: string
  coverImage: string | null
  authorName: string
  date: string
}) {
  return (
    <Link
      href={`/blog/${slug}`}
      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <div className="relative h-44 bg-slate-100 dark:bg-slate-800">
        {coverImage ? (
          <Image src={coverImage} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <FileText size={36} />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>By {authorName}</span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> {new Date(date).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  )
}
