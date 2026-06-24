import type { Metadata } from 'next'
import AboutClient from './AboutClient'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'About WCC Fashions | B2B Garment & Textile Manufacturer Dubai UAE',
  description:
    'WCC Fashions (established 2001) is a premier B2B garment and textile manufacturer. Headquarters in Dubai, UAE, with 7 production hubs in India, Bangladesh, and China. Global supply of corporate wear, hotel linen, and retail fashion.',
  keywords: [
    'about WCC Fashions',
    'garment manufacturer Dubai history',
    'textile exporter Dubai',
    'WCC Garments manufacturing facilities',
    'established textile manufacturer UAE',
    'B2B clothing supplier GCC',
  ],
  openGraph: {
    title: 'About WCC Fashions | Leading B2B Textile Manufacturer UAE',
    description:
      'Operating 7 production facilities across 3 countries since 2001. Headquartered in Dubai, UAE. Exporting garments, uniforms, and hospitality linens to 50+ countries.',
    type: 'website',
    url: `${SITE_CONFIG.url}/about`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
}

export default function AboutPage() {
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
        name: 'About Us',
        item: `${SITE_CONFIG.url}/about`,
      },
    ],
  }

  const aboutPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About WCC Fashions LLC',
    description: 'Corporate overview and manufacturing capacity history of WCC Fashions LLC.',
    url: `${SITE_CONFIG.url}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: 'WCC Fashions LLC',
      foundingDate: '2001',
      description: 'Leading B2B textile and garment manufacturer in Dubai, UAE.',
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <AboutClient />
    </>
  )
}
