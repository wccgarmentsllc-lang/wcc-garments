import { NextResponse } from 'next/server'

const MOCK_DIVISIONS = [
  { id: '1', name: 'Garments', slug: 'garments', tagline: 'Precision in Every Stitch', short_description: 'Premium garment manufacturing for global export', hero_image: null, hero_video: null, thumbnail: null, accent_color: '#3B82F6', display_order: 1, active: true, description: null, meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: 'Households', slug: 'households', tagline: 'Everyday Quality at Scale', short_description: 'Essential household products for bulk supply', hero_image: null, hero_video: null, thumbnail: null, accent_color: '#2563EB', display_order: 2, active: true, description: null, meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: 'Hospitality', slug: 'hospitality', tagline: 'Where Service Meets Luxury Attire', short_description: 'Premium hospitality textiles and uniforms', hero_image: null, hero_video: null, thumbnail: null, accent_color: '#1D4ED8', display_order: 3, active: true, description: null, meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', name: 'Uniforms & Workwear', slug: 'uniforms', tagline: 'Outfitting Industries Worldwide', short_description: 'Professional uniform solutions for all sectors', hero_image: null, hero_video: null, thumbnail: null, accent_color: '#2563EB', display_order: 4, active: true, description: null, meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', name: 'Home Furnishings', slug: 'home', tagline: 'Textile Excellence for Living Spaces', short_description: 'Luxury home linen and furnishing textiles', hero_image: null, hero_video: null, thumbnail: null, accent_color: '#60A5FA', display_order: 5, active: true, description: null, meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', name: 'Fragrance', slug: 'fragrance', tagline: 'The Art of Scent Distilled to Perfection', short_description: 'Perfumes, raw materials and private label', hero_image: null, hero_video: null, thumbnail: null, accent_color: '#93C5FD', display_order: 6, active: true, description: null, meta_title: null, meta_description: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

export async function GET() {
  try {
    return NextResponse.json(
      { success: true, data: MOCK_DIVISIONS },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        },
      }
    )
  } catch (error) {
    console.error('Divisions error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}
