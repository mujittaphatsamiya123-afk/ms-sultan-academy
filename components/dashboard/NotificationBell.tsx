'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck } from 'lucide-react'
import { markAllNotificationsRead } from '@/lib/actions/notifications'

interface Notification {
  id: string
  title: string
  message: string | null
  is_read: boolean
  created_at: string
}

export default function NotificationBell({
  userId,
  notifications,
  unreadCount,
  viewAllHref = '/student/notifications',
}: {
  userId: string
  notifications: Notification[]
  unreadCount: number
  viewAllHref?: string
}) {
  const [open, setOpen] = useState(false)

  const handleMarkAll = async () => {
    await markAllNotificationsRead(userId)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-gold-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  className="text-xs text-brand-600 font-medium flex items-center gap-1"
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-center py-8 text-sm text-slate-400">No notifications yet</p>
              ) : (
                notifications.slice(0, 6).map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0 ${
                      !n.is_read ? 'bg-brand-500/5' : ''
                    }`}
                  >
                    <p className="text-sm font-semibold">{n.title}</p>
                    {n.message && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {n.message}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1">
                      {new Date(n.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            <Link
              href={viewAllHref}
              onClick={() => setOpen(false)}
              className="block text-center py-3 text-sm font-semibold text-brand-600 border-t border-slate-100 dark:border-slate-800"
            >
              View All
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
