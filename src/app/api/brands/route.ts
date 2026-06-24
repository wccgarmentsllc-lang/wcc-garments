import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
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
      'Fetch Brands Public'
    )
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch brands' }, { status: 500 })
  }
}
