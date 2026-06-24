'use client'

import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: Array<{
    id: string
    name: string
    slug: string
    images: string[]
    division?: { name: string; slug: string } | null
    category?: { name: string } | null
    moq: string | null
    is_new: boolean
    is_offer: boolean
    offer_label: string | null
    short_description?: string | null
  }>
  /** Division slug forwarded from the category page for correct link generation */
  divisionSlug?: string
}

export function ProductGrid({ products, divisionSlug }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="border border-[var(--border)] bg-[var(--bg-surface)] px-6 py-20 text-center">
        <p className="font-display text-2xl text-[var(--text)]">No products found</p>
        <p className="mt-3 text-sm text-[var(--text-muted)]">Try a different division or clear filters.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 2xl:gap-8">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          divisionSlug={divisionSlug || product.division?.slug}
        />
      ))}
    </div>
  )
}
