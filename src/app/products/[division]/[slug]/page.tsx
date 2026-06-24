import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'

import { DivisionCatalogPage } from '@/components/products/DivisionCatalogPage'
import {
  getProductHref,
  resolveDivisionCategorySlug,
} from '@/lib/category-routing'
import { DIVISIONS, MOCK_PRODUCTS, SITE_CONFIG } from '@/lib/constants'
import { getSupabaseServerClient } from '@/lib/supabase'

export function generateStaticParams() {
  const params: Array<{ division: string; slug: string }> = []

  for (const division of DIVISIONS) {
    for (const category of division.categories as Array<{ slug: string }>) {
      params.push({
        division: division.slug,
        slug: category.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string; slug: string }>
}): Promise<Metadata> {
  const { division: divisionSlug, slug } = await params
  const division = DIVISIONS.find((item) => item.slug === divisionSlug)
  const resolvedCategorySlug = resolveDivisionCategorySlug(divisionSlug, slug)
  const resolvedCategory = division?.categories.find((item) => item.slug === resolvedCategorySlug)

  if (!division || !resolvedCategory) {
    return {}
  }

  const title = `${resolvedCategory.name} | ${division.name} Products`
  const description = `Browse ${resolvedCategory.name.toLowerCase()} in the ${division.name} division from WCC Garments.`
  const canonicalUrl = `${SITE_CONFIG.url}/products/${division.slug}/${resolvedCategory.slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function DivisionCategoryOrLegacyProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ division: string; slug: string }>
  searchParams: Promise<{ brand?: string }>
}) {
  const { division: divisionSlug, slug } = await params
  const { brand } = await searchParams
  const division = DIVISIONS.find((item) => item.slug === divisionSlug)

  if (!division) {
    notFound()
  }

  const resolvedCategorySlug = resolveDivisionCategorySlug(divisionSlug, slug)
  const resolvedCategory = division?.categories.find((item) => item.slug === resolvedCategorySlug)

  if (resolvedCategorySlug) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_CONFIG.url}/products` },
        { '@type': 'ListItem', position: 3, name: division?.name || divisionSlug, item: `${SITE_CONFIG.url}/products/${divisionSlug}` },
        { '@type': 'ListItem', position: 4, name: resolvedCategory?.name || resolvedCategorySlug, item: `${SITE_CONFIG.url}/products/${divisionSlug}/${resolvedCategorySlug}` },
      ],
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <DivisionCatalogPage
          divisionSlug={divisionSlug}
          initialCategorySlug={resolvedCategorySlug}
          initialBrandSlug={brand}
        />
      </>
    )
  }

  try {
    const supabase = getSupabaseServerClient()
    const { data: dbProd } = await supabase
      .from('products')
      .select('slug')
      .eq('slug', slug)
      .eq('division_slug', divisionSlug)
      .maybeSingle()

    if (dbProd) {
      redirect(getProductHref(divisionSlug, slug))
    }
  } catch (err) {
    console.error("Error querying product slug from DB:", err)
  }



  notFound()
}
