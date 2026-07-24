'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'
import { ResponsivePicture } from '@/components/ui/ResponsivePicture'
import { getDivisionCategoryHref } from '@/lib/category-routing'

const DEFAULT_HOSPITALITY = {
  indicator: "HOSPITALITY DIVISION",
  headingStart: "Shop By ",
  headingHighlight: "Products",
  description: "Outfitting the world's finest hospitality with Horeca24h premium barware, commercial cookware, kitchen utensils, elegant table cutlery, and buffet serving solutions.",
  categories: [
    { name: 'Barware Products', slug: 'barware', tagline: 'Premium ice buckets, coolers & shaker tools', count: '100+ MOQ', image: '/images/hos-1.png' },
    { name: 'Cookware Products', slug: 'cookware', tagline: 'Professional triply stainless steel cook pots', count: '50+ MOQ', image: '/images/hos-2.png' },
    { name: 'Kitchen Tools', slug: 'kitchen-tools', tagline: 'High-end serving tongs and chef prep utensils', count: '200+ MOQ', image: '/images/hos-3.png' },
    { name: 'Table Cutlery', slug: 'cutlery', tagline: 'Mirror polished hotel-grade cutlery sets', count: '250+ MOQ', image: '/images/hos-4.png' },
    { name: 'Storage', slug: 'storage', tagline: 'Wire buffet baskets and wood serving trays', count: '150+ MOQ', image: '/images/hos-5.png' },
    { name: 'Serving', slug: 'serving', tagline: 'Elegant copper and stainless buffet serveware', count: '100+ MOQ', image: '/images/hos-3.png' }
  ]
}

export function HospitalityShowcase() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const { data } = useWebsiteContent('hospitality-showcase-v2', DEFAULT_HOSPITALITY)

  return (
    <section className="bg-[var(--bg)] py-16 md:py-24 border-t border-[var(--border)]" ref={ref}>
      <div className="mx-auto max-w-[1440px] px-3 lg:px-10">

        {/* Section Header */}
        <div className="mb-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
                {data.indicator}
              </span>
            </div>
          </motion.div>
          <motion.h2
            className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--text)] uppercase"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          >
            {data.headingStart}<span className="text-gold">{data.headingHighlight}</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-sm sm:text-base leading-relaxed text-gray-500 max-w-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {data.description}
          </motion.p>
        </div>

        {/* 3x2 Portrait Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {data.categories.map((category: any, index: number) => (
            <motion.div
              key={category.slug || index}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.1 + index * 0.08,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <Link
                href={getDivisionCategoryHref('hospitality', category.slug || category.name)}
                className="group relative block overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] rounded-none transition-all duration-500 hover:border-gold/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                data-cursor="view"
              >
                {/* 3:4 portrait aspect */}
                <div className="relative overflow-hidden aspect-[3/4] rounded-none">
                  <ResponsivePicture
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute inset-3 border border-white/0 group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
                </div>

                {/* Card Details */}
                <div className="p-5 bg-[var(--bg-surface)]">
                  <div className="flex flex-col justify-between h-full min-h-[96px]">
                    <div>
                      <h3 className="font-display text-sm font-bold text-[var(--text)] group-hover:text-gold transition-colors duration-300 uppercase tracking-wider">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-[10px] text-[var(--text-muted)] leading-relaxed line-clamp-2">
                        {category.tagline}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                      <span className="font-mono text-[9px] font-bold text-gold uppercase tracking-wider bg-gold/5 border border-gold/10 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] transition-all duration-300 group-hover:border-gold group-hover:bg-gold">
                        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                          <ArrowUpRight className="absolute h-3.5 w-3.5 text-[var(--text-muted)] transition-all duration-500 ease-in-out opacity-100 scale-100 translate-x-0 group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                          <ArrowRight className="absolute h-3.5 w-3.5 text-white opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Gold sweep */}
                  <div className="mt-4 h-[2px] w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
