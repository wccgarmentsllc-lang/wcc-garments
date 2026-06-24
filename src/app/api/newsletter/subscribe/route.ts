import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'
import { subscriberStore } from '@/lib/newsletter-store'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    
    // Check for duplicates
    const { data: existing, error: checkError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Supabase check error:', checkError)
      throw checkError
    }

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'This email is already subscribed.' },
        { status: 409 }
      )
    }

    const { data: result, error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }])
      .select()
      .single()
    
    if (insertError) {
      console.error('Supabase insert error:', insertError)
      throw insertError
    }

    console.log(`[Newsletter] New subscriber: ${result.email}`)

    return NextResponse.json({ success: true, message: "You're on the list!" }, { status: 201 })
  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, message: 'Server error: ' + (error.message || 'Unknown error'), details: error }, { status: 500 })
  }
}

