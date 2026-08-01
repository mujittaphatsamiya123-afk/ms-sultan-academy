'use client'

import { useState, useRef } from 'react'
import { UploadCloud, Loader2, CheckCircle2, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  bucket: 'thumbnails' | 'videos' | 'resources' | 'avatars' | 'certificates'
  accept: string
  label: string
  onUploaded: (url: string, fileName: string) => void
  maxSizeMB?: number
}

export default function FileUploader({ bucket, accept, label, onUploaded, maxSizeMB = 50 }: Props) {
  const [uploading, setUploading] = useState(false)
  const [uploadedName, setUploadedName] = useState<string | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError('')

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File is too large. Max size is ${maxSizeMB}MB.`)
      return
    }

    setUploading(true)
    const supabase = createClient()

    const fileExt = file.name.split('.').pop()
    const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)

    setUploadedName(file.name)
    setUploading(false)
    onUploaded(data.publicUrl, file.name)
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1.5">{label}</label>}

      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 text-center cursor-pointer hover:border-brand-400 hover:bg-brand-50/50 dark:hover:bg-brand-900/10 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-brand-600">
            <Loader2 size={28} className="animate-spin" />
            <span className="text-sm font-medium">Uploading...</span>
          </div>
        ) : uploadedName ? (
          <div className="flex flex-col items-center gap-2 text-brand-600">
            <CheckCircle2 size={28} />
            <span className="text-sm font-medium">{uploadedName}</span>
            <span className="text-xs text-slate-400">Click to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <UploadCloud size={28} />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Click to upload
            </span>
            <span className="text-xs">Max {maxSizeMB}MB</span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
          <X size={12} /> {error}
        </p>
      )}
    </div>
  )
}
