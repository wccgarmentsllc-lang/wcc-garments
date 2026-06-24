import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { getDivisionCategoryHref, resolveDivisionCategorySlug } from '@/lib/category-routing'
import { DIVISIONS, SITE_CONFIG } from '@/lib/constants'

export function generateStaticParams() {
  const params: Array<{ division: string; category: string }> = []

  for (const division of DIVISIONS) {
    for (const category of division.categories as Array<{ slug: string }>) {
      params.push({
        division: division.slug,
        category: category.slug,
      })
    }
  }

  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string; category: string }>
}): Promise<Metadata> {
  const { division: divisionSlug, category } = await params
  const division = DIVISIONS.find((item) => item.slug === divisionSlug)
  const resolvedCategorySlug = resolveDivisionCategorySlug(divisionSlug, category)
  const resolvedCategory = division?.categories.find((item) => item.slug === resolvedCategorySlug)

  if (!division || !resolvedCategory) {
    return {}
  }

  const title = `${resolvedCategory.name} | ${division.name} Products`
  const description = `Browse ${resolvedCategory.name.toLowerCase()} in the ${division.name} division from WCC Garments.`
  const canonicalUrl = `${SITE_CONFIG.url}${getDivisionCategoryHref(division.slug, resolvedCategory.slug)}`

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

export default async function LegacyCategoryRoute({
  params,
}: {
  params: Promise<{ division: string; category: string }>
}) {
  const { division: divisionSlug, category } = await params
  redirect(getDivisionCategoryHref(divisionSlug, category))
}
