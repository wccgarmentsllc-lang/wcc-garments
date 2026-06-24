import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'

const MOCK_STATS = {
  stats: {
    products: 0,
    enquiries: 0,
    media: 0,
    contacts: 0
  },
  recentEnquiries: []
}

export async function GET() {
  try {
    const data = await fetchWithFallback(
      async () => {
        const supabase = getSupabaseServerClient()
        
        // Fetch counts from different tables to build real stats
        const { count: enquiriesCount } = await supabase
          .from('enquiries')
          .select('*', { count: 'exact', head: true })

        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          
        const { count: mediaCount } = await supabase
          .from('media')
          .select('*', { count: 'exact', head: true })
          
        const { count: contactsCount } = await supabase
          .from('newsletter_subscribers')
          .select('*', { count: 'exact', head: true })
          
        const { data: recentEnquiries } = await supabase
          .from('enquiries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        return {
          stats: {
            products: productsCount || 0,
            enquiries: enquiriesCount || 0,
            media: mediaCount || 0,
            contacts: contactsCount || 0
          },
          recentEnquiries: recentEnquiries || []
        }
      },
      MOCK_STATS,
      'Fetch Dashboard Stats'
    )
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}
