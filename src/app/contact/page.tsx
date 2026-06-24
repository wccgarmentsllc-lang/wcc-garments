import type { Metadata } from 'next'
import { Suspense } from 'react'
import ContactClient from './ContactClient'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Request a Bulk Quote | B2B Garment & Textile Supplier UAE — WCC Fashions',
  description:
    'Contact WCC Fashions Dubai sales office to request custom manufacturing quotations. Bulk B2B orders for garments, uniforms, hospitality linen, fragrance, and home furnishings. Quick responses within 24 hours.',
  keywords: [
    'contact WCC Fashions',
    'request bulk clothing quote Dubai',
    'B2B uniform supplier contact',
    'wholesale textile manufacturer contact UAE',
    'hotel linen supplier Dubai email',
    'WCC Garments phone number',
  ],
  openGraph: {
    title: 'B2B Enquiry & Quotation Request | WCC Fashions Dubai',
    description:
      'Direct channel to our Dubai sales office. Inquire about MOQ, production schedules, custom branding, and shipping logistics.',
    type: 'website',
    url: `${SITE_CONFIG.url}/contact`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/contact`,
  },
}

function ContactLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg)] pt-24">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gold/20 border-t-gold"></div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-gold animate-pulse">
          Loading Contact Console...
        </p>
      </div>
    </div>
  )
}

export default function ContactPage() {
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
        name: 'Contact Us',
        item: `${SITE_CONFIG.url}/contact`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Suspense fallback={<ContactLoading />}>
        <ContactClient />
      </Suspense>
    </>
  )
}
