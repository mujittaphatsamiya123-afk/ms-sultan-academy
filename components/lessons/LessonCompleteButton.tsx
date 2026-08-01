'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, PartyPopper } from 'lucide-react'
import { markLessonComplete } from '@/lib/actions/progress'

export default function LessonCompleteButton({
  lessonId,
  courseId,
  courseSlug,
  isCompleted,
  nextLessonId,
  isLastLesson,
}: {
  lessonId: string
  courseId: string
  courseSlug: string
  isCompleted: boolean
  nextLessonId?: string
  isLastLesson: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    const result = await markLessonComplete(lessonId, courseId, courseSlug)
    setLoading(false)

    if (result.success) {
      setJustCompleted(true)
      if (result.isFullyComplete) {
        setShowCelebration(true)
      } else if (nextLessonId) {
        router.push(`/student/courses/${courseSlug}/lesson/${nextLessonId}`)
      }
      router.refresh()
    }
  }

  if (showCelebration) {
    return (
      <div className="flex items-center gap-2 text-brand-600 font-bold text-sm">
        <PartyPopper size={18} /> Course Completed!
      </div>
    )
  }

  const done = isCompleted || justCompleted

  return (
    <button
      onClick={handleClick}
      disabled={loading || done}
      className={`flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-xl transition-all ${
        done
          ? 'bg-brand-500/10 text-brand-600 cursor-default'
          : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20'
      }`}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {done ? (
        <>
          <CheckCircle2 size={16} /> Completed
        </>
      ) : isLastLesson ? (
        'Complete Course'
      ) : (
        'Mark Complete'
      )}
    </button>
  )
}
