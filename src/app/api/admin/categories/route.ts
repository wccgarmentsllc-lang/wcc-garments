import { NextResponse, NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'
import { DIVISIONS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await fetchWithFallback(
      async () => {
        const supabase = getSupabaseServerClient()
        const { data: categories, error } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: true })
        if (error) throw error
        return categories || []
      },
      DIVISIONS,
      'Fetch Categories'
    )
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = getSupabaseServerClient()
    
    // We assume fetchWithFallback is mostly for GETs, but we can do direct Supabase calls for mutations
    // and fallback to success response if not configured.
    const data = await fetchWithFallback(
      async () => {
        const { data: newCategory, error } = await supabase
          .from('categories')
          .insert([body])
          .select()
          .single()
        if (error) throw error
        return newCategory
      },
      { ...body, id: `mock-${Date.now()}` },
      'Create Category'
    )
    return NextResponse.json({ success: true, data, message: 'Category created successfully' })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}
