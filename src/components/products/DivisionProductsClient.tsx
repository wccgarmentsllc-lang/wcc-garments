'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, ArrowUpRight, Tag, Clock, SlidersHorizontal, X, Layers, BookOpen, Building2, Mail, CheckCircle2, Loader2 } from 'lucide-react'
import { ProductCard } from './ProductCard'
import { CategoryBannerCarousel } from './CategoryBannerCarousel'
import { api } from '@/lib/api'

interface Category {
  id: string
  name: string
  slug: string
  status: 'active' | 'coming-soon'
  displayOrder: number
  subCategories?: any[]
  image?: string
  images?: string[]
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
  dbBrands?: any[]
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
  ],
  home: [
    {
      slug: 'vandegraff',
      name: 'Vandegraff',
      tagline: 'Premium Towels & Bath Textiles',
      desc: 'Exclusive collection of luxury bath towels, recycled towels, and home textiles designed for comfort, luxury, and durability.',
      moq: '100 units',
      styles: '120+ STYLES',
      segment: 'core',
      badge: 'LUXURY TEXTILES',
      style: 'border-gold text-gold bg-gold/5',
      perfectFor: ['Premium Retailers', 'Luxury Hotels', 'Home Decor Stores', 'Spas'],
      bgImage: '/images/home furnishing.png',
      logo: '/images/logo/vandegrafflogo.png',
      brandImage: '/images/logo/vandegrafflogo.png',
    }
  ]
}

const CATEGORY_IMAGES: Record<string, Record<string, string>> = {
  hospitality: {
    'barware': '/images/hos-1.png',
    'cookware': '/images/hos-2.png',
    'serving-tools': '/images/hos-3.png',
    'kitchen-tools': '/images/hos-3.png',
    'cutlery': '/images/hos-4.png',
    'storage-serving': '/images/hos-5.png',
    'storage': '/images/hos-5.png',
    'serving': '/images/hos-3.png',
  },
  households: {
    'cookware': '/images/hh-1.png',
    'cutlery': '/images/hh-2.png',
    'table-top': '/images/hh-3.png',
    'utility': '/images/hh-4.png',
  },
  uniforms: {
    'corporate-workwear': '/images/uniform-workwear.png',
    'security-attire': '/images/uniform-workwear.png',
    'industrial-ppe': '/images/uniform-workwear.png',
    'chef-kitchen-wear': '/images/uniform-workwear.png',
    'protective-aprons': '/images/uniform-workwear.png',
    'medical-scrubs': '/images/uniform-workwear.png',
  },
  home: {
    'bedsheets': '/images/home furnishing.png',
    'bath-textiles': '/images/home furnishing.png',
    'luxury-throws': '/images/home furnishing.png',
    'table-linen': '/images/home furnishing.png',
  },
  fragrance: {
    'arabian-oud': '/images/fragrance.png',
    'bakhoor-incense': '/images/fragrance.png',
    'eau-de-parfum': '/images/fragrance.png',
    'private-label': '/images/fragrance.png',
    'raw-materials': '/images/fragrance.png',
  }
}

const STYLE_COUNT: Record<string, Record<string, string>> = {
  hospitality: {
    'barware': '110+ Styles',
    'cookware': '80+ Styles',
    'serving-tools': '75+ Styles',
    'kitchen-tools': '75+ Styles',
    'cutlery': '120+ Styles',
    'storage-serving': '90+ Styles',
    'storage': '90+ Styles',
    'serving': '60+ Styles',
  },
  households: {
    'cookware': '80+ Styles',
    'cutlery': '120+ Styles',
    'table-top': '95+ Styles',
    'utility': '60+ Styles',
  },
  uniforms: {
    'corporate-workwear': '150+ Styles',
    'security-attire': '80+ Styles',
    'industrial-ppe': '120+ Styles',
    'chef-kitchen-wear': '90+ Styles',
    'protective-aprons': '70+ Styles',
    'medical-scrubs': '60+ Styles',
  },
  home: {
    'bedsheets': '120+ Styles',
    'bath-textiles': '90+ Styles',
    'luxury-throws': '80+ Styles',
    'table-linen': '50+ Styles',
  },
  fragrance: {
    'arabian-oud': '40+ Styles',
    'bakhoor-incense': '35+ Styles',
    'eau-de-parfum': '60+ Styles',
    'private-label': '20+ Styles',
    'raw-materials': '15+ Styles',
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
  dbBrands = [],
}: DivisionProductsClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filterBarRef = useRef<HTMLDivElement>(null)

  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false)
  const [catalogueName, setCatalogueName] = useState('')
  const [catalogueEmail, setCatalogueEmail] = useState('')
  const [catalogueCompany, setCatalogueCompany] = useState('')
  const [catalogueState, setCatalogueState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [catalogueError, setCatalogueError] = useState('')
  const [isDescExpanded, setIsDescExpanded] = useState(false)

  const handleCatalogueSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catalogueName || !catalogueEmail) {
      setCatalogueError('Name and Email are required')
      setCatalogueState('error')
      return
    }
    setCatalogueState('submitting')
    setCatalogueError('')
    try {
      const res = await api.submitCatalogueRequest({
        name: catalogueName,
        email: catalogueEmail,
        company: catalogueCompany || null,
        brand_slug: activeBrand?.slug,
      })
      if (res.success) {
        setCatalogueState('success')
        // Reset form
        setCatalogueName('')
        setCatalogueEmail('')
        setCatalogueCompany('')
      } else {
        setCatalogueError(res.error || 'Failed to submit request')
        setCatalogueState('error')
      }
    } catch (err: any) {
      setCatalogueError(err.message || 'An unexpected error occurred')
      setCatalogueState('error')
    }
  }

  const urlCategory = searchParams.get('category') || initialCategorySlug || 'all'
  const urlBrand = searchParams.get('brand') || initialBrandSlug || 'all'

  const activeCategory = categories.find((c) => c.slug === urlCategory) || null
  
  // Use DB brands if provided, otherwise fallback to hardcoded config
  const divisionBrands = dbBrands.length > 0 
    ? dbBrands.map((b) => ({
        slug: b.slug,
        name: b.name,
        tagline: b.tagline || 'Verified Brand',
        desc: b.description || 'Premium products from this manufacturer.',
        moq: 'Contact for MOQ',
        styles: 'Various Styles',
        segment: 'core',
        badge: 'VERIFIED BRAND',
        style: 'border-gold text-gold bg-gold/5',
        perfectFor: ['Wholesale Buyers', 'B2B Partners', 'Retailers'],
        bgImage: b.logo_desktop || '/images/hos-2.png',
        logo: b.logo_mobile || b.logo_desktop || '',
        brandImage: b.logo_desktop || b.logo_mobile || '',
      }))
    : (BRANDS_CONFIG_BY_DIVISION[divisionSlug] || [])

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

  // Build a slug -> name lookup from DB brands so product cards show real brand names
  const brandNameMap: Record<string, string> = {}
  divisionBrands.forEach((b) => { if (b.slug) brandNameMap[b.slug] = b.name })

  const enrichedProducts = filteredProducts.map((p) => ({
    ...p,
    brand_name: p.brand_slug ? (brandNameMap[p.brand_slug] ?? null) : null,
  }))

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
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  const clearAllFilters = () => {
    router.push(`/products/${divisionSlug}`, { scroll: false })
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
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
      <div className="flex items-center gap-4 pe-1 py-1">
        <div className="min-w-0 flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex w-max min-w-full items-center gap-0">
            <button
              onClick={() => updateFilters('all', null)}
              className={`relative shrink-0 px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                urlCategory === 'all'
                  ? 'text-gold font-extrabold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
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
                    className={`relative shrink-0 flex items-center gap-2 px-5 py-4 font-mono text-[11px] font-bold uppercase tracking-widest transition-all duration-300 ${
                      isActive
                        ? 'text-gold font-extrabold cursor-pointer'
                        : isDisabled
                        ? 'text-[var(--text-muted)]/30 cursor-not-allowed'
                        : 'text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer'
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
                  <div className="w-full border-2 border-transparent group-hover:border-[var(--border)] flex flex-col bg-[var(--bg-surface)] overflow-hidden">
                    <div className="relative w-full aspect-[4/3] flex items-center justify-center">
                      <Image
                        src={b.brandImage}
                        fill
                        alt={`${b.name} logo`}
                        className="object-fill transition-transform duration-500 group-hover:scale-105"
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
              <section className="mx-auto max-w-[1560px]  sm:px-0">
                <div className="relative border border-gold/30 bg-[var(--surface-card)] overflow-hidden p-4 sm:p-10 flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-between">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(218,165,32,0.06),transparent_50%)]" />

                  <div className="relative z-10 max-w-3xl space-y-3 sm:space-y-4">
                    <span className="font-mono text-[9px] font-bold tracking-widest text-gold border border-gold/30 bg-gold/10 px-2 py-0.5 uppercase">
                      Active Spotlight · {activeBrand.badge}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase text-[var(--text)]">
                      {activeBrand.name} Profile
                    </h3>
                    <p className={`text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-light ${!isDescExpanded ? 'line-clamp-2 md:line-clamp-none' : ''}`}>
                      {activeBrand.desc} Customization services include private labelling, custom packaging, and door-to-door B2B logistics.
                    </p>
                    {!isDescExpanded && (
                      <button
                        onClick={() => setIsDescExpanded(true)}
                        className="block md:hidden text-[9px] font-bold text-gold uppercase mt-1 cursor-pointer"
                      >
                        + Read More
                      </button>
                    )}
                    {isDescExpanded && (
                      <button
                        onClick={() => setIsDescExpanded(false)}
                        className="block md:hidden text-[9px] font-bold text-gold uppercase mt-1 cursor-pointer"
                      >
                        - Show Less
                      </button>
                    )}

                    <div className="grid grid-cols-3 gap-3 md:flex md:flex-wrap md:gap-6 pt-2">
                      {[
                        { label: 'Minimum Order', value: activeBrand.moq, gold: false },
                        { label: 'Lead Time', value: '12-18 Days', mobileValue: '12-18 Days', gold: false },
                        { label: 'Perfect For', value: activeBrand.perfectFor.slice(0, 3).join(', '), mobileValue: activeBrand.perfectFor[0], gold: true },
                      ].map((item) => (
                        <div key={item.label} className="border-l-2 border-gold/50 pl-2 sm:pl-3">
                          <span className="block text-[7px] sm:text-[8px] font-mono uppercase text-[var(--text-muted)] tracking-wider">{item.label}</span>
                          <span className={`text-[10px] sm:text-xs font-mono font-bold block ${item.gold ? 'text-gold' : 'text-[var(--text)]'}`}>
                            <span className="hidden md:inline">{item.value}</span>
                            <span className="md:hidden">{item.mobileValue || item.value}</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Category Filter Pills within this Brand */}
                    <div className="hidden md:block border-t border-[var(--border)] pt-5 mt-4">
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
                      className="bg-gold hover:bg-gold/90 text-white py-2.5 sm:py-3 px-5 sm:px-6 font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
                    >
                      <span>Show All Brands</span>
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Catalogue Request CTA Bar */}
                {(activeBrand.slug === 'horeca24h' || activeBrand.slug === 'aanya-homecraft' || activeBrand.slug === 'vandegraff') && (
                  <div className="mt-4 sm:mt-6 border border-dashed border-gold/30 bg-gold/5 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 font-mono">
                    <div className="flex items-center gap-3.5 w-full sm:w-auto">
                      <div className="hidden sm:flex h-10 w-10 shrink-0 rounded-full bg-gold/10 items-center justify-center border border-gold/20">
                        <BookOpen className="h-5 w-5 text-gold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold uppercase text-[var(--text)] tracking-wider text-left">Request WCC {activeBrand.name} Catalogue</h4>
                        <p className="hidden sm:block text-[10px] text-[var(--text-muted)] mt-1 font-sans font-light text-left">Get our comprehensive product listing, MOQs, specifications and dimensions delivered directly to your inbox.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsCatalogueOpen(true)}
                      className="relative w-full sm:w-auto shrink-0 overflow-hidden bg-gold hover:bg-gold/90 text-white font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-5 sm:px-6 py-3 sm:py-3.5 shadow-xl transition-all cursor-pointer group"
                    >
                      <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
                        <div className="w-8 bg-white/20" />
                      </div>
                      Request Catalogue
                    </button>
                  </div>
                )}
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
              products={enrichedProducts}
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
            {/* Category Banner Carousel */}
            {(() => {
              const imageMap = CATEGORY_IMAGES[divisionSlug] || {}
              const fallbackImage = activeCategory.image || imageMap[activeCategory.slug] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80'
              const fallbackImages = Array.isArray(fallbackImage) ? fallbackImage : [fallbackImage]
              
              const categoryImages = (activeCategory.images && activeCategory.images.length > 0)
                ? activeCategory.images
                : fallbackImages

              const styleMap = STYLE_COUNT[divisionSlug] || {}
              const styleCount = styleMap[activeCategory.slug] || '60+ Styles'

              return (
                <CategoryBannerCarousel
                  divisionName={divisionName}
                  categoryName={activeCategory.name}
                  images={categoryImages}
                  styleCount={styleCount}
                  moq={activeBrand ? activeBrand.moq : 'Varies'}
                  leadTime="12-18 Days"
                />
              )
            })()}

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
              products={enrichedProducts}
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

      {/* Catalogue Request Modal Popup */}
      <AnimatePresence>
        {isCatalogueOpen && activeBrand && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCatalogueOpen(false)
                setCatalogueState('idle')
                setCatalogueError('')
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative z-10 w-full max-w-md overflow-hidden border border-gold/30 bg-[var(--bg)] p-8 shadow-2xl text-[var(--text)] font-sans"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsCatalogueOpen(false)
                  setCatalogueState('idle')
                  setCatalogueError('')
                }}
                className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {catalogueState === 'success' ? (
                <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="font-display text-xl font-bold uppercase tracking-wider text-emerald-500">
                    Request Received
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed max-w-sm">
                    Thank you! Your request has been logged successfully. The administrator will approve it shortly and dispatch the digital catalogue to your mail in a few minutes.
                  </p>
                  <button
                    onClick={() => {
                      setIsCatalogueOpen(false)
                      setCatalogueState('idle')
                    }}
                    className="mt-4 px-6 py-2.5 bg-gold hover:bg-gold-light text-white font-mono text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-[9px] font-bold tracking-widest text-gold uppercase block mb-1">
                      Exclusive Access
                    </span>
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[var(--text)]">
                      Request {activeBrand.name} Catalogue
                    </h3>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1 font-light leading-relaxed">
                      Please enter your contact details. Our team will verify and deliver the complete catalogue PDF containing unit prices, dimensions and options.
                    </p>
                  </div>

                  <form onSubmit={handleCatalogueSubmit} className="space-y-4 font-mono text-xs">
                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold text-left">
                        Full Name *
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={catalogueName}
                          onChange={(e) => setCatalogueName(e.target.value)}
                          placeholder="John Doe"
                          className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 px-4 text-[var(--text)] placeholder-[var(--text-muted)]/40 focus:border-gold focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold text-left">
                        Business Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]/40" />
                        <input
                          type="email"
                          required
                          value={catalogueEmail}
                          onChange={(e) => setCatalogueEmail(e.target.value)}
                          placeholder="corporate@company.com"
                          className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-4 text-[var(--text)] placeholder-[var(--text-muted)]/40 focus:border-gold focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[9px] uppercase tracking-wider text-[var(--text-muted)] font-bold text-left">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-muted)]/40" />
                        <input
                          type="text"
                          value={catalogueCompany}
                          onChange={(e) => setCatalogueCompany(e.target.value)}
                          placeholder="Acme Corporation"
                          className="w-full border border-[var(--border)] bg-[var(--surface)] py-3 pl-10 pr-4 text-[var(--text)] placeholder-[var(--text-muted)]/40 focus:border-gold focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {catalogueError && (
                      <p className="text-[10px] text-red-500 font-sans mt-2 text-left">
                        {catalogueError}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={catalogueState === 'submitting'}
                      className="w-full bg-gold hover:bg-gold-light text-white font-mono text-[10px] font-bold uppercase tracking-widest py-4 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                      {catalogueState === 'submitting' ? (
                        <>
                          <Loader2 className="h-4.5 w-4.5 animate-spin" />
                          <span>Submitting Request...</span>
                        </>
                      ) : (
                        <span>Submit Catalogue Request</span>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
    <section id="products-grid" className="mx-auto max-w-[1560px]  py-12 lg:px-12 border-t border-[var(--border)] scroll-mt-[40px]">
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
            className="mt-6 inline-flex items-center gap-2 bg-gold text-white px-6 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest hover:bg-gold/90 transition-all"
          >
            Contact for Enquiry <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 items-stretch">
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
