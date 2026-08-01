'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500 mx-auto mb-6">
          <AlertTriangle size={28} />
        </div>

        <h1 className="text-2xl font-bold mb-2">Something Went Wrong</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          We hit an unexpected error. Please try again, or head back to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <RefreshCcw size={18} /> Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold px-6 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Home size={18} /> Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
