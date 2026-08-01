import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'notifications@mssultanacademy.com',
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (err) {
    console.error('Email send failed:', err)
    return { error: 'Failed to send email' }
  }
}

export function emailTemplate(title: string, body: string, ctaText?: string, ctaUrl?: string) {
  return `
  <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
    <div style="width: 48px; height: 48px; background: #059669; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
      <span style="color: white; font-weight: bold; font-size: 18px;">MSA</span>
    </div>
    <h1 style="font-size: 20px; color: #0f172a; margin-bottom: 12px;">${title}</h1>
    <p style="color: #475569; line-height: 1.6; font-size: 14px;">${body}</p>
    ${ctaText && ctaUrl ? `
    <a href="${ctaUrl}" style="display: inline-block; background: #059669; color: white; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; margin-top: 16px;">
      ${ctaText}
    </a>` : ''}
    <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">M.S Sultan Academy</p>
  </div>`
}
