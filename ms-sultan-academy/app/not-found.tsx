import Link from 'next/link'
import { GraduationCap, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center text-white mx-auto mb-6">
          <GraduationCap size={28} />
        </div>

        <h1 className="text-6xl font-extrabold text-brand-500 mb-2">404</h1>
        <h2 className="text-xl font-bold mb-2">Page Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <Home size={18} /> Go Home
          </Link>
          <Link
            href="/courses"
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Search size={18} /> Browse Courses
          </Link>
        </div>
      </div>
    </div>
  )
}
