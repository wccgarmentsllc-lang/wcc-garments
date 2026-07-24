'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, ArrowUpRight, Tag, Clock, ShieldCheck, Check, Layers, SlidersHorizontal, X } from 'lucide-react'
import { DIVISIONS } from '@/lib/constants'
import { brandStore } from '@/lib/brand-store'
import { ProductCard } from '@/components/products/ProductCard'
import { Product } from '@/types'
import treasurelogo from '../../../../public/images/tresurelogo.png'
import vandegrafflogo from '../../../../public/images/vadegrafflogo.png'
import tomjacklogo from '../../../../public/images/tomjacklogo.png'
import tomjacknewlogo from '../../../../public/images/logo/tomjacknewlogo.png'
import treasurenewlogo from '../../../../public/images/logo/treasurelogo.png'
import vandegraffnewlogo from '../../../../public/images/logo/vandegrafflogo.png'


// ─── Explicit local types to widen the const-inferred DIVISIONS union ─────────
interface SubCat {
  id: string
  name: string
  slug: string
  status: string
  displayOrder: number
}
interface GarmentCategory {
  id: string
  name: string
  slug: string
  status: string
  displayOrder: number
  subCategories: SubCat[]
  image?: string
}

const division = DIVISIONS.find((d) => d.slug === 'garments')!
const CATEGORIES = (division.categories ?? []) as GarmentCategory[]

const CATEGORY_IMAGES: Record<string, string> = {
  'formal-shirts': '/images/formal-shirts.png',
  'blazers-suits': '/images/Blazers and suits.png',
  'jeans-denims': '/images/jeans-denims.png',
  'polo-tshirts': '/images/polo tshirts.png',
  'trousers': '/images/trousers.png',
  'jackets': '/images/jackets.png',
}

const STYLE_COUNT: Record<string, string> = {
  'formal-shirts': '140+ Styles',
  'blazers-suits': '80+ Styles',
  'jeans-denims': '210+ Styles',
  'polo-tshirts': '320+ Styles',
  'trousers': '110+ Styles',
  'jackets': '95+ Styles',
}

const SLUG_TO_CATEGORY: Record<string, string[]> = {
  'formal-shirts': ['Formal Shirts', 'Casual Shirts'],
  'blazers-suits': ['Blazers & Suits', 'Formal Outerwear'],
  'jeans-denims': ['Jeans & Denims', 'Cargo Pants'],
  'polo-tshirts': ['Polo Shirts', 'T-Shirts', 'Polo & T-Shirts'],
  'trousers': ['Trousers & Chinos', 'Trousers', 'Chinos'],
  'jackets': ['Outerwear & Jackets', 'Outerwear', 'Jackets'],
}

type CatStatus = 'active' | 'coming-soon' | 'newly-started'

const STATUS_CONFIG: Record<CatStatus, { badge: string; style: string }> = {
  'active': { badge: 'ACTIVE', style: 'bg-gold text-black' },
  'coming-soon': { badge: 'COMING SOON', style: 'bg-[var(--surface-muted)] text-[var(--text-muted)]' },
  'newly-started': { badge: 'NEWLY STARTED', style: 'bg-amber-500 text-white' },
}

// ─── BRANDS DATA CONFIG ───
const BRANDS_CONFIG = [
  {
    slug: 'treasure',
    name: 'Treasure',
    tagline: 'Sleek Corporate Tailoring & Bespoke Formal Wear',
    desc: 'Egyptian cotton. Italian finishing. Export-grade quality. Crafted for global leaders demanding pristine fits and executive weight profiles.',
    moq: '500 PCS',
    styles: '320+ STYLES',
    segment: 'core',
    badge: 'PREMIUM LINE',
    style: 'border-gold text-gold bg-gold/5',
    perfectFor: ['Banking Sector', 'Luxury Hotels', 'Corporate Uniforms', 'Government'],
    bgImage: '/images/treaureimg.png',
    logo: treasurelogo,
    brandImage: treasurenewlogo,
  },
  {
    slug: 'vandegraff',
    name: 'Vandegraff',
    tagline: 'Heavy-Duty Corporate Attire & Technical Workwear',
    desc: 'Smart Everyday Essentials. Competitive pricing. Volume production. Engineered with high-tensile weave structures to optimize scaled commercial operations.',
    moq: '1,500 PCS',
    styles: '280+ STYLES',
    segment: 'core',
    badge: 'VALUE LINE',
    style: 'border-red-500/30 text-red-400 bg-red-950/10',
    perfectFor: ['Retail Chains', 'Mass Market', 'E-Commerce', 'Budget Retail'],
    bgImage: '/images/vendegraddimg.png',
    logo: vandegrafflogo,
    brandImage: vandegraffnewlogo,
  },
  {
    slug: 'tom-jack',
    name: 'Tom & Jack',
    tagline: 'Contemporary Active Apparel & Refined Team Wear',
    desc: 'Active Premium. Smart-casual for the modern professional. Business-casual meets urban lifestyle. The ultimate hybrid collection combining flex comfort with sleek aesthetics.',
    moq: '250 PCS',
    styles: '410+ STYLES',
    segment: 'incentives',
    badge: 'ACTIVE PREMIUM',
    style: 'border-gold text-gold bg-gold/5',
    perfectFor: ['Tech Startups', 'Creative Agencies', 'Executive Retreats', 'Luxury Golf Clubs'],
    bgImage: '/images/tomkackimg.png',
    logo: tomjacklogo,
    brandImage: tomjacknewlogo,
  }
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function GarmentsHubClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filterBarRef = useRef<HTMLDivElement>(null)

  const urlCategory = searchParams.get('category') ?? 'all'
  const urlBrand = searchParams.get('brand') ?? 'all'

  const [categories, setCategories] = useState<GarmentCategory[]>(CATEGORIES)
  const activeCategory = (categories.find((c) => c.slug === urlCategory) ?? null) as GarmentCategory | null
  const activeBrand = BRANDS_CONFIG.find((b) => b.slug === urlBrand) ?? null

  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    // 1. Initial local load
    const all = brandStore.getProducts()
    const garments = all.filter(
      (p) => p.division_id === 'Garments' || p.division?.slug === 'garments' || p.division?.name === 'Garments'
    )
    setProducts(garments)

    // 2. Fetch live data from database
    fetch('/api/products?division=garments&limit=100', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setProducts(json.data)
        }
      })
      .catch((err) => console.error('Failed to sync live garments products:', err))

    // 3. Fetch live categories from database
    fetch('/api/categories?division=garments', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setCategories(json.data)
        }
      })
      .catch((err) => console.error('Failed to sync live garments categories:', err))
  }, [])

  // Normalize a string for comparison (lowercase, alphanumeric only)
  const normCat = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

  // Filter products by active category AND brand
  const filteredProducts = products.filter((p) => {
    let categoryMatch = true
    if (activeCategory) {
      const categories = p.categories && p.categories.length > 0
        ? p.categories.map((c: any) => typeof c === 'string' ? { name: c, slug: c.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : c)
        : (p.category ? [p.category] : []);

      const activeName = normCat(activeCategory.name)
      const activeSlug = normCat(activeCategory.slug)

      categoryMatch = categories.some((c: any) => {
        const pCatName = (c?.name ?? (c as unknown as Record<string, string>)['category'] ?? '')
        const pCatSlug = (c?.slug ?? '')
        const pNormName = normCat(pCatName)
        const pNormSlug = normCat(pCatSlug)

        return pCatSlug === activeCategory.slug ||
          pCatName.toLowerCase() === activeCategory.name.toLowerCase() ||
          pNormSlug.includes(activeSlug) || activeSlug.includes(pNormSlug) ||
          pNormName.includes(activeName) || activeName.includes(pNormName)
      })
    }
    let brandMatch = true
    if (urlBrand !== 'all') {
      brandMatch = p.brand_slug === urlBrand
    }
    return categoryMatch && brandMatch
  })

  const updateFilters = (catSlug: string | null, brandSlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (catSlug === 'all' || catSlug === null) {
      if (catSlug === 'all') params.delete('category')
    } else {
      params.set('category', catSlug)
    }
    if (brandSlug === 'all' || brandSlug === null) {
      if (brandSlug === 'all') params.delete('brand')
    } else {
      params.set('brand', brandSlug)
    }
    router.replace(`/products/garments${params.toString() ? '?' + params.toString() : ''}`, { scroll: false })
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const clearAllFilters = () => {
    router.replace('/products/garments', { scroll: false })
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const renderAllProductsButton = (className = '') => (
    <Link
      href="/products/garments/all"
      className={`group relative inline-flex items-center gap-2 overflow-hidden bg-[var(--text)] px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--bg)] transition-all hover:bg-gold hover:text-white shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] ${className}`}
    >
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
        <div className="w-8 bg-white/20" />
      </div>
      <Layers className="h-3.5 w-3.5" />
      <span>All Products</span>
    </Link>
  )

  const renderCategoryFilterBar = (className = '') => (
    <div
      ref={filterBarRef}
      className={`sticky top-[72px] z-40 bg-[var(--bg)] backdrop-blur-xl `}
    >
      <div className="mx-auto max-w-[1560px] lg:mx-12 mx-6 bg-[var(--bg)] border border-[var(--border)] px-1">
        <div className="flex items-center justify-between gap-4 py-1 bg-[var(--bg)]">
          <div className="min-w-0 flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex w-max items-center gap-0"> 
              <button
                onClick={() => updateFilters('all', null)}
                className={`relative shrink-0 px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${urlCategory === 'all'
                    ? 'text-gold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
              >
                All Categories
              </button>

              {categories.map((cat) => {
                const isActive = urlCategory === cat.slug
                const isDisabled = cat.status === 'coming-soon'
                return (
                  <button
                    key={cat.slug}
                    onClick={() => !isDisabled && updateFilters(cat.slug, null)}
                    disabled={isDisabled}
                    className={`relative shrink-0 flex items-center gap-2 px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${isActive
                        ? 'text-gold'
                        : isDisabled
                          ? 'text-[var(--text-muted)] opacity-40 cursor-not-allowed'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                      }`}
                  >
                    {cat.name}
                    {isDisabled && (
                      <span className="ml-1 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider bg-[var(--surface)] text-[var(--text-muted)]">
                        SOON
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="hidden shrink-0 sm:flex sm:items-center sm:pl-4 sm:border-l sm:border-[var(--border)]">
            {renderAllProductsButton()}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] py-16 transition-colors duration-300">

      {/* ── HERO ────────────────────────────────────────────────────── */}
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className={`relative overflow-hidden transition-all duration-300 ${(!!activeCategory || !!activeBrand)
          ? 'pt-12 pb-6 md:pt-16 md:pb-8'
          : 'pt-12 pb-16 md:pt-20 md:pb-20'
        }`}>
        {/* Subtle gold radial */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(218,165,32,0.07),transparent_60%)]" />

        <div className="relative mx-auto max-w-[1560px] px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-[var(--text-muted)]">
            <Link href="/" className="hover:text-gold transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products" className="hover:text-gold transition-colors">Products</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/products/garments" className="hover:text-gold transition-colors">Garments</Link>
            {activeCategory && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gold">{activeCategory.name}</span>
              </>
            )}
            {!activeCategory && activeBrand && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-gold">{activeBrand.name}</span>
              </>
            )}
          </nav>

          {!(activeCategory || activeBrand) && (
            <>
              <div className="mt-8">
                <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
                  Garments Division
                </span>
                <h1 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight text-[var(--text)]">
                  {division.heroHeading.split(' ').slice(0, -1).join(' ')} <span className="text-gold">{division.heroHeading.split(' ').slice(-1)[0]}</span>
                </h1>
                <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base font-light">
                  {division.heroSubtitle}
                </p>
              </div>

              {/* Stats strip */}
              <div className="mt-10 flex flex-wrap gap-0 divide-x divide-[var(--border)] border border-[var(--border)] w-fit">
                {[
                  { label: division.stat1Label, value: division.stat1Value },
                  { label: division.stat2Label, value: division.stat2Value },
                  { label: 'Active Lines', value: '3 Brands' },
                  { label: 'Products Matching', value: `${filteredProducts.length}` },
                ].map((s) => (
                  <div key={s.label} className="px-5 flex flex-col items-center py-3 bg-[var(--surface)]">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--text-muted)]">{s.label}</p>
                    <p className="mt-0.5 text-[13px] text-cener text-[var(--text)]">{s.value}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── INTERACTIVE MANUFACTURING HOUSES SHOWCASE (BRAND BROWSE) ── */}
      {urlCategory === 'all' && urlBrand === 'all' && (
        <section className="mx-auto max-w-[1560px] px-6 lg:px-12 py-16 border-b border-[var(--border)]">
          <div className="text-center max-w-3xl mx-auto mb-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              ✦ OUR GARMENT BRANDS
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--text)]">
              Browse by <span className="text-gold">Brand</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--text-muted)] max-w-2xl mx-auto">
              WCC operates specialized garment brands, each with a distinct identity and commercial focus. Click a brand to explore its collection.
            </p>
          </div>

          {/* Brand Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {BRANDS_CONFIG.map((b, index) => (
              <motion.div
                key={b.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="relative"
              >
                <button
                  onClick={() => updateFilters(null, b.slug)}
                  className="group relative flex flex-col overflow-hidden w-full text-left transition-all duration-500"
                >

                  {/* Card content */}
                  <div className="relative z-10 flex flex-col place-items-center p-5 gap-4">
                    <div className="w-full border-2 border-transparent hover:border-[var(--border)] flex items-center justify-center">
                      <Image
                        src={b.brandImage}
                        width={250}
                        height={250}
                        alt={`${b.name} logo`}
                        className="w-full h-auto object-contain max-h-[180px] sm:max-h-[220px]"
                      />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}



      {/* ── STICKY CATEGORY FILTER BAR ─────────────────────────────── */}
      {!activeBrand && urlCategory === 'all' ? null : renderCategoryFilterBar()}

      {/* ── CONTENT AREA ────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {(urlCategory === 'all' || urlBrand !== 'all') ? (
          <motion.div
            key="all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Spotlight Brand Profile */}
            {activeBrand && (
              <section className="mx-auto max-w-[1560px] px-6 lg:px-12">
                <div className="relative border border-gold/30 bg-[var(--surface-card)] overflow-hidden p-2 sm:p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(218,165,32,0.06),transparent_50%)]" />

                  <div className="relative z-10 max-w-3xl space-y-4">
                    <span className="font-mono text-[9px] font-bold tracking-widest text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 uppercase">
                      Active Spotlight · {activeBrand.badge}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[var(--text)]">
                      {activeBrand.name} Profile
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">
                      {activeBrand.desc} Customization services include custom labels, bespoke logo embroidery, custom-dye options, and CIF global transport directly from our Jebel Ali Hub.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      {[
                        { label: 'Minimum Order', value: activeBrand.moq, gold: false },
                        { label: 'Lead Time', value: division.stat2Value, gold: false },
                        { label: 'Perfect For', value: activeBrand.perfectFor.slice(0, 2).join(', '), gold: true },
                      ].map((item) => (
                        <div key={item.label} className="border-l-2 border-gold/50 pl-3">
                          <span className="block text-[8px] font-mono uppercase text-[var(--text-muted)] tracking-wider">{item.label}</span>
                          <span className={`text-xs font-mono font-bold ${item.gold ? 'text-gold' : 'text-[var(--text)]'}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Category Filter Pills within this Brand */}
                    <div className="border-t border-[var(--border)] pt-5 mt-4">
                      <span className="block text-[9px] font-mono uppercase text-[var(--text-muted)] tracking-widest mb-3">
                        Filter Category within {activeBrand.name}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => updateFilters('all', null)}
                          className={`px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider border transition-colors ${urlCategory === 'all'
                            ? 'border-gold bg-gold/15 text-gold'
                            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text)]'
                            }`}
                        >
                          All Collections
                        </button>
                        {categories.map((cat) => {
                          const isActive = urlCategory === cat.slug
                          const isDisabled = cat.status === 'coming-soon'
                          return (
                            <button
                              key={cat.slug}
                              onClick={() => !isDisabled && updateFilters(cat.slug, null)}
                              disabled={isDisabled}
                              className={`px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider border transition-colors ${isActive
                                ? 'border-gold bg-gold/15 text-gold'
                                : isDisabled
                                  ? 'border-[var(--border)] bg-transparent text-[var(--text-muted)] opacity-30 cursor-not-allowed'
                                  : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] hover:border-[var(--text-muted)] hover:text-[var(--text)]'
                                }`}
                            >
                              {cat.name}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 shrink-0 flex flex-col gap-3 w-full md:w-auto">
                    <button
                      onClick={() => updateFilters(null, 'all')}
                      className="bg-gold hover:bg-gold/90 text-white py-3 px-6 font-mono text-[10px] font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-2xl"
                    >
                      <span>Show All Brands</span>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Category Grid */}
            {!activeBrand && (
              <section className="mx-auto max-w-[1560px] px-6 lg:px-12 py-14">
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">GARMENTS CATALOG</span>
                    <div className="mt-4">
                      <h2 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--text)]">
                        Browse by <span className="text-gold">Category</span>
                      </h2>
                    </div>
                  </div>
                  <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    {categories.filter((c) => c.status === 'active').length} active · {categories.filter((c) => c.status === 'coming-soon').length} coming soon
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {categories.sort((a, b) => a.displayOrder - b.displayOrder).map((cat, index) => {
                    const status = cat.status as CatStatus
                    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['active']
                    const image = cat.image || CATEGORY_IMAGES[cat.slug] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'
                    const styleCount = STYLE_COUNT[cat.slug] ?? '80+ Styles'
                    const isDisabled = status === 'coming-soon'

                    return (
                      <motion.div
                        key={cat.slug}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.65, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <button
                          onClick={() => !isDisabled && updateFilters(cat.slug, null)}
                          disabled={isDisabled}
                          className={`group relative block w-full text-left overflow-hidden border transition-all duration-500 ${isDisabled
                            ? 'border-[var(--border)] cursor-not-allowed'
                            : 'border-[var(--border)] hover:border-gold/40 hover:shadow-[0_20px_60px_rgba(218,165,32,0.08)]'
                            }`}
                        >
                          {/* Image */}
                          <div className="relative aspect-[4/3] overflow-hidden">
                            <Image
                              src={image}
                              alt={cat.name}
                              fill
                              className={`object-cover transition-transform duration-700 ease-out ${isDisabled
                                ? 'grayscale opacity-30'
                                : 'group-hover:scale-[1.04]'
                                }`}
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className={`absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${!isDisabled ? 'group-hover:opacity-100' : ''}`} />

                            {status !== 'active' && (
                              <span className={`absolute left-4 top-4 px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest z-10 ${cfg.style}`}>
                                {cfg.badge}
                              </span>
                            )}

                            <span className="absolute right-4 bottom-4 font-mono text-[9px] font-bold text-white/60 bg-black/60 backdrop-blur-sm px-2 py-1">
                              {styleCount}
                            </span>

                            {!isDisabled && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400">
                                <div className="flex items-center gap-2 bg-gold text-white px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-widest shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                  Filter by {cat.name} <ArrowRight className="h-3.5 w-3.5" />
                                </div>
                              </div>
                            )}

                            {isDisabled && (
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <Clock className="h-8 w-8 text-white/20 mb-2" />
                                <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Available Soon</p>
                              </div>
                            )}
                          </div>

                          {/* Info panel */}
                          <div className="bg-[var(--surface-card)] border-t border-[var(--border)] p-5">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className={`font-display text-lg font-bold uppercase transition-colors duration-300 ${isDisabled
                                ? 'text-[var(--text-muted)] opacity-30'
                                : 'text-[var(--text)] group-hover:text-gold'
                                }`}>
                                {cat.name}
                              </h3>
                              {!isDisabled && (
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--text-muted)] transition-all duration-300 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                              )}
                            </div>

                            {cat.subCategories && cat.subCategories.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {cat.subCategories.slice(0, 3).map((sub) => (
                                  <span key={sub.id} className="px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider border border-gold/15 bg-gold/5 text-gold/50">
                                    {sub.name}
                                  </span>
                                ))}
                                {cat.subCategories.length > 3 && (
                                  <span className="px-2 py-0.5 font-mono text-[8px] border border-[var(--border)] text-[var(--text-muted)]">
                                    +{cat.subCategories.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}

                            {!isDisabled && (
                              <div className="mt-4 h-[1px] w-0 bg-gradient-to-r from-gold to-transparent transition-all duration-500 group-hover:w-full" />
                            )}
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* All Products Grid */}
            <ProductsGrid
              products={filteredProducts}
              heading={activeBrand
                ? (urlCategory !== 'all' && activeCategory
                  ? `${activeBrand.name} - ${activeCategory.name}`
                  : `${activeBrand.name} Collection`)
                : "Featured Products"}
              subheading={activeBrand ? `SHOWCASING ${activeBrand.name.toUpperCase()}` : "FEATURED PRODUCTS"}
              emptyMsg="No products listed yet matching this combination. Contact our Dubai export office."
            />
          </motion.div>

        ) : !activeCategory ? null : (
          /* ── FILTERED CATEGORY VIEW ── */
          <motion.div
            key={activeCategory.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category cinematic banner */}
            <div className="relative h-[280px] md:h-[360px] overflow-hidden border-b border-[var(--border)] pt-5">
              <Image
                src={activeCategory.image || CATEGORY_IMAGES[activeCategory.slug] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80'}
                alt={activeCategory.name}
                fill
                className="object-cover object-center opacity-40"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-14 max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-3.5 w-3.5 text-gold" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Garments · {activeCategory.name}</span>
                </div>
                <h2 className="font-display text-3xl font-bold uppercase text-white md:text-5xl">
                  {activeCategory.name}
                </h2>
                <p className="mt-3 text-sm text-white/50 max-w-lg font-light">
                  Premium {activeCategory.name.toLowerCase()} crafted for global B2B wholesale. All styles available in custom colors, fabrics, and branding.
                </p>
                <div className="mt-6 flex items-center gap-4">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                    {STYLE_COUNT[activeCategory.slug] ?? '80+ Styles'}
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">MOQ {activeBrand ? activeBrand.moq : division.stat1Value}</span>
                  <span className="text-white/20">·</span>
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Lead Time {division.stat2Value}</span>
                </div>
              </div>
            </div>

            {/* Sub-categories */}
            {activeCategory.subCategories && activeCategory.subCategories.length > 0 && (
              <div className="border-b border-[var(--border)] bg-[var(--surface-card)]">
                <div className="mx-auto max-w-[1560px] px-6 lg:px-12 py-6">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-3">Sub-Categories</p>
                  <div className="flex flex-wrap gap-2">
                    {activeCategory.subCategories.map((sub) => (
                      <span
                        key={sub.id}
                        className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider border transition-colors ${sub.status === 'active'
                          ? 'border-gold/30 bg-gold/10 text-gold cursor-default'
                          : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] opacity-50'
                          }`}
                      >
                        {sub.name}
                        {sub.status === 'coming-soon' && <span className="ml-2 text-[7px]">SOON</span>}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Filtered products */}
            <ProductsGrid
              products={filteredProducts}
              heading={activeBrand ? `${activeBrand.name} - ${activeCategory.name}` : `${activeCategory.name} Products`}
              subheading={activeBrand
                ? `SHOWCASING ${activeBrand.name.toUpperCase()} IN ${activeCategory.name.toUpperCase()}`
                : `${STYLE_COUNT[activeCategory.slug] ?? '80+ Styles'} available`}
              emptyMsg={`No matching products listed. Try clearing the brand filter to see all ${activeCategory.name} products.`}
            />

            {/* Back to all */}
            <div className="mx-auto max-w-[1560px] px-6 lg:px-12 pb-14 flex items-center justify-between gap-4">
              <button
                onClick={() => updateFilters('all', null)}
                className="flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:border-gold hover:text-gold transition-all duration-300"
              >
                ← Back to All Categories
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ENQUIRY CTA ─────────────────────────────────────────────── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">BULK ENQUIRY</span>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-[var(--text)]">
              Ready to order? <span className="text-gold">Request a quotation</span> instantly.
            </h3>
          </div>
          <Link
            href={`/contact?division=garments&category=${urlCategory !== 'all' ? urlCategory : ''}&brand=${urlBrand !== 'all' ? urlBrand : ''}&source=garments_hub&intent=bulk_quotation`}
            className="btn-gold text-[10px] shrink-0"
          >
            Request a Quotation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

// ─── Shared Products Grid Sub-Component ──────────────────────────────────────
function ProductsGrid({
  products,
  heading,
  subheading,
  emptyMsg,
}: {
  products: Product[]
  heading: string
  subheading: string
  emptyMsg: string
}) {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') || 'all'
  const urlBrand = searchParams.get('brand') || 'all'

  return (
    <section id="products-grid" className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12 scroll-mt-[40px]">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">{subheading}</span>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl font-semibold text-[var(--text)]">{heading}</h2>
        </div>
        {products.length > 0 && (
          <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
            {products.length} item{products.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {products.length === 0 ? (
        <div className="border border-[var(--border)] bg-[var(--surface)] px-6 py-20 text-center">
          <p className="font-display text-xl text-[var(--text-muted)]">{emptyMsg}</p>
          <Link
            href={`/contact?division=garments&category=${urlCategory !== 'all' ? urlCategory : ''}&brand=${urlBrand !== 'all' ? urlBrand : ''}&source=garments_hub_empty_grid&intent=bulk_quotation`}
            className="mt-6 inline-flex items-center gap-2 bg-gold text-white px-6 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-gold/90 transition-all"
          >
            Contact for Enquiry <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((p, i) => (
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
      )}

      {products.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Link
            href="/products/garments"
            className="group inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] transition-colors duration-200 hover:text-gold"
          >
            View All
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      )}
    </section>
  )
}
