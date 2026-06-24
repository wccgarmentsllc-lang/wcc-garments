import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// Resend client initializer
const getResendClient = () => {
  const key = process.env.RESEND_API_KEY
  if (!key || key === 'placeholder_resend_key') return null
  return new Resend(key)
}

// Gmail SMTP transporter initializer
const getGmailTransporter = () => {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_APP_PASSWORD

  if (!user || !pass || user === 'placeholder_email_user') {
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  })
}

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  attachments?: any[]
}

export async function sendEmail({ to, subject, html, attachments }: SendEmailParams): Promise<boolean> {
  const recipients = Array.isArray(to) ? to : [to]

  // Try 1: Resend (Dedicated enterprise delivery provider)
  const resend = getResendClient()
  if (resend) {
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
      await resend.emails.send({
        from: `WCC Fashions <${fromEmail}>`,
        to: recipients,
        subject,
        html,
        attachments,
      })
      console.log(`Email dispatched via Resend to: ${recipients.join(', ')}`)
      return true
    } catch (resendError) {
      console.error('Resend delivery failed. Trying Gmail SMTP fallback...', resendError)
    }
  }

  // Try 2: Gmail SMTP (Developer / Small-business fallback)
  const gmailTransporter = getGmailTransporter()
  if (gmailTransporter) {
    try {
      const recipientString = recipients.join(', ')
      await gmailTransporter.sendMail({
        from: `"WCC Platform Support" <${process.env.EMAIL_USER}>`,
        to: recipientString,
        subject,
        html,
        attachments,
      })
      console.log(`Email dispatched via Gmail SMTP to: ${recipientString}`)
      return true
    } catch (gmailError) {
      console.error('Gmail SMTP delivery failed:', gmailError)
    }
  }

  // Fallback: Simulation mode
  console.log(`[SIMULATED EMAIL BROADCAST]
To: ${recipients.join(', ')}
Subject: ${subject}
Content: ${html.substring(0, 300)}... (truncated)
`)
  return true
}
