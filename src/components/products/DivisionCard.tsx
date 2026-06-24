'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { MOCK_IMAGES } from '@/lib/constants'

const DIVISION_IMAGES: Record<string, string> = {
  garments:    MOCK_IMAGES.garments,
  uniforms:    MOCK_IMAGES.uniforms,
  hospitality: MOCK_IMAGES.hospitality,
  home:        MOCK_IMAGES.home,
  fragrance:   MOCK_IMAGES.fragrance,
  households:  MOCK_IMAGES.households,
}

// ── Same STATUS_CONFIG as KillingOffers ──────────────────────────────────────
type DivisionStatus = 'flagship' | 'established' | 'expanding' | 'newly-started' | 'active' | 'coming-soon'

const STATUS_CONFIG: Record<DivisionStatus, { badge: string; style: string }> = {
  flagship:        { badge: 'FLAGSHIP',       style: 'bg-gold text-white' },
  established:     { badge: 'ESTABLISHED',    style: 'bg-blue-500 text-white' },
  expanding:       { badge: 'MAJOR EXPANSION',style: 'bg-emerald-500 text-white' },
  'newly-started': { badge: 'NEWLY STARTED',  style: 'bg-amber-500 text-white' },
  active:          { badge: 'ACTIVE',         style: 'bg-gold text-white' },
  'coming-soon':   { badge: 'COMING SOON',    style: 'bg-neutral-600 text-white' },
}

interface DivisionCardProps {
  division: {
    name: string
    slug: string
    icon: string
    status?: string
    description: string
    heroHeading: string
    stat1Label: string
    stat1Value: string
    stat2Label: string
    stat2Value: string
    stat3Label: string
    stat3Value: string
    image?: string
  }
  productCount: number
  index: number
  /** large = full-width spanning card, small = standard card */
  variant?: 'large' | 'small'
}

export function DivisionCard({ division, productCount, index, variant = 'small' }: DivisionCardProps) {
  const image     = division.image || DIVISION_IMAGES[division.slug] || MOCK_IMAGES.textiles
  const status    = (division.status ?? 'active') as DivisionStatus
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG['active']

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link
        href={`/products/${division.slug}`}
        className="relative flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] transition-all duration-500 hover:border-gold/40"
        aria-label={`Browse ${division.name} products`}
      >
        {/* Image */}
        <div className={`relative w-full overflow-hidden ${variant === 'large' ? 'aspect-[16/7]' : 'aspect-[4/3]'}`}>
          <Image
            src={image}
            alt={`${division.name} products — WCC Garments`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes={variant === 'large' ? '100vw' : '(max-width: 768px) 100vw, 50vw'}
          />
          {/* Gradient overlay — strong enough for any image brightness */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />

          {/* Status badge — top-left, same KillingOffers pattern */}
          <span className={`absolute left-4 top-4 px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest z-10 ${statusCfg.style}`}>
            {statusCfg.badge}
          </span>

          {/* Arrow top-right */}
          <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center border border-white/20 bg-black/40 text-white/70 backdrop-blur-sm transition-all duration-300 group-hover:border-gold/60 group-hover:bg-gold/10 group-hover:text-gold">
            <ArrowUpRight size={14} strokeWidth={1.5} />
          </span>

          {/* Heading overlay at bottom */}
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {division.icon} · {division.name}
            </p>
            <h2 className={`mt-1.5 font-display font-semibold leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] ${variant === 'large' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}`}>
              {division.heroHeading}
            </h2>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="grid grid-cols-3 divide-x divide-[var(--border)] border-t border-[var(--border)]">
          <div className="px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{division.stat1Label}</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--text)]">{division.stat1Value}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{division.stat2Label}</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--text)]">{division.stat2Value}</p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">Products</p>
            <p className="mt-0.5 text-xs font-semibold text-[var(--text)]">{productCount} Listed</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
