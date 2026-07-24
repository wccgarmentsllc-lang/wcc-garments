'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const GARMENT_SPECIALTIES = [
  { icon: 'EFW', name: 'Executive Formal Wear', count: 'Egyptian Cotton & Linens' },
  { icon: 'BCA', name: 'Bespoke Blazers & Suits', count: 'Luxury Velvet & Fine Wool' },
  { icon: 'PKP', name: 'Premium Knits & Polos', count: 'High-End Double Pique' },
  { icon: 'OWC', name: 'Specialized Outerwear', count: 'Technical & Weatherproof' },
  { icon: 'FBC', name: 'Fashion Brand Programs', count: 'High-Street & Luxury OEM' },
  { icon: 'HPW', name: 'Industrial Workwear', count: 'Flame-Resistant & Heavy-Duty' },
]

export function GarmentsSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative overflow-hidden bg-[var(--bg)] py-section border-t border-[var(--border)]" ref={ref}>
      {/* Background visual accent */}
      <div className="absolute top-0 right-0 -z-10 h-[500px] w-[500px] rounded-full bg-gold/5 blur-[120px]" />

      <div className="mx-auto max-w-[1440px] px-3 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left — Content */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
                ✦ CORE BUSINESS FOUNDATION
              </span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--text)]">
                Bespoke Garment <span className="text-gold">Manufacturing</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
                For over a quarter-century, custom garments have remained the absolute heart of Western Clothing Company. Operating high-capacity manufacturing centers across Bangalore and Dubai, we engineer premium apparel programs for global retailers, luxury hotels, corporate groups, and industrial brands.
              </p>
            </motion.div>

            {/* Specialties Grid */}
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {GARMENT_SPECIALTIES.map((spec, i) => (
                <motion.div
                  key={spec.name}
                  className="border border-[var(--border)] bg-[var(--bg-surface)] p-4 transition-all duration-300 hover:border-gold/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                >
                  <span className="font-mono text-xs font-bold tracking-wider text-gold">{spec.icon}</span>
                  <p className="mt-2 text-xs font-semibold text-[var(--text)]">{spec.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-1">{spec.count}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-10"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="/products/garments"
                className="btn-gold text-[10px]"
              >
                Explore Garments Division
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </motion.div>
          </div>

          {/* Right — Featured Luxury Visual */}
          <motion.div
            className="relative order-1 lg:order-2"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="relative aspect-[4/5] border overflow-hidden shadow-2xl border-white/5 bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80"
                alt="Premium tailored menswear fabric and suit production"
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                  Dubai & Bangalore Operations
                </span>
                <h3 className="mt-2 font-display text-3xl font-semibold text-white">
                  Bespoke Corporate Blazers & VIP Collections
                </h3>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
