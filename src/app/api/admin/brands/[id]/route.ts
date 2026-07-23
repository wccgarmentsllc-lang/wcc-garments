import { NextResponse, NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'
import { revalidateAllPublicPages } from '@/lib/revalidate'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rawBody = await request.json()
    // Strip primary key and auto-managed fields — Supabase rejects attempts to update them
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, created_at: _ca, ...body } = rawBody
    const supabase = getSupabaseServerClient()

    const data = await fetchWithFallback(
      async () => {
        const { data: updatedBrand, error } = await supabase
          .from('brands')
          .update(body)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return updatedBrand
      },
      { ...body, id },
      'Update Brand'
    )

    // Flush Vercel edge cache for all public pages immediately
    revalidateAllPublicPages()

    return NextResponse.json({ success: true, data, message: 'Brand updated successfully' })
  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json({ success: false, error: 'Failed to update brand' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseServerClient()

    await fetchWithFallback(
      async () => {
        const { error } = await supabase
          .from('brands')
          .delete()
          .eq('id', id)
        if (error) throw error
        return true
      },
      true,
      'Delete Brand'
    )

    // Flush Vercel edge cache for all public pages immediately
    revalidateAllPublicPages()

    return NextResponse.json({ success: true, message: 'Brand deleted successfully' })
  } catch (error) {
    console.error('Error deleting brand:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete brand' }, { status: 500 })
  }
}
