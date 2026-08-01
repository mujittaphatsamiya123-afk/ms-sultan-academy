import Image from 'next/image'
import { ExternalLink, Bot } from 'lucide-react'

export default function AIToolCard({
  name,
  description,
  logo,
  websiteUrl,
  category,
}: {
  name: string
  description: string | null
  logo: string | null
  websiteUrl: string | null
  category: string | null
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:shadow-lg transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
          {logo ? (
            <Image src={logo} alt={name} width={48} height={48} className="object-cover" />
          ) : (
            <Bot className="text-brand-500" size={22} />
          )}
        </div>
        <div>
          <h3 className="font-bold">{name}</h3>
          {category && (
            <span className="text-xs text-brand-600 font-medium uppercase">{category}</span>
          )}
        </div>
      </div>

      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
          {description}
        </p>
      )}

      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-600"
        >
          Visit Tool <ExternalLink size={14} />
        </a>
      )}
    </div>
  )
}
