import { NextResponse, NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { revalidateAllPublicPages } from '@/lib/revalidate'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const supabase = getSupabaseServerClient()

    // Ensure slug uniqueness across divisions (excluding current product ID)
    if (body.slug) {
      let slug = body.slug
      const { data: existing } = await supabase
        .from('products')
        .select('id, division_slug')
        .eq('slug', slug)
        .neq('id', id)
      
      if (existing && existing.length > 0) {
        // Slug already exists for another product. Try appending division_slug as suffix
        const divSuffix = body.division_slug || body.division?.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        if (divSuffix) {
          slug = `${slug}-${divSuffix}`
        } else {
          slug = `${slug}-1`
        }
        
        // Double check if this new slug is also taken
        const { data: existingDouble } = await supabase
          .from('products')
          .select('id')
          .eq('slug', slug)
          .neq('id', id)
        
        if (existingDouble && existingDouble.length > 0) {
          let counter = 1
          let tempSlug = `${slug}-${counter}`
          while (true) {
            const { data: existingCounter } = await supabase
              .from('products')
              .select('id')
              .eq('slug', tempSlug)
              .neq('id', id)
            if (!existingCounter || existingCounter.length === 0) {
              slug = tempSlug
              break
            }
            counter++
            tempSlug = `${slug}-${counter}`
          }
        }
      }
      body.slug = slug
    }

    const { data, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error

    // Flush Vercel edge cache for all public pages immediately
    revalidateAllPublicPages()

    return NextResponse.json({ success: true, message: 'Product updated', data })
  } catch (error: any) {
    console.error('Admin Update Product error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const supabase = getSupabaseServerClient()
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error

    // Flush Vercel edge cache for all public pages immediately
    revalidateAllPublicPages()

    return NextResponse.json({ success: true, message: 'Product deleted' })
  } catch (error: any) {
    console.error('Admin Delete Product error:', error)
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 })
  }
}
