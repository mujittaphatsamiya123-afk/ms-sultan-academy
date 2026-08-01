'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { contactRateLimit } from '@/lib/security/rate-limit'
import { contactFormSchema } from '@/lib/validations/api'

export async function submitContactForm(formData: {
  name: string
  email: string
  message: string
}) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for') || 'unknown'

  const { success } = await contactRateLimit.limit(ip)
  if (!success) return { error: 'Too many messages sent. Please try again later.' }

  const parsed = contactFormSchema.safeParse(formData)
  if (!parsed.success) return { error: 'Please check your input and try again.' }

  const supabase = await createClient()
  const { error } = await supabase.from('contact_messages').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  })

  if (error) return { error: 'Something went wrong. Please try again.' }
  return { success: true }
}
