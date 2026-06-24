import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/email-service'
import path from 'path'

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('catalogue_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data: data || [] })
  } catch (error) {
    console.error('Error fetching catalogue requests:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch catalogue requests' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and Status are required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // 1. Fetch current request details
    const { data: reqData, error: fetchError } = await supabase
      .from('catalogue_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !reqData) {
      return NextResponse.json({ success: false, error: 'Catalogue request not found' }, { status: 404 })
    }

    // 2. Update status in DB
    const { data: updatedData, error: updateError } = await supabase
      .from('catalogue_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // 3. If approved, dispatch the email
    if (status === 'approved') {
      const host = request.headers.get('host') || 'wccgarments.com'
      const proto = request.headers.get('x-forwarded-proto') || 'https'
      const baseUrl = `${proto}://${host}`

      const brandName = reqData.brand_slug === 'horeca24h' ? 'Horeca24h' : 'Aanya Homecraft'
      const catalogueType = reqData.brand_slug === 'horeca24h' ? 'Hospitality & Serveware' : 'Household & Cookware'
      const downloadLink = `${baseUrl}/api/catalogue-request/download?id=${reqData.id}`

      // Include logo inline attachment in all emails
      const logoPath = path.join(process.cwd(), 'public', 'images', 'wcc-logo-email.png')
      const attachments: any[] = [
        {
          filename: 'wcc-logo-email.png',
          path: logoPath,
          cid: 'wcclogo',
        },
      ]
      let attachmentMessage = ''
      let buttonHtml = ''

      // Horeca24h (~14.6 MB) is small enough for Gmail SMTP direct attachments
      if (reqData.brand_slug === 'horeca24h') {
        const filePath = path.join(process.cwd(), 'secure-catalogues', 'hospitality-catalogue.pdf')
        attachments.push({
          filename: 'WCC_Hospitality_Catalogue.pdf',
          path: filePath,
        })
        attachmentMessage = '<p style="color: #666; font-size: 13px; margin-bottom: 20px;">We have attached the catalogue PDF directly to this email for your convenience.</p>'
        buttonHtml = '' // PDF is attached, no button needed
      } else {
        attachmentMessage = '<p style="color: #666; font-size: 13px; margin-bottom: 20px;">Due to the high-resolution images and catalogue details, the file size is large. You can download the complete catalogue directly using the secure link below.</p>'
        buttonHtml = `
            <div style="text-align: center; margin: 30px 0 25px 0;">
              <a href="${downloadLink}" style="background-color: #3B82F6; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: inline-block; border-radius: 0px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                Download Catalogue PDF
              </a>
            </div>
        `
      }

      const emailHtml = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1a1a1a; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 25px;">
            <img src="cid:wcclogo" alt="WCC Fashions Logo" style="height: 55px; width: auto; margin-bottom: 12px; display: inline-block;" />
            <span style="font-size: 11px; font-weight: bold; letter-spacing: 3px; color: #3B82F6; text-transform: uppercase; display: block; margin-bottom: 5px;">WCC FASHIONS</span>
            <h2 style="color: #111827; margin: 0; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700;">Catalogue Delivery</h2>
          </div>
          <div>
            <p style="font-size: 15px; margin-bottom: 15px;">Dear <strong>${reqData.name}</strong>,</p>
            <p style="font-size: 15px; margin-bottom: 15px;">Thank you for your interest in WCC Fashions. Your request for our <strong>${brandName} (${catalogueType})</strong> catalogue has been approved by our administrative team.</p>
            
            ${attachmentMessage}
            
            ${buttonHtml}

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; font-size: 13px; color: #4b5563;">
              <p style="margin: 0;">Best regards,</p>
              <p style="margin: 5px 0 0 0; font-weight: bold; color: #111827;">WCC Enterprise Team</p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">Dubai, United Arab Emirates</p>
            </div>
          </div>
        </div>
      `

      try {
        await sendEmail({
          to: reqData.email,
          subject: `[Approved] Your WCC ${brandName} Catalogue Request`,
          html: emailHtml,
          attachments,
        })
      } catch (emailErr) {
        console.error('Failed to send approval email:', emailErr)
      }
    }

    return NextResponse.json({ success: true, data: updatedData })
  } catch (error) {
    console.error('Error updating catalogue request:', error)
    return NextResponse.json({ success: false, error: 'Failed to update catalogue request' }, { status: 500 })
  }
}
