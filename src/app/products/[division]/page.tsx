import type { Metadata } from 'next'

import { DivisionCatalogPage } from '@/components/products/DivisionCatalogPage'
import { DIVISIONS, SITE_CONFIG } from '@/lib/constants'

export function generateStaticParams() {
  return DIVISIONS.map((division) => ({ division: division.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string }>
}): Promise<Metadata> {
  const { division: divisionSlug } = await params
  const division = DIVISIONS.find((item) => item.slug === divisionSlug)

  if (!division) return {}

  return {
    title: division.metaTitle,
    description: division.metaDescription,
    keywords: division.keywords,
    openGraph: {
      title: division.metaTitle,
      description: division.metaDescription,
      type: 'website',
      url: `${SITE_CONFIG.url}/products/${division.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: division.metaTitle,
      description: division.metaDescription,
    },
    alternates: {
      canonical: `${SITE_CONFIG.url}/products/${division.slug}`,
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function DivisionCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ division: string }>
  searchParams: Promise<{ category?: string; brand?: string }>
}) {
  const { division: divisionSlug } = await params
  const { category, brand } = await searchParams
  const division = DIVISIONS.find((item) => item.slug === divisionSlug)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_CONFIG.url}/products` },
      { '@type': 'ListItem', position: 3, name: division?.name || divisionSlug, item: `${SITE_CONFIG.url}/products/${divisionSlug}` },
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
        initialCategorySlug={category}
        initialBrandSlug={brand}
      />
    </>
  )
}
