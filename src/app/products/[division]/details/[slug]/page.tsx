import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ProductDetailClient from './ProductDetailClient'
import { getProductBySlug, getRelatedProducts } from '@/lib/db-products'
import { DIVISIONS, MOCK_PRODUCTS, SITE_CONFIG } from '@/lib/constants'

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({
    division: p.division_slug,
    slug: p.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ division: string; slug: string }>
}): Promise<Metadata> {
  const { division: divisionSlug, slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: 'Product Not Found | WCC Fashions',
      description: 'The requested product could not be found.',
    }
  }

  const divisionName = typeof product.division === 'object' && product.division !== null
    ? product.division.name
    : product.division

  const categoryName = typeof product.category === 'object' && product.category !== null
    ? product.category.name
    : product.category

  // World-class B2B optimized title & description
  const title = `Wholesale ${product.name} | B2B ${categoryName} Supplier UAE — WCC Fashions`
  const description = `${product.short_description || product.description || ''} Export quality, low MOQ, custom private label branding. Manufacturer headquartered in Dubai, UAE.`

  const imageUrl = product.images?.[0] || '/og-image-main.jpg'
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_CONFIG.url}${imageUrl}`
  const canonicalUrl = `${SITE_CONFIG.url}/products/${divisionSlug}/details/${slug}`

  return {
    title,
    description,
    keywords: [
      `wholesale ${product.name.toLowerCase()}`,
      `bulk ${product.name.toLowerCase()}`,
      `B2B ${product.name.toLowerCase()}`,
      `${product.name.toLowerCase()} manufacturer UAE`,
      `${product.name.toLowerCase()} supplier Dubai`,
      ...(product.tags || []),
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: [
        {
          url: absoluteImageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ division: string; slug: string }>
}) {
  const { division: divisionSlug, slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(divisionSlug, slug)

  const divisionName = typeof product.division === 'object' && product.division !== null
    ? product.division.name
    : product.division

  const imageUrl = product.images?.[0] || '/og-image-main.jpg'
  const absoluteImageUrl = imageUrl.startsWith('http') ? imageUrl : `${SITE_CONFIG.url}${imageUrl}`

  // ── JSON-LD Product Schema ──
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${SITE_CONFIG.url}/products/${divisionSlug}/details/${slug}#product`,
    name: product.name,
    image: product.images.map((img) => img.startsWith('http') ? img : `${SITE_CONFIG.url}${img}`),
    description: product.short_description || product.description,
    sku: `${product.brand_slug || 'wcc'}-${product.id}`,
    brand: {
      '@type': 'Brand',
      name: product.brand_slug ? product.brand_slug.toUpperCase() : 'WCC Fashions',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_CONFIG.url}/products/${divisionSlug}/details/${slug}`,
      priceCurrency: 'AED',
      price: '0.00',
      priceSpecification: {
        '@type': 'PriceSpecification',
        price: '0.00',
        priceCurrency: 'AED',
        valueAddedTaxIncluded: 'false',
      },
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'WCC Fashions LLC',
      },
    },
  }

  // ── JSON-LD BreadcrumbList Schema ──
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${SITE_CONFIG.url}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: divisionName,
        item: `${SITE_CONFIG.url}/products/${divisionSlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${SITE_CONFIG.url}/products/${divisionSlug}/details/${slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient
        initialProduct={product}
        initialRelatedProducts={relatedProducts}
        divisionSlug={divisionSlug}
        slug={slug}
      />
    </>
  )
}
