import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient, proxyImageUrl } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const division = searchParams.get('division')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const is_new = searchParams.get('is_new')
    const is_offer = searchParams.get('is_offer')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')

    let data: any[] = []
    let count: number | null = 0

    try {
      const supabase = getSupabaseServerClient()
      let query = supabase.from('products').select('*', { count: 'exact' })

      if (division) query = query.eq('division_slug', division)
      if (category) query = query.ilike('category', `%${category}%`)
      if (featured === 'true') query = query.eq('featured', true)
      if (is_new === 'true') query = query.eq('is_new', true)
      if (is_offer === 'true') query = query.eq('is_offer', true)
      if (search) {
        query = query.or(`name.ilike.%${search}%,category.ilike.%${search}%`)
      }

      query = query.range(offset, offset + limit - 1)
      
      const res = await query
      if (res.error) throw res.error
      data = res.data || []
      count = res.count
    } catch (dbError) {
      console.warn('Supabase fetch failed or not configured, returning empty list:', dbError)
      data = []
      count = 0
    }

    const formattedData = data.map((p) => ({
      ...p,
      images: Array.isArray(p.images) ? p.images.map(proxyImageUrl) : [],
      division_id: p.id,
      category_id: null,
      description: p.short_description,
      video_url: null,
      published: true,
      view_count: p.view_count || 0,
      enquiry_count: p.enquiry_count || 0,
      division: {
        id: p.id,
        name: p.division,
        slug: p.division_slug,
        accent_color: '#3B82F6',
      },
      category: {
        id: p.id,
        name: p.category,
        slug: p.category ? p.category.toLowerCase().replace(/\s+/g, '-') : '',
      },
      categories: Array.isArray(p.categories) ? p.categories.map((c: any) => ({
        id: p.id,
        name: typeof c === 'string' ? c : c.name,
        slug: (typeof c === 'string' ? c : c.name || '').toLowerCase().replace(/\s+/g, '-')
      })) : (p.category ? [{
        id: p.id,
        name: p.category,
        slug: p.category.toLowerCase().replace(/\s+/g, '-')
      }] : []),
    }))

    return NextResponse.json(
      { success: true, data: formattedData, total: count || 0, limit, offset },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
        },
      }
    )
  } catch (error: any) {
    console.error('Products route error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
