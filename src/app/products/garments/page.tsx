import type { Metadata } from 'next'
import { Suspense } from 'react'
import GarmentsHubClient from './GarmentsHubClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Wholesale Garments Manufacturer UAE | Bulk Shirts, Polos & Formal Wear — WCC Fashions',
    description: 'B2B wholesale garment manufacturer in Dubai, UAE. Premium cotton shirts, polo shirts, formal wear & blazers. Export-grade QC. MOQ from 50 units. Get a bulk quote today.',
    keywords: ['wholesale garments UAE', 'bulk garment manufacturer Dubai', 'corporate wear bulk', 'formal shirts wholesale', 'polo shirt bulk order UAE'],
    alternates: { canonical: '/products/garments' },
    openGraph: {
      title: 'WCC Fashions — Premium Garments Division',
      description: 'B2B wholesale garment manufacturer in Dubai. Premium cotton shirts, polo shirts, formal wear & blazers.',
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
