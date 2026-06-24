import { NextResponse, NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'

const MOCK_SUBSCRIBERS = [
  { id: '1', email: 'procurement@gulftextiles.com', status: 'active', subscribedAt: new Date().toISOString() },
  { id: '2', email: 'director@lagosfashion.ng', status: 'active', subscribedAt: new Date().toISOString() }
]

export async function GET() {
  try {
    const data = await fetchWithFallback(
      async () => {
        const supabase = getSupabaseServerClient()
        const { data: subscribers, error } = await supabase
          .from('newsletter_subscribers')
          .select('*')
          .order('subscribed_at', { ascending: false })
        if (error) throw error
        return subscribers || []
      },
      [],
      'Fetch Subscribers'
    )
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching subscribers:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) throw new Error('ID is required')
    
    const supabase = getSupabaseServerClient()

    await fetchWithFallback(
      async () => {
        const { error } = await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('id', id)
        if (error) throw error
        return true
      },
      true,
      'Delete Subscriber'
    )
    return NextResponse.json({ success: true, message: 'Subscriber deleted successfully' })
  } catch (error) {
    console.error('Error deleting subscriber:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete subscriber' }, { status: 500 })
  }
}
