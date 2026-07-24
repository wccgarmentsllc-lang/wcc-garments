'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Package,
  Calendar,
  Globe,
} from 'lucide-react'
import { DIVISIONS, MOCK_IMAGES, MOCK_PRODUCTS } from '@/lib/constants'

type DivisionStatus = 'flagship' | 'established' | 'expanding' | 'newly-started' | 'active' | 'coming-soon'

const STATUS_CONFIG: Record<DivisionStatus, { badge: string; style: string }> = {
  flagship:       { badge: 'FLAGSHIP DIVISION', style: 'bg-gold text-black font-bold' },
  established:    { badge: 'ESTABLISHED',       style: 'bg-blue-600 text-white font-bold' },
  expanding:      { badge: 'MAJOR EXPANSION',   style: 'bg-emerald-600 text-white font-bold' },
  'newly-started':{ badge: 'NEWLY STARTED',    style: 'bg-amber-600 text-white font-bold' },
  active:         { badge: 'ACTIVE DIVISION',   style: 'bg-gold text-black font-bold' },
  'coming-soon':  { badge: 'COMING SOON',       style: 'bg-neutral-700 text-white font-bold' },
}

const DIVISION_IMAGES: Record<string, string> = {
  garments:    MOCK_IMAGES.garments,
  uniforms:    MOCK_IMAGES.uniforms,
  hospitality: MOCK_IMAGES.hospitality,
  home:        MOCK_IMAGES.home,
  fragrance:   MOCK_IMAGES.fragrance,
  households:  MOCK_IMAGES.households,
}

const DIVISION_CATEGORIES: Record<string, string[]> = {
  garments: ['Formal Shirts', 'Polo & T-Shirts', 'Denim Jeans', 'Trousers & Chinos', 'Cargo Pants'],
  hospitality: ['Hotel Bed Linen', 'Triply Cookware', 'Kitchen Tools', 'Glassware & Bar', 'Table Cutlery'],
  uniforms: ['Corporate Workwear', 'Security Attire', 'Industrial PPE', 'Chef Wear', 'Medical Scrubs'],
  home: ['Bedsheets & Pillow Covers', 'Bath Towels', 'Cashmere Throws', 'Table Linen'],
  fragrance: ['Arabian Oud', 'Bakhoor Incense', 'Eau de Parfum', 'Private Label Fragrance'],
  households: ['Triply Cookware', 'Premium Cutlery', 'Table & Serveware', 'Storage Organizers'],
}

// Snappy & Fast transition config
const SNAPPY_SLIDE_TRANSITION = {
  duration: 0.25,
  ease: [0.25, 1, 0.5, 1], // Crisp & responsive curve
}

export function DivisionsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-80px' })

  const [divisionsList, setDivisionsList] = useState<any[]>(DIVISIONS)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    fetch('/api/categories?divisions=true', { cache: 'no-store' })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const staticMap = Object.fromEntries(
            DIVISIONS.map((d, index) => [d.slug, { icon: d.icon, index, categories: d.categories }])
          )

          const mapped = res.data.map((d: any) => ({
            ...d,
            icon: staticMap[d.slug]?.icon || d.icon || `DIV-0${d.id || 1}`,
            categories: d.categories || staticMap[d.slug]?.categories || [],
            stat1Label: d.stat1_label || d.stat1Label,
            stat1Value: d.stat1_value || d.stat1Value,
            stat2Label: d.stat2_label || d.stat2Label,
            stat2Value: d.stat2_value || d.stat2Value,
            stat3Label: d.stat3_label || d.stat3Label,
            stat3Value: d.stat3_value || d.stat3Value,
            heroHeading: d.hero_heading || d.heroHeading,
            heroSubtitle: d.hero_subtitle || d.heroSubtitle,
          }))

          mapped.sort((a: any, b: any) => {
            const idxA = staticMap[a.slug]?.index ?? 99
            const idxB = staticMap[b.slug]?.index ?? 99
            return idxA - idxB
          })

          setDivisionsList(mapped)
        }
      })
      .catch((err) => console.error('Failed to load divisions:', err))
  }, [])

  const count = divisionsList.length

  const goToSlide = useCallback((newIdx: number, dir: number = 1) => {
    setDirection(dir)
    setActiveIndex(newIdx)
  }, [])

  const nextSlide = useCallback(() => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % count)
  }, [count])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + count) % count)
  }, [count])

  // Autoplay
  useEffect(() => {
    if (isHovered || count === 0) return
    const timer = setInterval(() => {
      nextSlide()
    }, 4500)
    return () => clearInterval(timer)
  }, [isHovered, count, nextSlide])

  const activeDivision = divisionsList[activeIndex] || divisionsList[0]
  const statusCfg = STATUS_CONFIG[(activeDivision?.status as DivisionStatus) ?? 'active'] ?? STATUS_CONFIG['active']
  const activeImage = activeDivision?.image || DIVISION_IMAGES[activeDivision?.slug] || MOCK_IMAGES.textiles

  // Products count
  const productCount = MOCK_PRODUCTS.filter((p) => p.division_slug === activeDivision?.slug).length

  // Categories list
  const categoryChips = DIVISION_CATEGORIES[activeDivision?.slug] || (activeDivision?.categories || []).map((c: any) => c.name)

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-[#0A0A0A] py-20 lg:py-28 text-white border-t border-white/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Lighting */}
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/30 via-gold/5 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold mb-3">
              <span>OUR MANUFACTURING DIVISIONS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">
              EXPLORE OUR <span className="text-gold">PRODUCT DIVISIONS</span>
            </h2>
            <p className="mt-3 text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Explore our complete industrial portfolio across six B2B operational divisions — precision-engineered for global wholesale, hospitality, and corporate markets.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-4 bg-neutral-900/90 border border-white/10 px-4 py-2 backdrop-blur-md">
              <span className="font-mono text-xs text-neutral-400">
                <strong className="text-gold font-bold text-sm">{String(activeIndex + 1).padStart(2, '0')}</strong> / {String(count).padStart(2, '0')}
              </span>
              <div className="h-4 w-[1px] bg-white/15" />
              <div className="flex items-center gap-1">
                <button
                  onClick={prevSlide}
                  aria-label="Previous Division"
                  className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors duration-150 hover:text-gold active:scale-95"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Division"
                  className="flex h-8 w-8 items-center justify-center text-white/70 transition-colors duration-150 hover:text-gold active:scale-95"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Division Tab Filters */}
        <div className="mb-10 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-white/10 pb-4">
          {divisionsList.map((div, idx) => {
            const isActive = idx === activeIndex
            const displayName = div.slug === 'households' ? 'HOUSEHOLDS & ACCESSORIES' : div.name.toUpperCase()

            return (
              <button
                key={div.slug}
                onClick={() => goToSlide(idx, idx > activeIndex ? 1 : -1)}
                className={`relative px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'text-gold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="font-mono text-[10px] text-gold/70 mr-2">{div.icon || `0${idx + 1}`}</span>
                {displayName}
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderlineFast"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold shadow-[0_0_12px_rgba(218,165,32,0.6)]"
                    transition={{ type: 'spring', stiffness: 700, damping: 35 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Main Fast Division Slider Presentation */}
        <div className="relative overflow-hidden border border-white/10 bg-neutral-950 shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeDivision.slug}
              custom={direction}
              initial={{ opacity: 0, x: direction * 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -25 }}
              transition={SNAPPY_SLIDE_TRANSITION}
              className="grid lg:grid-cols-12 gap-0 items-stretch"
            >
              {/* Left Column: Image Showcase */}
              <div className="relative lg:col-span-6 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] overflow-hidden group">
                <Image
                  src={activeImage}
                  alt={`${activeDivision.name} B2B Division — WCC Fashions`}
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-neutral-950/20 lg:to-neutral-950" />

                {/* Status Badge */}
                <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                  <span className={`px-3 py-1 text-[9px] font-mono tracking-widest uppercase ${statusCfg.style}`}>
                    {statusCfg.badge}
                  </span>
                  <span className="bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-mono text-gold border border-gold/30">
                    {activeDivision.icon || `DIV-0${activeIndex + 1}`}
                  </span>
                </div>

                {/* Arrow Navigation Overlays */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="absolute left-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold hover:text-black z-10 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="absolute right-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all duration-200 hover:border-gold hover:bg-gold hover:text-black z-10 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Right Column: Division Content Details */}
              <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between bg-neutral-950 border-t lg:border-t-0 lg:border-l border-white/10">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gold">
                      DIVISION SPECIFICATIONS
                    </span>
                    <span className="text-xs font-mono text-neutral-400">
                      {productCount > 0 ? `${productCount}+ Products Listed` : 'Catalogue Active'}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase text-white tracking-tight">
                    {activeDivision.name === 'Households' ? 'HOUSEHOLDS & ACCESSORIES' : activeDivision.name}
                  </h3>

                  <p className="mt-2 font-display text-base font-semibold text-gold/90 leading-snug">
                    {activeDivision.heroHeading || activeDivision.description}
                  </p>

                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-neutral-400">
                    {activeDivision.heroSubtitle || activeDivision.metaDescription || activeDivision.description}
                  </p>

                  {/* Category Chips */}
                  {categoryChips && categoryChips.length > 0 && (
                    <div className="mt-8">
                      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500 mb-3">
                        FEATURED PRODUCT CATEGORIES
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categoryChips.slice(0, 5).map((catName: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs font-semibold text-neutral-300 hover:border-gold/50 hover:text-white transition-colors duration-150"
                          >
                            {catName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metrics Specs Row */}
                  <div className="mt-8 grid grid-cols-3 gap-4 border-t border-b border-white/10 py-4">
                    <div className="flex items-center gap-3">
                      <Package className="h-4 w-4 text-gold shrink-0" />
                      <div>
                        <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">MIN. ORDER</p>
                        <p className="text-xs font-bold text-white">{activeDivision.stat1Value || '50 Units'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gold shrink-0" />
                      <div>
                        <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">LEAD TIME</p>
                        <p className="text-xs font-bold text-white">{activeDivision.stat2Value || '12-20 Days'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe className="h-4 w-4 text-gold shrink-0" />
                      <div>
                        <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">LOGISTICS</p>
                        <p className="text-xs font-bold text-gold">50+ Countries</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Action Button */}
                <div className="mt-8 pt-2">
                  <Link
                    href={`/products/${activeDivision.slug}`}
                    className="w-full inline-flex items-center justify-center gap-3 bg-gold text-black font-bold text-xs uppercase tracking-[0.25em] py-4 px-8 transition-all duration-200 hover:bg-white hover:text-black shadow-[0_4px_25px_rgba(218,165,32,0.25)] group/btn"
                  >
                    <span>EXPLORE {activeDivision.name.toUpperCase()} CATALOGUE</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Bottom Progress Line */}
          <div className="h-[3px] bg-neutral-900 relative overflow-hidden">
            <motion.div
              className="absolute top-0 bottom-0 left-0 bg-gold shadow-[0_0_10px_rgba(218,165,32,0.8)]"
              initial={{ width: '0%' }}
              animate={{ width: `${((activeIndex + 1) / count) * 100}%` }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
