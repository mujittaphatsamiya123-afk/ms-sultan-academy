'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { enrollInFreeCourse } from '@/lib/actions/enrollment'

export default function EnrollButton({
  courseId,
  isFree,
  price,
  isLoggedIn,
  alreadyEnrolled,
}: {
  courseId: string
  isFree: boolean
  price: number
  isLoggedIn: boolean
  alreadyEnrolled: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (alreadyEnrolled) {
    return (
      <button
        onClick={() => router.push('/student')}
        className="w-full flex items-center justify-center gap-2 bg-brand-500/10 text-brand-600 font-bold py-4 rounded-2xl"
      >
        <CheckCircle2 size={20} /> Go to Course
      </button>
    )
  }

  const handleClick = async () => {
    if (!isLoggedIn) {
      router.push(`/register?next=/courses`)
      return
    }

    if (isFree) {
      setLoading(true)
      const result = await enrollInFreeCourse(courseId)
      setLoading(false)

      if (result.error) {
        setError(result.error)
        return
      }
      router.push('/student')
      router.refresh()
    } else {
      router.push(`/checkout/${courseId}`)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand-500/20 transition-all"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading
          ? 'Enrolling...'
          : isFree
          ? 'Enroll Free Now'
          : `Enroll for ₦${Number(price).toLocaleString()}`}
      </button>
      {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
    </div>
  )
}
