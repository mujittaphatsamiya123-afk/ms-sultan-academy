'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LucideIcon } from 'lucide-react'
import { GraduationCap, X } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export default function Sidebar({
  navItems,
  open,
  onClose,
}: {
  navItems: NavItem[]
  open: boolean
  onClose: () => void
}) {
  const pathname = usePathname()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-50 transform transition-transform duration-200 md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-100 dark:border-slate-800">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <span className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
              <GraduationCap size={18} />
            </span>
            <span className="text-sm">M.S Sultan Academy</span>
          </Link>
          <button onClick={onClose} className="md:hidden p-1">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
