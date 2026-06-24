import { NextResponse } from 'next/server'
import { getSupabaseServerClient, proxyImageUrl } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await fetchWithFallback(
      async () => {
        const supabase = getSupabaseServerClient()
        const { data, error } = await supabase
          .from('media')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        return (data || []).map((m: any) => ({
          ...m,
          url: proxyImageUrl(m.url),
        }))
      },
      [],
      'Get Media'
    )
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase.from('media').insert([body]).select().single()
    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
