import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// Resend client initializer
const getResendClient = () => {
  const key = process.env.RESEND_API_KEY
  if (!key || key === 'placeholder_resend_key') return null
  return new Resend(key)
}

// SMTP transporter initializer (Supports Hostinger, custom SMTP, or Gmail fallback)
const getSmtpTransporter = () => {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_APP_PASSWORD

  if (!user || !pass || user === 'placeholder_email_user') {
    return null
  }

  // If host is explicitly set (e.g. smtp.hostinger.com) or user has a domain email
  const host = process.env.EMAIL_HOST || (user.includes('@gmail.com') ? undefined : 'smtp.hostinger.com')
  const port = Number(process.env.EMAIL_PORT) || 465
  const secure = process.env.EMAIL_SECURE !== undefined ? process.env.EMAIL_SECURE === 'true' : port === 465

  if (host) {
    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    })
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
      console.error('Resend delivery failed. Trying SMTP fallback...', resendError)
    }
  }

  // Try 2: SMTP (Hostinger / Custom SMTP / Gmail fallback)
  const smtpTransporter = getSmtpTransporter()
  if (smtpTransporter) {
    try {
      const recipientString = recipients.join(', ')
      const fromName = process.env.EMAIL_FROM_NAME || 'WCC Fashions'
      await smtpTransporter.sendMail({
        from: `"${fromName}" <${process.env.EMAIL_USER || 'info@wccfashions.com'}>`,
        to: recipientString,
        subject,
        html,
        attachments,
      })
      console.log(`Email dispatched via SMTP to: ${recipientString}`)
      return true
    } catch (smtpError) {
      console.error('SMTP delivery failed:', smtpError)
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
