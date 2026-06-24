import { NextResponse, NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'
import { sendEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, body: emailBody, recipientIds, customRecipients } = body
    
    const supabase = getSupabaseServerClient()
    
    // Resolve email recipients list
    let targetEmails: string[] = []

    if (recipientIds === 'all') {
      // Fetch active subscribers from database
      const { data: subscribers, error } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .eq('status', 'active')
      
      if (!error && subscribers) {
        targetEmails = subscribers.map((sub: any) => sub.email)
      }
    } else if (Array.isArray(recipientIds)) {
      // If IDs are passed, fetch their matching emails
      const { data: subscribers, error } = await supabase
        .from('newsletter_subscribers')
        .select('email')
        .in('id', recipientIds)
      
      if (!error && subscribers) {
        targetEmails = subscribers.map((sub: any) => sub.email)
      }
    }

    // Add any custom raw recipient emails entered in the client form
    if (customRecipients) {
      const parsedCustom = typeof customRecipients === 'string'
        ? customRecipients.split(',').map((e: string) => e.trim()).filter((e: string) => e.length > 0)
        : Array.isArray(customRecipients) ? customRecipients : []
      targetEmails = [...new Set([...targetEmails, ...parsedCustom])]
    }

    // Default fallback if no subscribers in DB yet
    if (targetEmails.length === 0) {
      targetEmails = [process.env.EMAIL_USER || 'wccgarmentsllc@gmail.com']
    }

    // Trigger Nodemailer
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
        <div style="text-align: center; border-bottom: 2px solid #c5a880; padding-bottom: 15px;">
          <h2 style="color: #c5a880; margin: 0; text-transform: uppercase; letter-spacing: 2px;">WCC Fashions</h2>
          <p style="font-size: 12px; color: #777; margin: 5px 0 0 0;">Premium Global Wholesale Apparel Solutions</p>
        </div>
        <div style="margin-top: 30px; font-size: 15px; color: #444;">
          ${emailBody.replace(/\n/g, '<br />')}
        </div>
        <div style="margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 15px; text-align: center;">
          You are receiving this email because you subscribed to corporate news and offers from WCC Fashions.<br />
          WCC B2B Wholesale Trading, Dubai, UAE.
        </div>
      </div>
    `
    
    const sendSuccess = await sendEmail({
      to: targetEmails,
      subject,
      html: emailHtml,
    })

    const dbRecord = await fetchWithFallback(
      async () => {
        const { data: newBroadcast, error } = await supabase
          .from('broadcasts')
          .insert([{ 
            subject, 
            body: emailBody, 
            sent_to: targetEmails 
          }])
          .select()
          .single()
        if (error) throw error
        return newBroadcast
      },
      { id: `mock-${Date.now()}`, subject, body: emailBody, sent_to: targetEmails },
      'Create Broadcast'
    )
    
    return NextResponse.json({ 
      success: sendSuccess, 
      data: dbRecord, 
      message: sendSuccess ? 'Broadcast sent successfully' : 'Broadcast recorded in DB but email dispatch failed' 
    })
  } catch (error) {
    console.error('Error sending broadcast:', error)
    return NextResponse.json({ success: false, error: 'Failed to dispatch broadcast' }, { status: 500 })
  }
}
