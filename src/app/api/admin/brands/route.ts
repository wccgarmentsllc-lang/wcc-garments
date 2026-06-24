import { NextResponse, NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
import { fetchWithFallback } from '@/lib/db-service'
import { MOCK_BRANDS } from '@/lib/constants'

export async function GET() {
  try {
    const data = await fetchWithFallback(
      async () => {
        const supabase = getSupabaseServerClient()
        const { data: brands, error } = await supabase
          .from('brands')
          .select('*')
          .order('display_order', { ascending: true })
        if (error) throw error
        return brands || []
      },
      MOCK_BRANDS,
      'Fetch Brands'
    )
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch brands' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getSupabaseServerClient()
    
    const data = await fetchWithFallback(
      async () => {
        const { data: newBrand, error } = await supabase
          .from('brands')
          .insert([body])
          .select()
          .single()
        if (error) throw error
        return newBrand
      },
      { ...body, id: `mock-${Date.now()}` },
      'Create Brand'
    )
    return NextResponse.json({ success: true, data, message: 'Brand created successfully' })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json({ success: false, error: 'Failed to create brand' }, { status: 500 })
  }
}
