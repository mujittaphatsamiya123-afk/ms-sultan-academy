import { redirect } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Megaphone,
  HelpCircle,
  FileText,
  Tag,
  Award,
  BarChart3,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStudentProfile, getUnreadNotificationsCount } from '@/lib/queries/student'
import { getAllNotifications } from '@/lib/queries/notifications'
import DashboardShell from '@/components/dashboard/DashboardShell'

const adminNavItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Courses', href: '/admin/courses', icon: BookOpen },
  { label: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Payments', href: '/admin/payments', icon: CreditCard },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Certificates', href: '/admin/certificates', icon: Award },
  { label: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
]

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const profile = await getStudentProfile(user.id)

  // Defense-in-depth: middleware already blocks non-admins,
  // but we double-check here since this layout renders sensitive data.
  if (profile?.role !== 'admin') redirect('/student')

  const notificationCount = await getUnreadNotificationsCount(user.id)
  const notifications = await getAllNotifications(user.id)

  return (
    <DashboardShell
      navItems={adminNavItems}
      fullName={profile?.full_name || 'Admin'}
      userId={user.id}
      notifications={notifications}
      notificationCount={notificationCount}
      notificationsHref="/admin"
    >
      {children}
    </DashboardShell>
  )
}
