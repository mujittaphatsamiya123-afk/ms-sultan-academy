import Link from 'next/link'
import { ArrowRight, Play, Star } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-full px-4 py-1.5 text-sm font-medium text-brand-700 dark:text-brand-400 mb-6 animate-fade-up">
            <Star size={14} className="fill-gold-500 text-gold-500" />
            Trusted by 10,000+ students across Africa
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-fade-up">
            Make Money Online
            <span className="block text-brand-500">Using Just Your Phone</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto animate-fade-up">
            Practical, beginner-friendly courses teaching you real skills and
            AI tools to start earning online — no laptop, no experience,
            no wasted time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up">
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-7 py-4 rounded-2xl shadow-lg shadow-brand-500/30 transition-all hover:-translate-y-0.5"
            >
              Start Learning Free <ArrowRight size={18} />
            </Link>
            <Link
              href="/courses"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold px-7 py-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <Play size={18} className="text-brand-500" /> Watch Preview
            </Link>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            No credit card required · Free courses available
          </p>
        </div>
      </div>

      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold-400/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-brand-500/20 rounded-full blur-3xl" />
    </section>
  )
}
