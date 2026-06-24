import { NextResponse, NextRequest } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = getSupabaseServerClient()

    const data = await fetchWithFallback(
      async () => {
        const { data: updatedCategory, error } = await supabase
          .from('categories')
          .update(body)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return updatedCategory
      },
      { ...body, id },
      'Update Category'
    )
    return NextResponse.json({ success: true, data, message: 'Category updated successfully' })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 })
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
          .from('categories')
          .delete()
          .eq('id', id)
        if (error) throw error
        return true
      },
      true,
      'Delete Category'
    )
    return NextResponse.json({ success: true, message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 })
  }
}
