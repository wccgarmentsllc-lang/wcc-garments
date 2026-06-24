import { MetadataRoute } from 'next'
import { DIVISIONS, MOCK_PRODUCTS } from '@/lib/constants'
import { getSupabaseServerClient } from '@/lib/supabase'

const BASE_URL = 'https://wccfashions.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const routes: MetadataRoute.Sitemap = [
    // ── Core pages ──────────────────────────────────────────────────────────
    { url: BASE_URL,                         lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/products`,           lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/about`,              lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/contact`,            lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/new-arrivals`,       lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    // Garments hub has its own slug
    { url: `${BASE_URL}/products/garments`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
  ]

  // ── Division + Category + Sub-category pages ─────────────────────────────
  for (const division of DIVISIONS) {
    // Division page
    routes.push({
      url: `${BASE_URL}/products/${division.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: division.status === 'flagship' ? 0.9 : 0.8,
    })

    for (const category of division.categories) {
      if (category.status !== 'active') continue

      // Category page
      routes.push({
        url: `${BASE_URL}/products/${division.slug}/${category.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })

      // Sub-category pages (if any)
      const subs = (category as { subCategories?: Array<{ slug: string; status: string }> }).subCategories ?? []
      for (const sub of subs) {
        if (sub.status !== 'active') continue
        routes.push({
          url: `${BASE_URL}/products/${division.slug}/${category.slug}/${sub.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }
  }

  // ── Products ─────────────────────────────────────────────────────────────
  try {
    const supabase = getSupabaseServerClient()
    const { data: products } = await supabase
      .from('products')
      .select('slug, division_slug, updated_at')

    if (products && products.length > 0) {
      products.forEach((p) => {
        routes.push({
          url: `${BASE_URL}/products/${p.division_slug}/details/${p.slug}`,
          lastModified: p.updated_at ? new Date(p.updated_at) : now,
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      })
    } else {
      // Fallback to MOCK_PRODUCTS
      MOCK_PRODUCTS.forEach((p) => {
        routes.push({
          url: `${BASE_URL}/products/${p.division_slug}/details/${p.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      })
    }
  } catch (err) {
    console.error('Error generating product sitemap paths, falling back to MOCK_PRODUCTS:', err)
    MOCK_PRODUCTS.forEach((p) => {
      routes.push({
        url: `${BASE_URL}/products/${p.division_slug}/details/${p.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    })
  }

  return routes
}
