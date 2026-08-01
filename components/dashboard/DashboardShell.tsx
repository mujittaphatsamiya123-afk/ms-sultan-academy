'use client'

import { useState } from 'react'
import Sidebar, { NavItem } from './Sidebar'
import Topbar from './Topbar'

interface NotificationItem {
  id: string
  title: string
  message: string | null
  is_read: boolean
  created_at: string
}

export default function DashboardShell({
  navItems,
  fullName,
  userId,
  notifications,
  notificationCount,
  notificationsHref,
  children,
}: {
  navItems: NavItem[]
  fullName: string
  userId: string
  notifications: NotificationItem[]
  notificationCount: number
  notificationsHref?: string
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar navItems={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          fullName={fullName}
          userId={userId}
          notifications={notifications}
          notificationCount={notificationCount}
          notificationsHref={notificationsHref}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
