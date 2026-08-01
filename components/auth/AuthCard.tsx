import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

export default function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950 px-4 py-10">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 font-bold text-xl mb-8">
          <span className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white">
            <GraduationCap size={22} />
          </span>
          M.S Sultan Academy
        </Link>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8">
          <h1 className="text-2xl font-bold mb-1">{title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  )
}
