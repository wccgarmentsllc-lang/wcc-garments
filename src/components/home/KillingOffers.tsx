'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { DIVISIONS, MOCK_IMAGES } from '@/lib/constants'

// ── Types ─────────────────────────────────────────────────────────────────────
type DivisionStatus = 'flagship' | 'established' | 'expanding' | 'newly-started' | 'active' | 'coming-soon'

const STATUS_CONFIG: Record<DivisionStatus, { badge: string; style: string }> = {
  flagship:       { badge: 'FLAGSHIP',      style: 'bg-gold text-white' },
  established:    { badge: 'ESTABLISHED',   style: 'bg-blue-500 text-white' },
  expanding:      { badge: 'MAJOR EXPANSION', style: 'bg-emerald-500 text-white' },
  'newly-started':{ badge: 'NEWLY STARTED', style: 'bg-amber-500 text-white' },
  active:         { badge: 'ACTIVE',        style: 'bg-gold text-white' },
  'coming-soon':  { badge: 'COMING SOON',   style: 'bg-neutral-600 text-white' },
}

const DIVISION_IMAGES: Record<string, string> = {
  garments:    MOCK_IMAGES.garments,
  uniforms:    MOCK_IMAGES.uniforms,
  hospitality: MOCK_IMAGES.hospitality,
  home:        MOCK_IMAGES.home,
  fragrance:   MOCK_IMAGES.fragrance,
  households:  MOCK_IMAGES.households,
}

import { useState, useEffect } from 'react'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

const DEFAULT_EXPANSION = {
  indicator: "OUR DIVERSIFIED FUTURE",
  headingStart: "Our Strategic",
  headingHighlight: "Expansion",
  description: "While premium garments remain our core business, we have successfully expanded our industrial capacities to serve major developments in uniforms, luxury hospitality textiles, home decor, fragrance, and household supply."
}

// Show the 4 expansion divisions (everyone except garments & home which have their own sections or have been excluded)
const EXPANSION_SLUGS = ['households', 'hospitality', 'uniforms', 'fragrance']

export function KillingOffers() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { data } = useWebsiteContent('strategic-expansion', DEFAULT_EXPANSION)
  const [liveDivisions, setLiveDivisions] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/categories?divisions=true', { cache: 'no-store' })
      .then(res => res.json())
      .then(res => {
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map((d: any) => ({
            ...d,
            stat1Label: d.stat1_label || d.stat1Label,
            stat1Value: d.stat1_value || d.stat1Value,
            stat2Label: d.stat2_label || d.stat2Label,
            stat2Value: d.stat2_value || d.stat2Value,
            stat3Label: d.stat3_label || d.stat3Label,
            stat3Value: d.stat3_value || d.stat3Value,
            heroHeading: d.hero_heading || d.heroHeading,
            heroSubtitle: d.hero_subtitle || d.heroSubtitle,
          }))
          setLiveDivisions(mapped)
        }
      })
      .catch(err => console.error('Failed to load live divisions:', err))
  }, [])

  const divisionsList = liveDivisions.length > 0 ? liveDivisions : DIVISIONS
  const expansionDivisions = EXPANSION_SLUGS.map((slug) => divisionsList.find((d) => d.slug === slug)).filter(Boolean) as any[]

  return (
    <section
      className="relative overflow-hidden bg-[#0A0A0A] py-16 md:py-24"
      ref={ref}
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-black/85" />
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/20 via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="grid gap-10 md:gap-16 lg:grid-cols-5 items-center">

          {/* Left — Expansion Statement */}
          <div className="lg:col-span-2 flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
                {data?.indicator || DEFAULT_EXPANSION.indicator}
              </span>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl font-bold text-white uppercase leading-tight">
                {data?.headingStart || DEFAULT_EXPANSION.headingStart}
              </h2>
              <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-gold leading-tight">
                {data?.headingHighlight || DEFAULT_EXPANSION.headingHighlight}
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-neutral-400">
                {data?.description || DEFAULT_EXPANSION.description}
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-gold hover:text-white hover:border-gold"
              >
                Inquire For Bulk Orders
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          </div>

          {/* Right — 2x2 Data-Driven Division Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {expansionDivisions.map((division, index) => {
                const statusCfg = STATUS_CONFIG[division.status as DivisionStatus] ?? STATUS_CONFIG['active']
                const image = division.image || DIVISION_IMAGES[division.slug] || MOCK_IMAGES.textiles

                return (
                  <motion.div
                    key={division.slug}
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15 + index * 0.1, ease: [0.76, 0, 0.24, 1] }}
                  >
                    <Link
                      href={`/products/${division.slug}`}
                      className="group relative block h-[220px] sm:h-[260px] overflow-hidden border border-white/10 rounded-none bg-neutral-950 transition-all duration-500 hover:border-gold/30 hover:shadow-[0_20px_50px_rgba(218,165,32,0.05)]"
                    >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                        <Image
                          src={image}
                          alt={division.name}
                          fill
                          className="object-cover opacity-80 scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
                          sizes="(max-width: 1024px) 280px, 350px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
                      </div>

                      {/* Status badge — driven from division.status */}
                      <span className={`absolute left-4 top-4 px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest z-10 ${statusCfg.style}`}>
                        {statusCfg.badge}
                      </span>

                      {/* Text content */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold leading-none">
                          {division.description}
                        </p>
                        <h3 className="mt-2 text-base font-bold text-white group-hover:text-gold transition-colors duration-300">
                          {division.name}
                        </h3>
                        <p className="mt-1 text-[11px] text-white/70">
                          MOQ: {division.stat1Value}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-gold opacity-0 transition-all duration-300 transform translate-y-1 group-hover:opacity-100 group-hover:translate-y-0">
                          Enquire Now <ArrowUpRight className="h-3 w-3" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}