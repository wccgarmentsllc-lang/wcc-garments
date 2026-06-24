import { NextRequest, NextResponse } from 'next/server'
import { EnquirySchema } from '@/lib/validations'
import { ZodError } from 'zod'
import { getSupabaseServerClient, isSupabaseConfigured } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'
import { sendEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = EnquirySchema.parse(body)

    const enquiryId = crypto.randomUUID()

    console.log('New enquiry received:', {
      id: enquiryId,
      company: validated.company,
      country: validated.country,
      email: validated.email,
      source: validated.source || 'website',
    })

    const finalId = await fetchWithFallback(
      async () => {
        const supabase = getSupabaseServerClient()
        const { data, error } = await supabase
          .from('enquiries')
          .insert([
            {
              id: enquiryId,
              name: validated.name,
              company: validated.company,
              country: validated.country,
              phone: validated.phone,
              email: validated.email,
              business_type: validated.business_type,
              product_interest: validated.product_interest,
              quantity_range: validated.quantity_range,
              message: validated.message,
              product_id: validated.product_id || null,
              product_name: validated.product_name || null,
              source: validated.source || 'website',
            },
          ])
          .select('id')
          .single()

        if (error) {
          throw error
        }
        return data?.id || enquiryId
      },
      enquiryId,
      'Insert Enquiry'
    )

    // Asynchronously increment product enquiry analytics and notify admin
    try {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseServerClient()
        if (validated.product_name) {
          const { data: prod } = await supabase
            .from('products')
            .select('slug')
            .eq('name', validated.product_name)
            .maybeSingle()
          if (prod) {
            await supabase.rpc('increment_product_enquiries', { product_slug: prod.slug })
          }
        }
      }

      const adminEmail = process.env.RESEND_TO_EMAIL || process.env.EMAIL_USER || 'wccgarmentsllc@gmail.com'
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee;">
          <div style="text-align: center; border-bottom: 2px solid #c5a880; padding-bottom: 15px;">
            <h2 style="color: #c5a880; margin: 0; text-transform: uppercase; letter-spacing: 2px;">New Wholesale Enquiry</h2>
            <p style="font-size: 12px; color: #777; margin: 5px 0 0 0;">Received from WCC Fashions Platform</p>
          </div>
          <div style="margin-top: 25px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f9f9f9;"><td style="padding: 10px; font-weight: bold; width: 150px;">Name:</td><td style="padding: 10px;">${validated.name}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Company:</td><td style="padding: 10px;">${validated.company || 'N/A'}</td></tr>
              <tr style="background-color: #f9f9f9;"><td style="padding: 10px; font-weight: bold;">Country:</td><td style="padding: 10px;">${validated.country}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Email:</td><td style="padding: 10px;">${validated.email}</td></tr>
              <tr style="background-color: #f9f9f9;"><td style="padding: 10px; font-weight: bold;">Phone:</td><td style="padding: 10px;">${validated.phone || 'N/A'}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Business Type:</td><td style="padding: 10px;">${validated.business_type}</td></tr>
              <tr style="background-color: #f9f9f9;"><td style="padding: 10px; font-weight: bold;">Product Interest:</td><td style="padding: 10px;">${Array.isArray(validated.product_interest) ? validated.product_interest.join(', ') : validated.product_interest}</td></tr>
              <tr><td style="padding: 10px; font-weight: bold;">Quantity Range:</td><td style="padding: 10px;">${validated.quantity_range}</td></tr>
              ${validated.product_name ? `<tr style="background-color: #f9f9f9;"><td style="padding: 10px; font-weight: bold;">Target Product:</td><td style="padding: 10px;">${validated.product_name}</td></tr>` : ''}
            </table>
            <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #c5a880;">
              <p style="margin: 0; font-weight: bold;">Message:</p>
              <p style="margin: 5px 0 0 0; font-style: italic;">${validated.message}</p>
            </div>
          </div>
        </div>
      `
      await sendEmail({
        to: adminEmail,
        subject: `[Wholesale Enquiry] ${validated.company || validated.name} - ${validated.country}`,
        html: emailHtml
      })
    } catch (analyticsErr) {
      console.error('Enquiry notification background task failed:', analyticsErr)
    }

    return NextResponse.json({
      success: true,
      message: 'Enquiry received successfully. Our team will contact you within 24 hours.',
      id: finalId,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Enquiry error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit enquiry' },
      { status: 500 }
    )
  }
}
