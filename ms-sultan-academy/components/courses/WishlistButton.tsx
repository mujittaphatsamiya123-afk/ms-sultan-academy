'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toggleWishlist } from '@/lib/actions/wishlist'

export default function WishlistButton({ courseId, initialWishlisted }: { courseId: string; initialWishlisted: boolean }) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [loading, setLoading] = useState(false)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    const result = await toggleWishlist(courseId)
    setLoading(false)
    if (result.success) setWishlisted(result.wishlisted!)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      aria-label="Toggle wishlist"
    >
      <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-400'} />
    </button>
  )
}
