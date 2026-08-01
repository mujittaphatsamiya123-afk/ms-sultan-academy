'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Loader2, FileText, Video, Music, Paperclip, X } from 'lucide-react'
import { createLesson, deleteLesson, addResource } from '@/lib/actions/courses'
import FileUploader from './FileUploader'

interface Resource {
  id: string
  title: string
  file_url: string
  file_type: string
}

interface Lesson {
  id: string
  title: string
  video_url: string | null
  duration_minutes: number | null
  resources: Resource[]
}

type ResourceType = 'pdf' | 'audio' | 'attachment'

export default function LessonManager({
  courseId,
  lessons,
}: {
  courseId: string
  lessons: Lesson[]
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [duration, setDuration] = useState(0)

  const [resourceTypeByLesson, setResourceTypeByLesson] = useState<Record<string, ResourceType>>({})

  const setResourceType = (lessonId: string, type: ResourceType) => {
    setResourceTypeByLesson((prev) => ({ ...prev, [lessonId]: type }))
  }

  const handleAddLesson = async () => {
    if (!title.trim()) return
    setLoading(true)
    await createLesson({
      courseId,
      title,
      videoUrl,
      content,
      position: lessons.length,
      durationMinutes: duration,
    })
    setLoading(false)
    setShowForm(false)
    setTitle('')
    setContent('')
    setVideoUrl('')
    setDuration(0)
    router.refresh()
  }

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Delete this lesson and its resources?')) return
    await deleteLesson(lessonId, courseId)
    router.refresh()
  }

  const handleAddResource = async (lessonId: string, url: string, name: string, type: string) => {
    await addResource({ lessonId, courseId, title: name, fileUrl: url, fileType: type })
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson, i) => {
        const activeType = resourceTypeByLesson[lesson.id] || 'pdf'
        return (
          <div
            key={lesson.id}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-bold">{lesson.title}</h4>
                  {lesson.video_url && (
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Video size={12} /> Video attached
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDeleteLesson(lesson.id)}
                className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {lesson.resources.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {lesson.resources.map((r) => (
                  <span key={r.id} className="flex items-center gap-1.5 text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                    {r.file_type === 'audio' ? <Music size={12} /> : r.file_type === 'attachment' ? <Paperclip size={12} /> : <FileText size={12} />}
                    {r.title}
                  </span>
                ))}
              </div>
            )}

            <details className="text-sm">
              <summary className="cursor-pointer text-brand-600 font-medium">
                + Add Resource (PDF, Audio, or Attachment)
              </summary>
              <div className="mt-3 space-y-3 max-w-sm">
                <div className="flex gap-2 text-xs">
                  {(['pdf', 'audio', 'attachment'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setResourceType(lesson.id, t)}
                      className={`px-3 py-1.5 rounded-lg font-medium capitalize ${
                        activeType === t
                          ? 'bg-brand-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <FileUploader
                  bucket="resources"
                  accept={activeType === 'audio' ? 'audio/*' : activeType === 'pdf' ? '.pdf,.epub' : '*'}
                  label=""
                  maxSizeMB={activeType === 'audio' ? 50 : 20}
                  onUploaded={(url, name) => handleAddResource(lesson.id, url, name, activeType)}
                />
              </div>
            </details>
          </div>
        )
      })}

      {showForm ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold">New Lesson</h4>
            <button onClick={() => setShowForm(false)}>
              <X size={18} className="text-slate-400" />
            </button>
          </div>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Lesson title"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Lesson notes / text content (optional)"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />

          <input
            type="number"
            value={duration || ''}
            onChange={(e) => setDuration(Number(e.target.value))}
            placeholder="Duration in minutes"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />

          <FileUploader bucket="videos" accept="video/*" label="Lesson Video" maxSizeMB={500} onUploaded={(url) => setVideoUrl(url)} />

          <button
            onClick={handleAddLesson}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-semibold py-3 rounded-xl transition-all"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Save Lesson
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-400 text-slate-500 hover:text-brand-600 font-medium py-4 rounded-2xl transition-colors"
        >
          <Plus size={18} /> Add Lesson
        </button>
      )}
    </div>
  )
}
