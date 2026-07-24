'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowUpRight, Package, Clock, Globe } from 'lucide-react'
import { DIVISIONS, MOCK_IMAGES, MOCK_PRODUCTS } from '@/lib/constants'
import { useCategoriesContext } from '@/context/CategoriesContext'

type DivisionStatus = 'flagship' | 'established' | 'expanding' | 'newly-started' | 'active' | 'coming-soon'

const STATUS_CONFIG: Record<DivisionStatus, { badge: string; dot: string }> = {
  flagship:       { badge: 'FLAGSHIP',     dot: 'bg-gold' },
  established:    { badge: 'ESTABLISHED',  dot: 'bg-blue-500' },
  expanding:      { badge: 'EXPANDING',    dot: 'bg-emerald-500' },
  'newly-started':{ badge: 'NEW',          dot: 'bg-amber-500' },
  active:         { badge: 'ACTIVE',       dot: 'bg-gold' },
  'coming-soon':  { badge: 'SOON',         dot: 'bg-neutral-400' },
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
  garments:    ['Formal Shirts', 'Polo & T-Shirts', 'Denim Jeans', 'Trousers & Chinos', 'Cargo Pants'],
  hospitality: ['Hotel Bed Linen', 'Triply Cookware', 'Kitchen Tools', 'Glassware & Bar', 'Table Cutlery'],
  uniforms:    ['Corporate Workwear', 'Security Attire', 'Industrial PPE', 'Chef Wear', 'Medical Scrubs'],
  home:        ['Bedsheets & Pillow Covers', 'Bath Towels', 'Cashmere Throws', 'Table Linen'],
  fragrance:   ['Arabian Oud', 'Bakhoor Incense', 'Eau de Parfum', 'Private Label Fragrance'],
  households:  ['Triply Cookware', 'Premium Cutlery', 'Table & Serveware', 'Storage Organizers'],
}

const SLIDE_TRANSITION = { duration: 0.28, ease: [0.25, 1, 0.5, 1] as const }

export function DivisionsCarousel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-80px' })

  const { divisions: contextDivisions } = useCategoriesContext()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isHovered, setIsHovered] = useState(false)

  const divisionsList = useMemo(() => {
    if (contextDivisions.length === 0) return DIVISIONS
    const staticMap = Object.fromEntries(
      DIVISIONS.map((d, index) => [d.slug, { icon: d.icon, index, categories: d.categories }])
    )
    const mapped = contextDivisions.map((d: any) => ({
      ...d,
      icon: staticMap[d.slug]?.icon || d.icon || `D${d.id || 1}`,
      categories: d.categories || staticMap[d.slug]?.categories || [],
      stat1Value: d.stat1_value || d.stat1Value,
      stat2Value: d.stat2_value || d.stat2Value,
      heroHeading: d.hero_heading || d.heroHeading,
      heroSubtitle: d.hero_subtitle || d.heroSubtitle,
    }))
    mapped.sort((a: any, b: any) => {
      const iA = staticMap[a.slug]?.index ?? 99
      const iB = staticMap[b.slug]?.index ?? 99
      return iA - iB
    })
    return mapped
  }, [contextDivisions])

  const count = divisionsList.length

  const goToSlide = useCallback((idx: number, dir: number = 1) => {
    setDirection(dir)
    setActiveIndex(idx)
  }, [])

  const nextSlide = useCallback(() => {
    setDirection(1)
    setActiveIndex((p) => (p + 1) % count)
  }, [count])

  const prevSlide = useCallback(() => {
    setDirection(-1)
    setActiveIndex((p) => (p - 1 + count) % count)
  }, [count])

  useEffect(() => {
    if (isHovered || count === 0) return
    const t = setInterval(nextSlide, 5000)
    return () => clearInterval(t)
  }, [isHovered, count, nextSlide])

  if (!divisionsList.length) return null

  const active = divisionsList[activeIndex] || divisionsList[0]
  const statusCfg = STATUS_CONFIG[(active?.status as DivisionStatus) ?? 'active'] ?? STATUS_CONFIG['active']
  const activeImage = active?.image || DIVISION_IMAGES[active?.slug] || MOCK_IMAGES.textiles
  const productCount = MOCK_PRODUCTS.filter((p) => p.division_slug === active?.slug).length
  const chips = DIVISION_CATEGORIES[active?.slug] || (active?.categories || []).map((c: any) => c.name)

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-white dark:bg-[#0A0A0A] border-t border-black/8 dark:border-white/8 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-[1440px] px-2 lg:px-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold mb-2">
              Our Manufacturing Divisions
            </p>
            <h2 className="md:text-4xl lg:text-5xl text-3xl font-bold uppercase tracking-tight text-[#0A0A0A] dark:text-white">
              Explore Our <span className="text-gold">Product Divisions</span>
            </h2>
          </div>

          {/* Counter + Nav */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-[11px] text-neutral-400">
              <span className="text-gold font-bold">{String(activeIndex + 1).padStart(2, '0')}</span>
              {' / '}
              {String(count).padStart(2, '0')}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={prevSlide}
                aria-label="Previous"
                className="flex h-8 w-8 items-center justify-center border border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:text-gold hover:border-gold transition-colors duration-150"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next"
                className="flex h-8 w-8 items-center justify-center border border-black/10 dark:border-white/10 text-neutral-500 dark:text-neutral-400 hover:text-gold hover:border-gold transition-colors duration-150"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Tab Bar ── */}
        <div className="mb-6 hidden sm:flex items-center gap-0 overflow-x-auto no-scrollbar border-b border-black/8 dark:border-white/8">
          {divisionsList.map((div: any, idx: number) => {
            const isActive = idx === activeIndex
            const label = div.slug === 'households' ? 'Households & Acc.' : div.name
            return (
              <button
                key={div.slug}
                onClick={() => goToSlide(idx, idx > activeIndex ? 1 : -1)}
                className={`relative px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors duration-150 whitespace-nowrap ${
                  isActive
                    ? 'text-gold'
                    : 'text-neutral-400 dark:text-neutral-500 hover:text-[#0A0A0A] dark:hover:text-white'
                }`}
              >
                {label}
                {isActive && (
                  <motion.div
                    layoutId="divTabLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
                    transition={{ type: 'spring', stiffness: 600, damping: 32 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* ── Main Slide Panel ── */}
        <div className="relative overflow-hidden rounded-none border border-black/8 dark:border-white/8 bg-neutral-50 dark:bg-neutral-950">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.slug}
              custom={direction}
              initial={{ opacity: 0, x: direction * 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -20 }}
              transition={SLIDE_TRANSITION}
              className="grid lg:grid-cols-2"
            >
              {/* Left: Image */}
              <div className="relative min-h-[280px] sm:min-h-[360px] lg:min-h-[440px] overflow-hidden group">
                <Image
                  src={activeImage}
                  alt={`${active.name} — WCC Fashions`}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                {/* Subtle edge fade */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-50/60 dark:to-neutral-950/60 pointer-events-none" />

                {/* Status pill */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 border border-black/8 dark:border-white/10">
                  <span className={`h-1.5 w-1.5 rounded-full ${statusCfg.dot}`} />
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#0A0A0A] dark:text-white">
                    {statusCfg.badge}
                  </span>
                </div>

                {/* Image nav overlays */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center bg-white/80 dark:bg-black/60 border border-black/10 dark:border-white/20 text-[#0A0A0A] dark:text-white hover:bg-gold hover:text-black hover:border-gold transition-all duration-150 opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 h-9 w-9 flex items-center justify-center bg-white/80 dark:bg-black/60 border border-black/10 dark:border-white/20 text-[#0A0A0A] dark:text-white hover:bg-gold hover:text-black hover:border-gold transition-all duration-150 opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Right: Content */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-white dark:bg-neutral-950 border-t lg:border-t-0 lg:border-l border-black/8 dark:border-white/8">
                <div>
                  {/* Division label */}
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-gold mb-3">
                    Division Specifications
                  </p>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0A0A0A] dark:text-white leading-tight">
                    {active.name === 'Households' ? 'Households & Accessories' : active.name}
                  </h3>

                  {/* Sub headline */}
                  {active.heroHeading && (
                    <p className="mt-2 text-sm font-semibold text-gold/90 leading-snug">
                      {active.heroHeading}
                    </p>
                  )}

                  {/* Description */}
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-500 dark:text-neutral-400 line-clamp-3">
                    {active.heroSubtitle || active.metaDescription || active.description}
                  </p>

                  {/* Category chips */}
                  {chips.length > 0 && (
                    <div className="mt-5">
                      <p className="text-[9px] font-mono font-bold uppercase tracking-widest text-neutral-400 mb-2">
                        Categories
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {chips.slice(0, 5).map((cat: string, i: number) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 bg-black/4 dark:bg-white/5 border border-black/8 dark:border-white/8 text-[10px] font-medium text-neutral-600 dark:text-neutral-300"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Metrics row */}
                  <div className="mt-6 grid grid-cols-3 gap-3 pt-5 border-t border-black/8 dark:border-white/8">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Package className="h-3 w-3 text-gold" />
                        <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">Min. Order</p>
                      </div>
                      <p className="text-xs font-bold text-[#0A0A0A] dark:text-white">
                        {active.stat1Value || '50 Units'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-gold" />
                        <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">Lead Time</p>
                      </div>
                      <p className="text-xs font-bold text-[#0A0A0A] dark:text-white">
                        {active.stat2Value || '12–20 Days'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Globe className="h-3 w-3 text-gold" />
                        <p className="text-[9px] font-mono uppercase tracking-wider text-neutral-400">Logistics</p>
                      </div>
                      <p className="text-xs font-bold text-gold">50+ Countries</p>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-6">
                  <Link
                    href={`/products/${active.slug}`}
                    className="inline-flex w-full items-center justify-center gap-2 bg-gold text-white text-[11px] font-bold uppercase tracking-[0.2em] py-3 px-6 hover:bg-[#0A0A0A] hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-200 group/btn"
                  >
                    <span>Explore {active.name} Catalogue</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                  {productCount > 0 && (
                    <p className="mt-2 text-center text-[10px] text-neutral-400">
                      {productCount}+ products available
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>

        {/* ── Dot indicators ── */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {divisionsList.map((_: any, i: number) => (
            <button
              key={i}
              onClick={() => goToSlide(i, i > activeIndex ? 1 : -1)}
              aria-label={`Go to division ${i + 1}`}
              className={`transition-all duration-200 rounded-full ${
                i === activeIndex
                  ? 'w-5 h-1.5 bg-gold'
                  : 'w-1.5 h-1.5 bg-black/20 dark:bg-white/20 hover:bg-gold/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
