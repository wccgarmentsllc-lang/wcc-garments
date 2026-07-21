import { NextRequest, NextResponse } from 'next/server'
import { DIVISIONS } from '@/lib/constants'

// ── Types ─────────────────────────────────────────────────────────────────────
export type CategoryStatus = 'active' | 'coming-soon' | 'hidden'

export interface SubCategory {
  id: string
  categoryId: string
  divisionSlug: string
  name: string
  slug: string
  status: CategoryStatus
  displayOrder: number
  image?: string
}

export interface Category {
  id: string
  divisionSlug: string
  name: string
  slug: string
  status: CategoryStatus
  displayOrder: number
  image?: string
  subCategories: SubCategory[]
}

// ── Build flat list from data (single source of truth) ─────────────
function buildCategories(divisionsData: any[]): Category[] {
  const result: Category[] = []

  for (const division of divisionsData) {
    const divCategories = division.categories || division.sub_categories || []
    for (const cat of divCategories) {
      const subs: SubCategory[] = (cat.subCategories || cat.sub_categories || []).map((sub: any) => ({
        id: sub.id,
        categoryId: cat.id,
        divisionSlug: division.slug,
        name: sub.name,
        slug: sub.slug,
        status: sub.status as CategoryStatus,
        displayOrder: sub.displayOrder || sub.display_order,
        image: sub.image,
      }))

      result.push({
        id: cat.id,
        divisionSlug: division.slug,
        name: cat.name,
        slug: cat.slug,
        status: cat.status as CategoryStatus,
        displayOrder: cat.displayOrder || cat.display_order,
        image: cat.image,
        subCategories: subs,
      })
    }
  }

  return result
}

import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'

// ── GET /api/categories ───────────────────────────────────────────────────────
// Query params:
//   ?division=garments         → filter by division slug
//   ?status=active             → filter by status (active | coming-soon | all)
//   ?flat=true                 → return sub-categories as flat list too
//   ?parentId=HH-CAT-01        → return only sub-categories of a specific category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const divisionParam = searchParams.get('division')
    const statusParam   = searchParams.get('status') ?? 'all'
    const parentIdParam = searchParams.get('parentId')
    const flatParam     = searchParams.get('flat') === 'true'
    const divisionsOnly = searchParams.get('divisions') === 'true'

    const divisionsData = await fetchWithFallback(
      async () => {
        const supabase = getSupabaseServerClient()
        const { data: categories, error } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: true })
        if (error) throw error
        return categories || []
      },
      DIVISIONS,
      'Fetch Categories'
    )

    if (divisionsOnly) {
      return NextResponse.json({ success: true, data: divisionsData })
    }

    let categories = buildCategories(divisionsData)

    // Filter by division
    if (divisionParam) {
      categories = categories.filter((c) => c.divisionSlug === divisionParam)
    }

    // Filter by status
    if (statusParam !== 'all') {
      categories = categories.filter((c) => c.status === statusParam)
    }

    // Return sub-categories of a specific parent
    if (parentIdParam) {
      const parent = buildCategories(divisionsData).find((c) => c.id === parentIdParam)
      if (!parent) {
        return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 })
      }
      return NextResponse.json(
        { success: true, data: parent.subCategories, parent: { id: parent.id, name: parent.name, slug: parent.slug } },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      )
    }

    // Flat mode: also return sub-categories as their own items in the list
    if (flatParam) {
      const flat: (Category | SubCategory)[] = []
      for (const cat of categories) {
        flat.push(cat)
        flat.push(...cat.subCategories)
      }
      return NextResponse.json(
        { success: true, data: flat, total: flat.length },
        { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
      )
    }

    return NextResponse.json(
      { success: true, data: categories, total: categories.length },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    )
  } catch (error) {
    console.error('[/api/categories] Error:', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
