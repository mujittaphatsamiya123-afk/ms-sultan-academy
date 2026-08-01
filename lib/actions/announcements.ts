'use server'

import { createClient } from '@/lib/supabase/server'
import { sendEmail, emailTemplate } from '@/lib/email/send'

export async function sendAnnouncement(title: string, message: string) {
  const supabase = await createClient()

  const { data: students } = await supabase.from('profiles').select('id, email').eq('role', 'student')

  if (!students || students.length === 0) return { error: 'No students found' }

  const notifications = students.map((s) => ({
    user_id: s.id,
    title,
    message,
  }))

  const { error } = await supabase.from('notifications').insert(notifications)
  if (error) return { error: error.message }

  const emails = students.map((s) => s.email).filter(Boolean) as string[]

  for (let i = 0; i < emails.length; i += 10) {
    const batch = emails.slice(i, i + 10)
    await Promise.all(
      batch.map((email) =>
        sendEmail({ to: email, subject: title, html: emailTemplate(title, message) })
      )
    )
    if (i + 10 < emails.length) await new Promise((r) => setTimeout(r, 500))
  }

  return { success: true, count: students.length }
}
