'use client'

import { Menu, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import NotificationBell from './NotificationBell'
import ThemeToggle from '@/components/theme/ThemeToggle'

interface NotificationItem {
  id: string
  title: string
  message: string | null
  is_read: boolean
  created_at: string
}

export default function Topbar({
  onMenuClick,
  fullName,
  userId,
  notifications,
  notificationCount,
  notificationsHref,
}: {
  onMenuClick: () => void
  fullName: string
  userId: string
  notifications: NotificationItem[]
  notificationCount: number
  notificationsHref?: string
}) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = fullName
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6">
      <button onClick={onMenuClick} className="md:hidden p-2 -ml-2">
        <Menu size={22} />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <NotificationBell
          userId={userId}
          notifications={notifications}
          unreadCount={notificationCount}
          viewAllHref={notificationsHref}
        />

        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
            {initials || 'U'}
          </div>
          <span className="hidden sm:inline text-sm font-medium">{fullName}</span>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
          aria-label="Log out"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}
