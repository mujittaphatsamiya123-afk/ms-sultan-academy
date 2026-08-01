'use client'

export default function VideoPlayer({ videoUrl, title }: { videoUrl: string | null; title: string }) {
  if (!videoUrl) {
    return (
      <div className="aspect-video bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
        No video available for this lesson
      </div>
    )
  }

  return (
    <div className="aspect-video bg-black rounded-2xl overflow-hidden">
      <video
        key={videoUrl}
        src={videoUrl}
        controls
        controlsList="nodownload"
        className="w-full h-full"
        title={title}
      />
    </div>
  )
}
