import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { revalidateAllPublicPages } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('id')

    const supabase = getSupabaseServerClient()

    if (sectionId) {
      // Get specific section
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('key', sectionId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 is not found
        throw error
      }

      return NextResponse.json({ success: true, data: data?.content || null }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      })
    } else {
      // Get all sections
      const { data, error } = await supabase
        .from('website_content')
        .select('*')

      if (error) throw error

      return NextResponse.json({ success: true, data }, {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
      })
    }
  } catch (error: any) {
    console.error('Failed to fetch website content:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionId = searchParams.get('id')
    const body = await request.json()

    if (!sectionId) {
      return NextResponse.json({ success: false, message: 'Section ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Upsert the content
    const { data, error } = await supabase
      .from('website_content')
      .upsert({ 
        key: sectionId, 
        content: body 
      }, { onConflict: 'key' })
      .select()
      .single()

    if (error) throw error

    // Flush Vercel edge cache for all public pages immediately — no redeploy needed
    revalidateAllPublicPages()

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Failed to update website content:', error)
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
