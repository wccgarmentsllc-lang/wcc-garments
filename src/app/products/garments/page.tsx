import type { Metadata } from 'next'
import { Suspense } from 'react'
import GarmentsHubClient from './GarmentsHubClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Best Garments Wholesale Team & Bulk Manufacturer in Dubai, UAE | WCC Fashions',
    description: 'Looking for the best garments wholesale team in Dubai? WCC Fashions is your premier B2B manufacturer for bulk shirts, polo shirts, formal wear, and custom apparel with export-grade QC.',
    keywords: [
      'best garments wholesale team',
      'best garments wholesale team Dubai',
      'best garments wholesale team UAE',
      'wholesale garments UAE',
      'bulk garment manufacturer Dubai',
      'corporate wear bulk',
      'formal shirts wholesale',
      'polo shirt bulk order UAE'
    ],
    alternates: { canonical: '/products/garments' },
    openGraph: {
      title: 'Best Garments Wholesale Team & Manufacturer | WCC Fashions',
      description: 'Looking for the best garments wholesale team in Dubai? WCC Fashions is your premier B2B manufacturer for bulk shirts, polo shirts, and custom apparel.',
      url: '/products/garments',
      type: 'website',
    },
  }
}

export default function GarmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808] pt-24 flex items-center justify-center"><span className="font-mono text-xs uppercase tracking-widest text-white/30">Loading…</span></div>}>
      <GarmentsHubClient />
    </Suspense>
  )
}
