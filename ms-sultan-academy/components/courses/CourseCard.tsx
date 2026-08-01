import Link from 'next/link'
import Image from 'next/image'
import { PlayCircle, Signal } from 'lucide-react'
import WishlistButton from './WishlistButton'

interface Props {
  courseId: string
  slug: string
  title: string
  description: string | null
  thumbnail: string | null
  isFree: boolean
  price: number
  level: string
  categoryName?: string
  isWishlisted?: boolean
  showWishlist?: boolean
}

export default function CourseCard({
  courseId,
  slug,
  title,
  description,
  thumbnail,
  isFree,
  price,
  level,
  categoryName,
  isWishlisted = false,
  showWishlist = true,
}: Props) {
  return (
    <Link
      href={`/courses/${slug}`}
      className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <div className="relative h-40 bg-slate-100 dark:bg-slate-800">
        {thumbnail ? (
          <Image src={thumbnail} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <PlayCircle size={40} />
          </div>
        )}
        <span
          className={`absolute top-2 right-2 text-xs font-bold px-2.5 py-1 rounded-full ${
            isFree ? 'bg-brand-500 text-white' : 'bg-gold-500 text-white'
          }`}
        >
          {isFree ? 'FREE' : `₦${Number(price).toLocaleString()}`}
        </span>
        {showWishlist && (
          <div className="absolute top-2 left-2">
            <WishlistButton courseId={courseId} initialWishlisted={isWishlisted} />
          </div>
        )}
      </div>

      <div className="p-4">
        {categoryName && (
          <span className="text-xs font-medium text-brand-600 uppercase tracking-wide">
            {categoryName}
          </span>
        )}
        <h3 className="font-bold mt-1 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
            {description}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-xs text-slate-400 capitalize">
          <Signal size={12} /> {level}
        </div>
      </div>
    </Link>
  )
}
