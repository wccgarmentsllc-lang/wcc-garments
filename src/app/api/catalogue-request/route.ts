import { NextRequest, NextResponse } from 'next/server'
import { CatalogueRequestSchema } from '@/lib/validations'
import { ZodError } from 'zod'
import { getSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = CatalogueRequestSchema.parse(body)

    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('catalogue_requests')
      .insert([
        {
          name: validated.name,
          email: validated.email,
          company: validated.company || null,
          brand_slug: validated.brand_slug,
          status: 'pending',
        },
      ])
      .select('id')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Catalogue request submitted successfully.',
      id: data?.id,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Catalogue request submission error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to submit catalogue request' },
      { status: 500 }
    )
  }
}
