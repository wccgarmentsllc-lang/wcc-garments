'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ArrowRight } from 'lucide-react'
import { getProductHref } from '@/lib/category-routing'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    images: string[]
    division?: { name: string; slug: string } | null
    category?: { name: string } | null
    categories?: { name: string }[] | null
    moq: string | null
    is_new: boolean
    is_offer: boolean
    offer_label: string | null
    short_description?: string | null
    brand_slug?: string | null
  }
  index?: number
  coverColor?: string
  /** Division slug for building /products/[division]/details/[slug] URLs */
  divisionSlug?: string
}

export function ProductCard({ product, index = 0, coverColor = '#ffffff', divisionSlug }: ProductCardProps) {
  const effectiveDivision = divisionSlug || product.division?.slug || 'products'
  const [hovered, setHovered] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const containerRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
        }
      },
      { threshold: 0.15 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group flex w-full flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={getProductHref(effectiveDivision, product.slug)}
        className="relative mx-auto block w-full max-w-[420px] overflow-hidden border border-[var(--border)] bg-white"
        style={{ aspectRatio: '1/1', background: coverColor }}
        ref={containerRef}
      >
        {/* Product Image */}
        <motion.div
          animate={{ scale: hovered ? 1.01 : 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 h-full w-full bg-white"
        >
          {/* Primary Image */}
          <Image
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=85'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />

          {/* Secondary Image on Hover */}
          {product.images && product.images.length > 1 && (
            <div className="absolute inset-0 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out">
              <Image
                src={product.images[1]}
                alt={`${product.name} secondary`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            </div>
          )}
        </motion.div>

        {/* Cinematic Shutter Reveal Cover */}
        <motion.div
          initial={{ y: '0%' }}
          animate={{ y: revealed ? '-102%' : '0%' }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1], delay: index * 0.04 }}
          className="absolute inset-0 z-10 origin-top pointer-events-none"
          style={{ background: coverColor }}
        />

        {/* Editorial Badges */}
        <div className="pointer-events-none absolute left-4 top-4 z-20 flex flex-col gap-2">
          {product.is_new && (
            <span className="bg-[#0A0A0A]/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
              NEW
            </span>
          )}
          {product.is_offer && (
            <span className="bg-[#8B1A1A]/90 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-white">
              {product.offer_label || 'OFFER'}
            </span>
          )}
        </div>

        {/* Slide-up "ENQUIRE NOW" Shutter Overlay on Hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2 bg-[#0A0A0A]/90 py-4 text-white backdrop-blur-sm"
            >
              <FileText size={11} strokeWidth={1.5} />
              <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-white">
                REQUEST DETAILS
              </span>
              <ArrowRight size={10} className="text-white/70 ml-0.5" />
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Editorial Typographic Info */}
      <div className="mt-4 px-1">
        <div className="flex items-center justify-between gap-2">
          <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-gold/90">
            {product.division?.name || 'WCC DIVISION'}
          </span>
          {product.brand_slug && (
            <span className={`px-2 py-0.5 text-[8px] font-mono font-bold tracking-[0.15em] uppercase border ${
              product.brand_slug === 'treasure'
                ? 'border-gold text-gold bg-gold/5'
                : product.brand_slug === 'vandegraff'
                ? 'border-[#8B1A1A] text-[#8B1A1A] dark:text-red-400 bg-[#8B1A1A]/5'
                : product.brand_slug === 'tom-jack'
                ? 'border-amber-500/30 text-amber-500 bg-amber-500/5'
                : 'border-[var(--border)] text-[var(--text-muted)] bg-[var(--bg)]'
            }`}>
              {product.brand_slug === 'tom-jack' ? 'TOM & JACK' : product.brand_slug.toUpperCase()}
            </span>
          )}
        </div>

        <h3 className="mt-2 text-base font-semibold leading-snug text-[var(--text)] transition-colors duration-300 md:text-lg">
          {product.name}
        </h3>

        {product.short_description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-muted)]">
            {product.short_description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
          <span className="text-sm text-[var(--text-muted)] line-clamp-1 pr-2">
            {product.categories && product.categories.length > 0 ? product.categories.map((c: any) => c.name).join(', ') : (product.category?.name || 'Textile')}
          </span>
          {product.moq && (
            <span className="border border-[var(--border)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
              MOQ {product.moq}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
