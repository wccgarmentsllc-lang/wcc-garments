'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, ArrowRight, Search, X, Layers, SlidersHorizontal } from 'lucide-react'
import { DIVISIONS } from '@/lib/constants'
import { brandStore } from '@/lib/brand-store'
import { ProductCard } from '@/components/products/ProductCard'
import { Product } from '@/types'

// ─── Explicit local types ─────────────────────────────────────────────────────
interface GarmentCategory {
  id: string
  name: string
  slug: string
  status: string
  displayOrder: number
  image?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────
const division = DIVISIONS.find((d) => d.slug === 'garments')!
const CATEGORIES = (division.categories ?? []) as GarmentCategory[]

const SLUG_TO_CATEGORY: Record<string, string[]> = {
  'formal-shirts': ['Formal Shirts', 'Casual Shirts'],
  'blazers-suits': ['Blazers & Suits', 'Formal Outerwear'],
  'jeans-denims':  ['Jeans & Denims', 'Cargo Pants'],
  'polo-tshirts':  ['Polo Shirts', 'T-Shirts', 'Polo & T-Shirts'],
  'trousers':      ['Trousers & Chinos', 'Trousers', 'Chinos'],
  'jackets':       ['Outerwear & Jackets', 'Outerwear', 'Jackets'],
}

const BRANDS_CONFIG = [
  { slug: 'treasure', name: 'Treasure' },
  { slug: 'vandegraff', name: 'Vandegraff' },
  { slug: 'tom-jack', name: 'Tom & Jack' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function AllProductsClient() {
  const [categories, setCategories] = useState<GarmentCategory[]>(CATEGORIES)
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeBrand, setActiveBrand] = useState<string>('all')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  useEffect(() => {
    const all = brandStore.getProducts()
    const garments = all.filter(
      (p) => p.division_id === 'Garments' || p.division?.slug === 'garments' || p.division?.name === 'Garments'
    )
    setProducts(garments)

    fetch('/api/categories?division=garments', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data)
        }
      })
      .catch((err) => console.error('Failed to sync live garments categories for all list:', err))
  }, [])

  // Flat filtered list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Brand filter
      if (activeBrand !== 'all' && p.brand_slug !== activeBrand) return false

      const categories = p.categories && p.categories.length > 0 
        ? p.categories.map((c: any) => typeof c === 'string' ? c : c.name)
        : [p.category?.name ?? (p as unknown as Record<string, string>)['category'] ?? ''];

      // Category filter
      if (activeCategory !== 'all') {
        const matches = SLUG_TO_CATEGORY[activeCategory] ?? []
        const hasMatch = categories.some((catName) => matches.some((m) => catName.toLowerCase().includes(m.toLowerCase())))
        if (!hasMatch) return false
      }

      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matches =
          p.name.toLowerCase().includes(q) ||
          categories.some((catName) => catName.toLowerCase().includes(q)) ||
          (p.short_description ?? '').toLowerCase().includes(q) ||
          (p.brand_slug ?? '').toLowerCase().includes(q)
        if (!matches) return false
      }

      return true
    })
  }, [products, activeBrand, activeCategory, searchQuery])

  return (
    <div className="min-h-screen bg-[#080808] text-white pt-24">

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden border-b border-white/10 pt-12 pb-16 md:pt-20 md:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(218,165,32,0.07),transparent_60%)]" />

        <div className="relative mx-auto max-w-[1560px] px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-white/30">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-gold transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products/garments" className="hover:text-gold transition-colors">Garments</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gold">All Products</span>
          </nav>

          <div className="mt-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              DIV-01 · Complete Garments Catalog
            </span>
            <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight text-white">
              All Garment <span className="text-gold">Products</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/50 md:text-base font-light">
              Browse our complete garment catalog — every category, every brand, every style displayed in one unified view. 
              Perfect for wholesale buyers exploring our full B2B range.
            </p>
          </div>

          {/* Stats strip */}
          <div className="mt-10 flex flex-wrap gap-0 divide-x divide-white/10 border border-white/10 w-fit">
            {[
              { label: 'Total Products', value: `${filteredProducts.length}` },
              { label: 'Active Brands', value: '3' },
              { label: division.stat1Label, value: division.stat1Value },
              { label: 'Lead Time', value: division.stat2Value },
            ].map((s) => (
              <div key={s.label} className="px-5 py-3 bg-white/[0.02]">
                <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">{s.label}</p>
                <p className="mt-0.5 text-base font-bold text-white">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── STICKY FILTER BAR ──────────────────────────────────────── */}
      <div className="sticky top-[72px] z-40 border-b border-white/10 bg-[#080808]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="mx-auto max-w-[1560px] px-4 lg:px-12">
          <div className="flex items-center gap-4 py-3">

            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 pl-9 pr-8 py-2.5 text-[11px] font-mono text-white placeholder:text-white/25 focus:outline-none focus:border-gold/50 transition-colors"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-white/10 hidden sm:block" />

            {/* Brand filter */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide hidden sm:flex">
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/30 shrink-0 flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3" />
                Brand:
              </span>
              <button
                onClick={() => setActiveBrand('all')}
                className={`shrink-0 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider border transition-colors ${
                  activeBrand === 'all'
                    ? 'border-gold bg-gold/15 text-gold'
                    : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white'
                }`}
              >
                All Brands
              </button>
              {BRANDS_CONFIG.map((b) => (
                <button
                  key={b.slug}
                  onClick={() => setActiveBrand(b.slug)}
                  className={`shrink-0 px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider border transition-colors ${
                    activeBrand === b.slug
                      ? 'border-gold bg-gold/15 text-gold'
                      : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-white/10 hidden lg:block" />

            {/* Category filter links */}
            <div className="items-center gap-2 overflow-x-auto scrollbar-hide hidden lg:flex">
              <span className="text-[9px] font-mono uppercase tracking-wider text-white/30 shrink-0 flex items-center gap-1">
                <Layers className="h-3 w-3" />
                Category:
              </span>
              <button
                onClick={() => setActiveCategory('all')}
                className={`shrink-0 px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${activeCategory === 'all' ? 'text-gold font-bold' : 'text-white/40 hover:text-gold'}`}
              >
                All
              </button>
              {categories
                .filter((c) => c.status === 'active')
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setActiveCategory(cat.slug)}
                    className={`shrink-0 px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${activeCategory === cat.slug ? 'text-gold font-bold' : 'text-white/40 hover:text-gold'}`}
                  >
                    {cat.name}
                  </button>
                ))}
            </div>

            {/* Product count */}
            <div className="hidden md:block ml-auto">
              <span className="font-mono text-[10px] text-white/25 uppercase tracking-wider">
                {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── ALL PRODUCTS FLAT GRID ──────────────────────────────────── */}
      <main className="mx-auto max-w-[1560px] px-6 lg:px-12 py-12">
        {filteredProducts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((p, i) => (
              <ProductCard
                key={p.id}
                product={{
                  ...p,
                  division: { name: p.division?.name ?? 'Garments', slug: p.division?.slug ?? 'garments' },
                  category: p.category ?? { name: (p as unknown as Record<string, string>)['category_id'] ?? 'Garments' },
                }}
                index={i}
                divisionSlug="garments"
              />
            ))}
          </div>
        ) : (
          <div className="border border-white/[0.07] bg-white/[0.02] px-6 py-24 text-center">
            <Layers className="h-10 w-10 text-white/15 mx-auto mb-4" />
            <p className="font-display text-xl text-white/40">No products found</p>
            <p className="mt-2 text-sm text-white/25">Try adjusting your search or brand filter.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveBrand('all') }}
              className="mt-6 inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-6 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-black transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* ── ENQUIRY CTA ─────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0A0A0A]">
        <div className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">BULK ENQUIRY</span>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-white">
              Ready to order? <span className="text-gold">Request a quotation</span> instantly.
            </h3>
          </div>
          <Link
            href="/contact"
            className="btn-gold text-[10px] shrink-0"
          >
            Request a Quotation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── BACK NAVIGATION ─────────────────────────────────────────── */}
      <div className="border-t border-white/[0.07] bg-[#080808]">
        <div className="mx-auto max-w-[1560px] px-6 lg:px-12 py-8 flex items-center justify-between gap-4">
          <Link
            href="/products/garments"
            className="flex items-center gap-2 border border-white/10 bg-white/5 px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-white/50 hover:border-gold hover:text-gold transition-all duration-300"
          >
            ← Back to Garments Hub
          </Link>
          <Link
            href="/contact?division=garments&source=all_products_empty_grid&intent=bulk_quotation"
            className="flex items-center gap-2 bg-gold px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-white hover:bg-gold/90 transition-all duration-300"
          >
            Contact for Enquiry <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
