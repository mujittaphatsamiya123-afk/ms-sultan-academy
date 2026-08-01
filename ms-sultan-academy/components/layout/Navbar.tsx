'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, GraduationCap } from 'lucide-react'
import ThemeToggle from '@/components/theme/ThemeToggle'

const navLinks = [
  { label: 'Courses', href: '/courses' },
  { label: 'AI Tools', href: '/ai-tools' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white">
            <GraduationCap size={20} />
          </span>
          <span className="hidden sm:inline">M.S Sultan Academy</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-700 dark:text-slate-200 px-4 py-2 hover:text-brand-600 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 px-5 py-2.5 rounded-xl shadow-md shadow-brand-500/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Link
              href="/login"
              className="text-center py-2.5 font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-center py-2.5 font-semibold text-white bg-brand-500 rounded-xl"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
