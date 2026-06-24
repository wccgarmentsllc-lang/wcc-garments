import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase'
import { DIVISIONS, MOCK_BRANDS, MOCK_PRODUCTS, MOCK_IMAGES } from '@/lib/constants'
import {
  DEFAULT_BULK_OFFER,
  DEFAULT_HERO,
  DEFAULT_WHO_WE_ARE,
  DEFAULT_GARMENTS,
  DEFAULT_HOUSEHOLDS,
  DEFAULT_HOSPITALITY,
  DEFAULT_EXPANSION,
  DEFAULT_DUBAI_PIPELINE,
  DEFAULT_NEWSLETTER,
  DEFAULT_ABOUT
} from '@/app/admin/sections/defaults'
import { contentStore } from '@/lib/content-store'

export async function GET() {
  try {
    const supabase = getSupabaseServerClient()
    const results: any = {}

    // 1. Seed Categories (Divisions)
    results.categories = []
    for (const div of DIVISIONS) {
      const payload = {
        name: div.name,
        slug: div.slug,
        icon: div.icon,
        status: div.status,
        description: div.description,
        meta_title: div.metaTitle,
        meta_description: div.metaDescription,
        keywords: div.keywords,
        hero_heading: div.heroHeading,
        hero_subtitle: div.heroSubtitle,
        stat1_label: div.stat1Label,
        stat1_value: div.stat1Value,
        stat2_label: div.stat2Label,
        stat2_value: div.stat2Value,
        stat3_label: div.stat3Label,
        stat3_value: div.stat3Value,
        sub_categories: div.categories.map(c => ({
          ...c,
          subCategories: undefined,
          sub_categories: c.subCategories || []
        }))
      }
      const { data: existing } = await supabase.from('categories').select('id').eq('slug', div.slug).single()
      if (existing) {
        await supabase.from('categories').update(payload).eq('slug', div.slug)
        results.categories.push({ slug: div.slug, action: 'updated' })
      } else {
        await supabase.from('categories').insert([payload])
        results.categories.push({ slug: div.slug, action: 'inserted' })
      }
    }

    // 2. Seed Brands
    results.brands = []
    for (const brand of MOCK_BRANDS) {
      const { id, ...brandPayload } = brand // Exclude hardcoded ID if we want to rely on serial, or use slug
      const { data: existing } = await supabase.from('brands').select('id').eq('slug', brand.slug).single()
      if (existing) {
        await supabase.from('brands').update(brandPayload).eq('slug', brand.slug)
        results.brands.push({ slug: brand.slug, action: 'updated' })
      } else {
        await supabase.from('brands').insert([{ ...brandPayload, id }]) // Keep ID if needed
        results.brands.push({ slug: brand.slug, action: 'inserted' })
      }
    }

    // 3. Seed Products
    results.products = []
    for (const product of MOCK_PRODUCTS) {
      const { id, ...productPayload } = product
      const { data: existing } = await supabase.from('products').select('id').eq('slug', product.slug).single()
      if (existing) {
        await supabase.from('products').update(productPayload).eq('slug', product.slug)
        results.products.push({ slug: product.slug, action: 'updated' })
      } else {
        await supabase.from('products').insert([{ ...productPayload, id }])
        results.products.push({ slug: product.slug, action: 'inserted' })
      }
    }

    // 4. Seed Website Content
    results.website_content = []
    const sections = [
      { id: 'site_config', content: contentStore.getSiteConfig() },
      { id: 'bulk-offer', content: DEFAULT_BULK_OFFER },
      { id: 'hero', content: DEFAULT_HERO },
      { id: 'who-we-are', content: DEFAULT_WHO_WE_ARE },
      { id: 'garments-showcase', content: DEFAULT_GARMENTS },
      { id: 'households-showcase-v2', content: DEFAULT_HOUSEHOLDS },
      { id: 'hospitality-showcase-v2', content: DEFAULT_HOSPITALITY },
      { id: 'strategic-expansion', content: DEFAULT_EXPANSION },
      { id: 'dubai-pipeline', content: DEFAULT_DUBAI_PIPELINE },
      { id: 'newsletter', content: DEFAULT_NEWSLETTER },
      { id: 'about-page', content: DEFAULT_ABOUT }
    ]

    for (const sec of sections) {
      await supabase.from('website_content').upsert(
        { key: sec.id, content: sec.content },
        { onConflict: 'key' }
      )
      results.website_content.push({ section_id: sec.id, action: 'upserted' })
    }

    // 5. Seed Media
    results.media = []
    for (const [key, url] of Object.entries(MOCK_IMAGES)) {
      const typeMap: Record<string, string> = { hero: 'banner', factory: 'banner', team: 'banner' }
      const type = typeMap[key] || 'new_arrival'
      const payload = {
        title: `Mock Asset: ${key}`,
        type,
        url: url,
        dimensions: 'Auto',
        size: 'Auto'
      }
      
      const { data: existing } = await supabase.from('media').select('id').eq('url', url).single()
      if (!existing) {
        await supabase.from('media').insert([payload])
        results.media.push({ key, action: 'inserted' })
      } else {
        results.media.push({ key, action: 'skipped' })
      }
    }

    return NextResponse.json({ success: true, results, message: 'Successfully seeded categories, brands, products, website content, and media.' })
  } catch (error: any) {
    console.error('Error seeding data:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
