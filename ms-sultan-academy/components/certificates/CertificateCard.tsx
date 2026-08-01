import Image from 'next/image'
import { Award, Download } from 'lucide-react'

export default function CertificateCard({
  courseTitle,
  thumbnail,
  issuedAt,
  certificateUrl,
}: {
  courseTitle: string
  thumbnail: string | null
  issuedAt: string
  certificateUrl: string | null
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
      <div className="relative h-32 bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
        {thumbnail ? (
          <Image src={thumbnail} alt={courseTitle} fill className="object-cover opacity-30" />
        ) : null}
        <Award className="text-white relative z-10" size={40} />
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-1 line-clamp-2">{courseTitle}</h3>
        <p className="text-xs text-slate-500 mb-4">
          Issued {new Date(issuedAt).toLocaleDateString()}
        </p>
        {certificateUrl ? (
          <a
            href={certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold text-sm py-2.5 rounded-xl transition-colors"
          >
            <Download size={14} /> Download PDF
          </a>
        ) : (
          <p className="text-xs text-center text-slate-400 py-2.5">Generating...</p>
        )}
      </div>
    </div>
  )
}
