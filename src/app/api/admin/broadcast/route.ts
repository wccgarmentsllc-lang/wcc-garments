import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'

export async function GET() {
  try {
    const data = await fetchWithFallback(
      async () => {
        const supabase = getSupabaseServerClient()
        const { data, error } = await supabase
          .from('broadcasts')
          .select('*')
          .order('sent_at', { ascending: false })
        
        if (error) throw error
        return data || []
      },
      [],
      'Get Broadcasts'
    )
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({
    success: true,
    message: 'Broadcast sent (mock mode)',
    data: { id: crypto.randomUUID(), recipient_count: 0 },
  })
}
