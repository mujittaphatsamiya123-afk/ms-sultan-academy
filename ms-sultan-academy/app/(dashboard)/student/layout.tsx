import { redirect } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Award,
  User,
  Users,
  Wallet,
  Receipt,
  Heart,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStudentProfile, getUnreadNotificationsCount } from '@/lib/queries/student'
import { getAllNotifications } from '@/lib/queries/notifications'
import DashboardShell from '@/components/dashboard/DashboardShell'

const studentNavItems = [
  { label: 'Dashboard', href: '/student', icon: LayoutDashboard },
  { label: 'My Courses', href: '/student/courses', icon: BookOpen },
  { label: 'Certificates', href: '/student/certificates', icon: Award },
  { label: 'Wishlist', href: '/student/wishlist', icon: Heart },
  { label: 'Quiz History', href: '/student/quiz-history', icon: ClipboardCheck },
  { label: 'AI Study Plan', href: '/student/study-plan', icon: Sparkles },
  { label: 'Referrals', href: '/student/referrals', icon: Users },
  { label: 'Subscription', href: '/student/subscription', icon: Wallet },
  { label: 'Payment History', href: '/student/payments', icon: Receipt },
  { label: 'Profile', href: '/student/profile', icon: User },
]

export default async function StudentDashboardLayout({
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
  const notificationCount = await getUnreadNotificationsCount(user.id)
  const notifications = await getAllNotifications(user.id)

  return (
    <DashboardShell
      navItems={studentNavItems}
      fullName={profile?.full_name || 'Student'}
      userId={user.id}
      notifications={notifications}
      notificationCount={notificationCount}
      notificationsHref="/student/notifications"
    >
      {children}
    </DashboardShell>
  )
}
