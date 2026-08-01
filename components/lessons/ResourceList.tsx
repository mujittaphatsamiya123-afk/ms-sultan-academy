import { FileText, Download, Music, Paperclip } from 'lucide-react'

interface Resource {
  id: string
  title: string
  file_url: string
  file_type: string
}

export default function ResourceList({ resources }: { resources: Resource[] }) {
  if (resources.length === 0) return null

  const icons: Record<string, any> = { audio: Music, attachment: Paperclip, pdf: FileText }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 mt-4">
      <h3 className="font-bold text-sm mb-3">Lesson Resources</h3>
      <div className="space-y-3">
        {resources.map((r) => {
          const Icon = icons[r.file_type] || FileText
          if (r.file_type === 'audio') {
            return (
              <div key={r.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                  <Music size={14} className="text-brand-500" /> {r.title}
                </div>
                <audio controls src={r.file_url} className="w-full h-10" />
              </div>
            )
          }
          return (
            <a
              key={r.id}
              href={r.file_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center flex-shrink-0">
                <Icon size={16} />
              </span>
              <span className="text-sm font-medium flex-1 truncate">{r.title}</span>
              <Download size={16} className="text-slate-400 flex-shrink-0" />
            </a>
          )
        })}
      </div>
    </div>
  )
}
