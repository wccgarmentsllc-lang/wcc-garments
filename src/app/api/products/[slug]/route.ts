import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient, proxyImageUrl } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    let product: any = null

    try {
      const supabase = getSupabaseServerClient()
      const dbResponse = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
      
      if (dbResponse.error) throw dbResponse.error
      product = dbResponse.data && dbResponse.data.length > 0 ? dbResponse.data[0] : null;
      
      // Asynchronously trigger view count increment
      (async () => {
        try {
          await supabase.rpc('increment_product_views', { product_slug: slug })
        } catch (err) {
          console.error('Failed to increment views via RPC:', err)
        }
      })()
    } catch (dbError: any) {
      console.warn(`Product slug ${slug} not found or DB error:`, dbError)
      try {
        const fs = require('fs')
        const path = require('path')
        const logMsg = `[${new Date().toISOString()}] Slug: ${slug}, Error: ${dbError?.message || dbError}\nStack: ${dbError?.stack || ''}\n`
        fs.appendFileSync('D:\\WORKS\\wcc-garments-platform\\scripts\\api-error.log', logMsg)
      } catch (err) {
        console.error('Failed to write log file:', err)
      }
      product = null
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    const formattedData = {
      ...product,
      images: Array.isArray(product.images) ? product.images.map(proxyImageUrl) : [],
      division_id: product.id,
      category_id: null,
      description: product.short_description,
      video_url: null,
      published: true,
      view_count: product.view_count || 0,
      enquiry_count: product.enquiry_count || 0,
      division: {
        id: product.id,
        name: product.division,
        slug: product.division_slug,
        accent_color: '#3B82F6',
        tagline: null,
        description: null,
        short_description: null,
        hero_image: null,
        hero_video: null,
        thumbnail: null,
        display_order: 0,
        active: true,
        meta_title: null,
        meta_description: null,
        created_at: product.created_at,
        updated_at: product.updated_at,
      },
      category: {
        id: product.id,
        name: product.category,
        slug: product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : '',
        division_id: product.id,
        description: null,
        image: null,
        display_order: 0,
        active: true,
      },
      categories: Array.isArray(product.categories) ? product.categories.map((c: any) => ({
        id: product.id,
        name: typeof c === 'string' ? c : c.name,
        slug: (typeof c === 'string' ? c : c.name || '').toLowerCase().replace(/\s+/g, '-')
      })) : (product.category ? [{
        id: product.id,
        name: product.category,
        slug: product.category.toLowerCase().replace(/\s+/g, '-')
      }] : []),
    }

    return NextResponse.json(
      { success: true, data: formattedData },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
        },
      }
    )
  } catch (error: any) {
    console.error('Product detail error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    )
  }
}
