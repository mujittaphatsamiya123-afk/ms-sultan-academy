import { Bell, CheckCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getAllNotifications } from '@/lib/queries/notifications'
import { markAllNotificationsRead } from '@/lib/actions/notifications'

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const notifications = await getAllNotifications(user!.id)
  const unreadCount = notifications.filter((n) => !n.is_read).length
  const userId = user!.id

  async function handleMarkAll() {
    'use server'
    await markAllNotificationsRead(userId)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        {unreadCount > 0 && (
          <form action={handleMarkAll}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-600"
            >
              <CheckCheck size={16} /> Mark all read
            </button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <Bell className="mx-auto text-slate-300 mb-3" size={40} />
          <p className="font-semibold">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 ${
                !n.is_read
                  ? 'border-brand-200 dark:border-brand-800 bg-brand-500/5'
                  : 'border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-sm">{n.title}</p>
                {!n.is_read && <span className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0 mt-1.5" />}
              </div>
              {n.message && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{n.message}</p>
              )}
              <p className="text-xs text-slate-400 mt-2">
                {new Date(n.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
