'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Download, Trash2, Loader2, Award } from 'lucide-react'
import { revokeCertificate } from '@/lib/actions/admin-certificates'

interface Certificate {
  id: string
  certificate_url: string | null
  issued_at: string
  student: { full_name: string | null; email: string } | null
  course: { title: string } | null
}

export default function CertificatesManager({ certificates }: { certificates: Certificate[] }) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)

  const filtered = certificates.filter(
    (c) =>
      c.student?.full_name?.toLowerCase().includes(query.toLowerCase()) ||
      c.student?.email.toLowerCase().includes(query.toLowerCase()) ||
      c.course?.title.toLowerCase().includes(query.toLowerCase())
  )

  const handleRevoke = async (id: string, studentName: string) => {
    if (!confirm(`Revoke this certificate for ${studentName}? This cannot be undone.`)) return
    setBusyId(id)
    const result = await revokeCertificate(id)
    setBusyId(null)
    if (result.error) return alert(result.error)
    router.refresh()
  }

  return (
    <div>
      <div className="relative max-w-sm mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by student or course..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Course</th>
                <th className="px-4 py-3 font-medium">Issued</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.student?.full_name || '—'}</p>
                    <p className="text-xs text-slate-400">{c.student?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{c.course?.title}</td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{new Date(c.issued_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {c.certificate_url && (
                        <a href={c.certificate_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700">
                          <Download size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => handleRevoke(c.id, c.student?.full_name || c.student?.email || 'this student')}
                        disabled={busyId === c.id}
                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 disabled:opacity-50"
                      >
                        {busyId === c.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-10">
            <Award className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-slate-400 text-sm">No certificates issued yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
