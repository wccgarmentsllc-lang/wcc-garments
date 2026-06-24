'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, ArrowUpRight, Tag, Clock, SlidersHorizontal, X, Layers } from 'lucide-react'
import { ProductCard } from './ProductCard'

interface Category {
  id: string
  name: string
  slug: string
  status: 'active' | 'coming-soon'
  displayOrder: number
  subCategories?: any[]
  image?: string
}

interface DivisionProductsClientProps {
  products: Array<{
    id: string
    name: string
    slug: string
    images: string[]
    division?: { name: string; slug: string } | null
    category?: { name: string; slug?: string } | null
    categories?: { name: string; slug?: string }[] | null
    moq: string | null
    is_new: boolean
    is_offer: boolean
    offer_label: string | null
    short_description?: string | null
    brand_slug?: string | null
  }>
  categories: Category[]
  divisionSlug: string
  divisionName: string
  initialCategorySlug?: string
  initialBrandSlug?: string
}

interface BrandConfig {
  slug: string
  name: string
  tagline: string
  desc: string
  moq: string
  styles: string
  segment: string
  badge: string
  style: string
  perfectFor: string[]
  bgImage: string
  logo: string
  brandImage: string
}

const BRANDS_CONFIG_BY_DIVISION: Record<string, BrandConfig[]> = {
  hospitality: [
    {
      slug: 'horeca24h',
      name: 'Horeca24h',
      tagline: 'Professional Hospitality Serveware & Bar Accessories',
      desc: 'Elegant serveware, copper mule mugs, cocktail tools, and table cutlery designed for F&B establishments, hotels, and luxury catering services. Built to commercial grade standards.',
      moq: '50 units',
      styles: '120+ STYLES',
      segment: 'core',
      badge: 'COMMERCIAL GRADE',
      style: 'border-gold text-gold bg-gold/5',
      perfectFor: ['5-Star Hotels', 'Fine Dining Restaurants', 'Boutique Cafes', 'Luxury Catering'],
      bgImage: '/images/hos-2.png',
      logo: '/images/logo/horeca24h.png',
      brandImage: '/images/logo/horeca24h.png',
    }
  ],
  households: [
    {
      slug: 'aanya-homecraft',
      name: 'Aanya Homecraft',
      tagline: 'Artisanal Woodenware & High-Performance Cookware',
      desc: 'Premium tri-ply stainless steel cookware and handcrafted acacia wood serving bowls. Fusing traditional craftsmanship with modern kitchen utility.',
      moq: '100 units',
      styles: '80+ STYLES',
      segment: 'core',
      badge: 'ARTISANAL LUXURY',
      style: 'border-gold text-gold bg-gold/5',
      perfectFor: ['Premium Retailers', 'Kitchenware Distributors', 'Corporate Gifting', 'Modern Homes'],
      bgImage: '/images/hh-1.png',
      logo: '/images/logo/aanyahomecraft.png',
      brandImage: '/images/logo/aanyahomecraft.png',
    }
  ]
}

const CATEGORY_IMAGES: Record<string, Record<string, string>> = {
  hospitality: {
    'barware': '/images/hos-1.png',
    'cookware': '/images/hos-2.png',
    'serving-tools': '/images/hos-3.png',
    'cutlery': '/images/hos-4.png',
    'storage-serving': '/images/hos-5.png',
  },
  households: {
    'cookware': '/images/hh-1.png',
    'cutlery': '/images/hh-2.png',
    'table-top': '/images/hh-3.png',
    'utility': '/images/hh-4.png',
  }
}

const STYLE_COUNT: Record<string, Record<string, string>> = {
  hospitality: {
    'barware': '110+ Styles',
    'cookware': '80+ Styles',
    'serving-tools': '75+ Styles',
    'cutlery': '120+ Styles',
    'storage-serving': '90+ Styles',
  },
  households: {
    'cookware': '80+ Styles',
    'cutlery': '120+ Styles',
    'table-top': '95+ Styles',
    'utility': '60+ Styles',
  }
}

type CatStatus = 'active' | 'coming-soon'

const STATUS_CONFIG: Record<CatStatus, { badge: string; style: string }> = {
  'active': { badge: 'ACTIVE', style: 'bg-gold text-white' },
  'coming-soon': { badge: 'COMING SOON', style: 'bg-[var(--surface-muted)] text-[var(--text-muted)]' },
}

export function DivisionProductsClient({
  products,
  categories,
  divisionSlug,
  divisionName,
  initialCategorySlug,
  initialBrandSlug,
}: DivisionProductsClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filterBarRef = useRef<HTMLDivElement>(null)

  const urlCategory = searchParams.get('category') || initialCategorySlug || 'all'
  const urlBrand = searchParams.get('brand') || initialBrandSlug || 'all'

  const activeCategory = categories.find((c) => c.slug === urlCategory) || null
  const divisionBrands = BRANDS_CONFIG_BY_DIVISION[divisionSlug] || []
  const activeBrand = divisionBrands.find((b) => b.slug === urlBrand) || null

  // Normalize a string for comparison (lowercase, alphanumeric only)
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

  const filteredProducts = products.filter((p) => {
    let categoryMatch = true
    if (activeCategory) {
      const categories = p.categories && p.categories.length > 0 
        ? p.categories.map((c: any) => typeof c === 'string' ? { name: c, slug: c.toLowerCase().replace(/[^a-z0-9]+/g, '-') } : c)
        : (p.category ? [p.category] : []);
        
      const activeName = norm(activeCategory.name)
      const activeSlug = norm(activeCategory.slug)

      categoryMatch = categories.some((c: any) => {
        const pCatName = c.name || ''
        const pCatSlug = c.slug || ''
        const pNormName = norm(pCatName)
        const pNormSlug = norm(pCatSlug)

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
    if (catSlug === 'all') {
      params.delete('category')
    } else if (catSlug !== null) {
      params.set('category', catSlug)
    }
    if (brandSlug === 'all') {
      params.delete('brand')
    } else if (brandSlug !== null) {
      params.set('brand', brandSlug)
    }
    router.push(`/products/${divisionSlug}${params.toString() ? '?' + params.toString() : ''}`, { scroll: false })
    if (catSlug !== null) {
      setTimeout(() => {
        filterBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }

  const clearAllFilters = () => {
    router.push(`/products/${divisionSlug}`, { scroll: false })
  }

  const renderAllProductsButton = (className = '') => (
    <button
      onClick={clearAllFilters}
      className={`group relative inline-flex items-center gap-2 overflow-hidden bg-[var(--text)] px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--bg)] transition-all hover:bg-gold hover:text-white shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer ${className}`}
    >
      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
        <div className="w-8 bg-white/20" />
      </div>
      <Layers className="h-3.5 w-3.5" />
      <span>All Products</span>
    </button>
  )

  const renderCategoryFilterBar = (className = '') => (
    <div
      ref={filterBarRef}
      className={`sticky top-[84px] z-40 overflow-hidden border border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.08)] ${className}`}
    >
      <div className="flex items-center gap-4 px-2 py-1">
        <div className="min-w-0 flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex w-max min-w-full items-center gap-0">
            <button
              onClick={() => updateFilters('all', null)}
              className={`relative shrink-0 px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border-b-2 cursor-pointer ${
                urlCategory === 'all'
                  ? 'border-gold text-gold font-extrabold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              All Categories
            </button>

            {categories
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((category) => {
                const isActive = urlCategory === category.slug
                const isDisabled = category.status === 'coming-soon'
                return (
                  <button
                    key={category.slug}
                    onClick={() => !isDisabled && updateFilters(category.slug, null)}
                    disabled={isDisabled}
                    className={`relative shrink-0 flex items-center gap-2 px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-300 border-b-2 ${
                      isActive
                        ? 'border-gold text-gold font-extrabold cursor-pointer'
                        : isDisabled
                        ? 'border-transparent text-[var(--text-muted)]/30 cursor-not-allowed'
                        : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer'
                    }`}
                  >
                    {category.name}
                    {isDisabled && (
                      <span className="ml-1 rounded-[2px] bg-[var(--border)] px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-[var(--text-muted)]/60">
                        Soon
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
  )

  return (
    <div className="w-full">

      {/* ── BRAND BROWSE SECTION ── */}
      {urlCategory === 'all' && urlBrand === 'all' && divisionBrands.length > 0 && (
        <section className="mx-auto max-w-[1560px] px-6 lg:px-12 py-16 border-b border-[var(--border)]">
          <div className="text-center max-w-3xl mx-auto mb-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              ✦ PARTNER BRANDS
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--text)]">
              Browse by <span className="text-gold">Brand</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[var(--text-muted)] max-w-2xl mx-auto">
              Explore specialized product collections from our verified manufacturing houses. Click a brand to filter its collection.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {divisionBrands.map((b, index) => (
              <motion.div
                key={b.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.8, delay: 0.1 + index * 0.1, ease: [0.76, 0, 0.24, 1] }}
                className="w-full max-w-[320px]"
              >
                <button
                  onClick={() => updateFilters(null, b.slug)}
                  className="group relative flex flex-col overflow-hidden w-full text-left transition-all duration-500 cursor-pointer"
                >
                  <div className="w-full border-2 border-transparent group-hover:border-[var(--border)] flex items-center justify-center p-6 bg-[var(--bg-surface)]">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <Image
                        src={b.brandImage}
                        fill
                        alt={`${b.name} logo`}
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-display text-lg font-bold text-[var(--text)] group-hover:text-gold transition-colors duration-300">
                      {b.name}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      {b.tagline}
                    </p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── ACTIVE FILTERS BAR ── */}
      <AnimatePresence>
        {(urlCategory !== 'all' || urlBrand !== 'all') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[var(--surface)] border-b border-[var(--border)] py-3"
          >
            <div className="mx-auto max-w-[1560px] px-6 lg:px-12 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-[var(--text-muted)] flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                  <SlidersHorizontal className="h-3 w-3" />
                  Active Filters:
                </span>

                {urlCategory !== 'all' && activeCategory && (
                  <button
                    onClick={() => updateFilters('all', null)}
                    className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 hover:border-gold/60 text-gold px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                  >
                    Category: {activeCategory.name}
                    <X className="h-3 w-3" />
                  </button>
                )}

                {urlBrand !== 'all' && activeBrand && (
                  <button
                    onClick={() => updateFilters(null, 'all')}
                    className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/30 hover:border-gold/60 text-gold px-2.5 py-1 text-[10px] font-bold uppercase transition-colors cursor-pointer"
                  >
                    Brand: {activeBrand.name}
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <button
                onClick={clearAllFilters}
                className="text-[var(--text-muted)] hover:text-[var(--text)] underline underline-offset-4 text-[10px] uppercase font-bold tracking-wider transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── STICKY CATEGORY FILTER BAR ── */}
      {!activeBrand && urlCategory === 'all' ? null : renderCategoryFilterBar()}

      {/* ── CONTENT AREA ── */}
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
              <section className="mx-auto max-w-[1560px] px-6 lg:px-12 pt-12">
                <div className="relative border border-gold/30 bg-[var(--surface-card)] overflow-hidden p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(218,165,32,0.06),transparent_50%)]" />

                  <div className="relative z-10 max-w-3xl space-y-4">
                    <span className="font-mono text-[9px] font-bold tracking-widest text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 uppercase">
                      Active Spotlight · {activeBrand.badge}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[var(--text)]">
                      {activeBrand.name} Profile
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed font-light">
                      {activeBrand.desc} Customization services include private labelling, custom packaging, and door-to-door B2B logistics.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                      {[
                        { label: 'Minimum Order', value: activeBrand.moq, gold: false },
                        { label: 'Lead Time', value: '12-18 Working Days', gold: false },
                        { label: 'Perfect For', value: activeBrand.perfectFor.slice(0, 3).join(', '), gold: true },
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
                          className={`px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${urlCategory === 'all'
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
                              className={`px-3 py-1.5 font-mono text-[9px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${isActive
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
                      className="bg-gold hover:bg-gold/90 text-white py-3 px-6 font-mono text-[10px] font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
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
                    <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">{divisionName.toUpperCase()} CATALOG</span>
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
                    const imageMap = CATEGORY_IMAGES[divisionSlug] || {}
                    const image = cat.image || imageMap[cat.slug] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'
                    const styleMap = STYLE_COUNT[divisionSlug] || {}
                    const styleCount = styleMap[cat.slug] || '60+ Styles'
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
                          className={`group relative block w-full text-left overflow-hidden border transition-all duration-500 cursor-pointer ${isDisabled
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

            {/* Products Grid */}
            <ProductsGrid
              products={filteredProducts}
              divisionSlug={divisionSlug}
              heading={activeBrand
                ? (urlCategory !== 'all' && activeCategory
                  ? `${activeBrand.name} - ${activeCategory.name}`
                  : `${activeBrand.name} Collection`)
                : `Featured Products`}
              subheading={activeBrand ? `SHOWCASING ${activeBrand.name.toUpperCase()}` : "FEATURED PRODUCTS"}
              emptyMsg={`No products listed yet matching this combination. Contact our team to request custom manufacturing options.`}
            />
          </motion.div>
        ) : !activeCategory ? null : (
          /* ── FILTERED CATEGORY BANNER VIEW ── */
          <motion.div
            key={activeCategory.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Category Banner */}
            <div className="relative h-[280px] md:h-[360px] overflow-hidden border-b border-[var(--border)]">
              {(() => {
                const imageMap = CATEGORY_IMAGES[divisionSlug] || {}
                const image = activeCategory.image || imageMap[activeCategory.slug] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80'
                const styleMap = STYLE_COUNT[divisionSlug] || {}
                const styleCount = styleMap[activeCategory.slug] || '60+ Styles'
                return (
                  <>
                    <Image
                      src={image}
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
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">{divisionName} · {activeCategory.name}</span>
                      </div>
                      <h2 className="font-display text-3xl font-bold uppercase text-white md:text-5xl">
                        {activeCategory.name}
                      </h2>
                      <p className="mt-3 text-sm text-white/50 max-w-lg font-light">
                        Premium {activeCategory.name.toLowerCase()} crafted for global B2B wholesale. All styles available in custom colors, finishes, and branding.
                      </p>
                      <div className="mt-6 flex items-center gap-4">
                        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
                          {styleCount}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">MOQ {activeBrand ? activeBrand.moq : 'Varies'}</span>
                        <span className="text-white/20">·</span>
                        <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">Lead Time 12-18 Days</span>
                      </div>
                    </div>
                  </>
                )
              })()}
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

            {/* Products grid */}
            <ProductsGrid
              products={filteredProducts}
              divisionSlug={divisionSlug}
              heading={activeBrand ? `${activeBrand.name} - ${activeCategory.name}` : `${activeCategory.name} Products`}
              subheading={activeBrand
                ? `SHOWCASING ${activeBrand.name.toUpperCase()} IN ${activeCategory.name.toUpperCase()}`
                : `COLLECTION`}
              emptyMsg={`No matching products listed. Try clearing the brand filter to see all ${activeCategory.name} products.`}
            />

            {/* Back to all button */}
            <div className="mx-auto max-w-[1560px] px-6 lg:px-12 pb-14 flex items-center justify-between gap-4">
              <button
                onClick={() => updateFilters('all', null)}
                className="flex items-center gap-2 border border-[var(--border)] bg-[var(--surface)] px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)] hover:border-gold hover:text-gold transition-all duration-300 cursor-pointer"
              >
                ← Back to All Categories
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ENQUIRY CTA SECTION ── */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">BULK ENQUIRY</span>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-[var(--text)]">
              Ready to order? <span className="text-gold">Request a quotation</span> instantly.
            </h3>
          </div>
          <Link
            href={`/contact?division=${divisionSlug}&category=${urlCategory !== 'all' ? urlCategory : ''}&brand=${urlBrand !== 'all' ? urlBrand : ''}&source=division_catalog&intent=bulk_quotation`}
            className="btn-gold text-[10px] shrink-0"
          >
            Request a Quotation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

// ─── Products Grid Sub-Component ───
function ProductsGrid({
  products,
  divisionSlug,
  heading,
  subheading,
  emptyMsg,
}: {
  products: any[]
  divisionSlug: string
  heading: string
  subheading: string
  emptyMsg: string
}) {
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') || 'all'
  const urlBrand = searchParams.get('brand') || 'all'

  return (
    <section className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12 border-t border-[var(--border)]">
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
            href={`/contact?division=${divisionSlug}&category=${urlCategory !== 'all' ? urlCategory : ''}&brand=${urlBrand !== 'all' ? urlBrand : ''}&source=division_catalog_empty_grid&intent=bulk_quotation`}
            className="mt-6 inline-flex items-center gap-2 border border-gold/30 bg-gold/10 px-6 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-gold hover:bg-gold hover:text-white transition-all"
          >
            Contact for Enquiry <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              divisionSlug={divisionSlug}
            />
          ))}
        </div>
      )}

      {products.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Link
            href={`/products/${divisionSlug}`}
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
