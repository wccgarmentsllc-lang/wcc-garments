import { getSupabaseServerClient, proxyImageUrl, isSupabaseConfigured } from '@/lib/supabase'
import { MOCK_PRODUCTS } from '@/lib/constants'

export interface DBProduct {
  id: string
  name: string
  slug: string
  division: any
  division_slug: string
  category: any
  categories?: any[]
  short_description: string
  moq: string
  lead_time: string
  images: string[]
  is_new: boolean
  is_offer: boolean
  offer_label: string | null
  featured: boolean
  specifications: Record<string, string>
  suitable_for: string[]
  tags: string[]
  brand_slug?: string | null
  description?: string
  view_count?: number
  enquiry_count?: number
  created_at?: string
  updated_at?: string
}

function normalizeProduct(product: any): DBProduct {
  const images = Array.isArray(product.images) 
    ? product.images.map(proxyImageUrl) 
    : []

  return {
    ...product,
    images,
    description: product.short_description || '',
    division: typeof product.division === 'object' && product.division !== null
      ? product.division
      : { name: product.division, slug: product.division_slug },
    category: typeof product.category === 'object' && product.category !== null
      ? product.category
      : { name: product.category, slug: product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : '' },
    categories: Array.isArray(product.categories)
      ? product.categories.map((c: any) => typeof c === 'object' && c !== null ? c : { name: c, slug: c ? c.toLowerCase().replace(/\s+/g, '-') : '' })
      : (product.category ? [
          typeof product.category === 'object' && product.category !== null
            ? product.category
            : { name: product.category, slug: product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : '' }
        ] : [])
  }
}

export async function getProductBySlug(slug: string): Promise<DBProduct | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (data) {
        return normalizeProduct(data)
      }
    } catch (err) {
      console.error('Failed to get product from Supabase:', err)
    }
  }

  // Fallback to mock products if database is not configured or not found
  const mockProduct = MOCK_PRODUCTS.find((p) => p.slug === slug)
  if (mockProduct) {
    return normalizeProduct(mockProduct)
  }

  return null
}

export async function getRelatedProducts(divisionSlug: string, excludeSlug: string, limit = 4): Promise<DBProduct[]> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('division_slug', divisionSlug)
        .neq('slug', excludeSlug)
        .limit(limit)

      if (data && data.length > 0) {
        return data.map(normalizeProduct)
      }
    } catch (err) {
      console.error('Failed to fetch related products from Supabase:', err)
    }
  }

  // Fallback to mock products
  const mockRelated = MOCK_PRODUCTS.filter((p) => p.division_slug === divisionSlug && p.slug !== excludeSlug)
    .slice(0, limit)
  return mockRelated.map(normalizeProduct)
}
