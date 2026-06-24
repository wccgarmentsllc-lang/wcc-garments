import type { Metadata } from 'next'
import { Suspense } from 'react'
import AllProductsClient from './AllProductsClient'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Garment Products | Complete Catalog — WCC Fashions',
    description: 'Browse the complete WCC Fashions garment catalog. All categories — formal shirts, blazers, jeans, polo shirts, trousers & jackets — displayed in one unified B2B wholesale view.',
    keywords: ['all garments catalog', 'wholesale garments UAE', 'complete garment collection', 'B2B garments Dubai', 'bulk garment catalog'],
    alternates: { canonical: '/products/garments/all' },
    openGraph: {
      title: 'WCC Fashions — Complete Garments Catalog',
      description: 'Browse every garment product across all categories and brands in one unified view.',
      url: '/products/garments/all',
      type: 'website',
    },
  }
}

export default function AllGarmentProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808] pt-24 flex items-center justify-center"><span className="font-mono text-xs uppercase tracking-widest text-white/30">Loading…</span></div>}>
      <AllProductsClient />
    </Suspense>
  )
}
