'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2, User, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { updateProfile, updateProfileAvatar } from '@/lib/actions/profile'

export default function ProfileForm({
  initialFullName,
  email,
  initialPhone,
  avatarUrl,
}: {
  initialFullName: string
  email: string
  initialPhone: string
  avatarUrl: string | null
}) {
  const [fullName, setFullName] = useState(initialFullName)
  const [phone, setPhone] = useState(initialPhone)
  const [avatar, setAvatar] = useState(avatarUrl)
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleAvatarUpload = async (file: File) => {
    setUploadingAvatar(true)
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const filePath = `${Date.now()}.${fileExt}`

    const { error } = await supabase.storage.from('avatars').upload(filePath, file)
    if (!error) {
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatar(data.publicUrl)
      await updateProfileAvatar(data.publicUrl)
    }
    setUploadingAvatar(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    await updateProfile({ fullName, phone })
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center gap-4 mb-8">
        <div className="relative w-20 h-20 rounded-full bg-brand-500/10 flex items-center justify-center overflow-hidden">
          {avatar ? (
            <Image src={avatar} alt="Avatar" fill className="object-cover" />
          ) : (
            <User size={32} className="text-brand-500" />
          )}
          {uploadingAvatar && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 size={20} className="animate-spin text-white" />
            </div>
          )}
        </div>
        <label className="flex items-center gap-2 text-sm font-semibold text-brand-600 cursor-pointer">
          <Camera size={16} /> Change Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleAvatarUpload(file)
            }}
          />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Email Address</label>
          <input
            value={email}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-400 outline-none cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Phone Number</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-70 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {saved ? 'Saved!' : loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
