import { NextResponse, NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { revalidateAllPublicPages } from '@/lib/revalidate'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let data: any[] = []
    try {
      const supabase = getSupabaseServerClient()
      const { data: dbData, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      data = dbData || []
    } catch (dbError) {
      console.warn('Admin Get Products DB error, returning empty list:', dbError)
      data = []
    }

    const formatted = data.map((p) => ({
      ...p,
      published: true,
    }))

    return NextResponse.json({ success: true, data: formatted })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getSupabaseServerClient()
    
    // Ensure slug uniqueness across divisions
    if (body.slug) {
      let slug = body.slug
      const { data: existing } = await supabase
        .from('products')
        .select('id, division_slug')
        .eq('slug', slug)
      
      if (existing && existing.length > 0) {
        // Slug already exists. Try appending division_slug as suffix
        const divSuffix = body.division_slug || body.division?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        if (divSuffix) {
          slug = `${slug}-${divSuffix}`
        } else {
          slug = `${slug}-1`
        }
        
        // Double check if this new slug is also taken
        const { data: existingDouble } = await supabase
          .from('products')
          .select('id')
          .eq('slug', slug)
        
        if (existingDouble && existingDouble.length > 0) {
          let counter = 1
          let tempSlug = `${slug}-${counter}`
          while (true) {
            const { data: existingCounter } = await supabase
              .from('products')
              .select('id')
              .eq('slug', tempSlug)
            if (!existingCounter || existingCounter.length === 0) {
              slug = tempSlug
              break
            }
            counter++
            tempSlug = `${slug}-${counter}`
          }
        }
      }
      body.slug = slug
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([body])
      .select()
      .single()
    
    if (error) throw error

    // Flush Vercel edge cache for all public pages immediately
    revalidateAllPublicPages()

    return NextResponse.json({
      success: true,
      message: 'Product created',
      data,
    })
  } catch (error: any) {
    console.error('Admin Create Product error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
