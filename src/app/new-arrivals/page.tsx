import type { Metadata } from 'next'
import NewArrivalsClient from './NewArrivalsClient'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'New B2B Garment & Textile Arrivals | Wholesale Products UAE — WCC Fashions',
  description:
    'Explore the latest bulk wholesale arrivals from WCC Fashions. Featuring new cotton shirt lines, corporate workwear styles, luxury hotel linens, and wholesale household products direct from our factories.',
  keywords: [
    'new wholesale arrivals UAE',
    'latest garments bulk Dubai',
    'new uniform designs wholesale',
    'latest hotel linen collections Dubai',
    'B2B new products supplier GCC',
  ],
  openGraph: {
    title: 'Latest B2B Wholesale Arrivals | WCC Fashions Dubai',
    description:
      'View newly manufactured stock ready for bulk order and custom branding. Direct factory supply from Dubai.',
    type: 'website',
    url: `${SITE_CONFIG.url}/new-arrivals`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/new-arrivals`,
  },
}

export default function NewArrivalsPage() {
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
        name: 'New Arrivals',
        item: `${SITE_CONFIG.url}/new-arrivals`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <NewArrivalsClient />
    </>
  )
}
