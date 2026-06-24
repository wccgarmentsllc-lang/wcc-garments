import { NextRequest, NextResponse } from 'next/server'

const MOCK_MEDIA = [
  { id: '1', type: 'new_arrival', title: 'Premium Cotton Collection 2026', description: 'Latest collection of premium cotton garments', image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85', video_url: null, thumbnail_url: null, product_id: null, division_id: '1', tags: ['new', 'cotton'], pinned: true, active: true, view_count: 120, created_at: new Date().toISOString() },
  { id: '2', type: 'new_arrival', title: 'Hospitality Linen Range', description: 'New hotel-grade linen collection', image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85', video_url: null, thumbnail_url: null, product_id: null, division_id: '3', tags: ['hospitality', 'linen'], pinned: false, active: true, view_count: 89, created_at: new Date().toISOString() },
  { id: '3', type: 'offer', title: 'Bulk Workwear Special', description: 'Special pricing on bulk workwear orders', image_url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=85', video_url: null, thumbnail_url: null, product_id: null, division_id: '2', tags: ['offer', 'workwear'], pinned: true, active: true, view_count: 201, created_at: new Date().toISOString() },
  { id: '4', type: 'offer', title: 'Fragrance Clearance', description: 'End of season fragrance clearance', image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=85', video_url: null, thumbnail_url: null, product_id: null, division_id: '5', tags: ['offer', 'fragrance'], pinned: false, active: true, view_count: 156, created_at: new Date().toISOString() },
  { id: '5', type: 'new_arrival', title: 'Executive Polo Range', description: 'Premium polo shirts for corporate clients', image_url: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=85', video_url: null, thumbnail_url: null, product_id: null, division_id: '1', tags: ['new', 'polo'], pinned: false, active: true, view_count: 67, created_at: new Date().toISOString() },
  { id: '6', type: 'new_arrival', title: 'Bath Towel Premium Set', description: 'Ultra-soft cotton towels now available', image_url: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=85', video_url: null, thumbnail_url: null, product_id: null, division_id: '4', tags: ['new', 'towel'], pinned: false, active: true, view_count: 94, created_at: new Date().toISOString() },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '20')

    let data = [...MOCK_MEDIA]

    if (type) {
      data = data.filter((m) => m.type === type)
    }

    data = data.slice(0, limit)

    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } }
    )
  } catch (error) {
    console.error('Media error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
