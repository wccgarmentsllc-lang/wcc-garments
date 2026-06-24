'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, Phone, Mail, MessageCircle } from 'lucide-react'

import { ProductCard } from '@/components/products/ProductCard'
import { DIVISIONS, SITE_CONFIG } from '@/lib/constants'

interface ProductDetailClientProps {
  initialProduct: any
  initialRelatedProducts: any[]
  divisionSlug: string
  slug: string
}

export default function ProductDetailClient({
  initialProduct,
  initialRelatedProducts,
  divisionSlug,
  slug,
}: ProductDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [product] = useState<any>(initialProduct)
  const [relatedProducts] = useState<any[]>(initialRelatedProducts)
  const isHouseholdsDivision = divisionSlug === 'households'
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  if (!product) {
    const divisionMeta = DIVISIONS.find((item) => item.slug === divisionSlug)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] pt-20">
        <div className="border border-[var(--border)] bg-[var(--bg-surface)] px-8 py-10 text-center">
          <h1 className="font-display text-2xl text-[var(--text)]">Product Not Found</h1>
          <Link href={`/products/${divisionSlug}`} className="btn-gold mt-5 inline-flex text-[10px]">
            Browse {divisionMeta?.name ?? 'Products'}
          </Link>
        </div>
      </div>
    )
  }

  const specs = product.specifications || {}
  const whatsappText = encodeURIComponent(`Hi, I am interested in: ${product.name}`)
  const images = Array.isArray(product.images) ? product.images : []

  // Dynamic values that handle string (mock data) or object (database schema) shapes
  const divisionName = typeof product.division === 'object' && product.division !== null
    ? product.division.name
    : product.division

  const categoryName = Array.isArray(product.categories) && product.categories.length > 0
    ? product.categories.map((c: any) => typeof c === 'object' && c !== null ? c.name : c).join(', ')
    : (typeof product.category === 'object' && product.category !== null
        ? product.category.name
        : product.category)

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24">
      <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 py-4 sm:py-6 text-[9px] sm:text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]"
        >
          <Link href="/" className="transition-colors hover:text-gold">
            Home
          </Link>
          <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <Link href="/products" className="transition-colors hover:text-gold">
            Products
          </Link>
          <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <Link
            href={`/products/${divisionSlug}`}
            className="transition-colors hover:text-gold"
          >
            {divisionName}
          </Link>
          <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          <span className="text-[var(--text)]">{product.name}</span>
        </nav>

        <div className="border border-[var(--border)] bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_45%),var(--bg-surface)] p-4 sm:p-5 md:p-7 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <motion.section
              className="lg:col-span-6 min-w-0 w-full"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div
                className="relative mx-auto aspect-[1/1] w-full max-w-[640px] overflow-hidden border border-[var(--border)] bg-[var(--bg)]"
                data-cursor="view"
              >
                <Image
                  src={images[activeImage] || images[0] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80'}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />
                {product.is_new && (
                  <span className="absolute left-4 top-4 bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-black">
                    New Arrival
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="relative mx-auto mt-4 w-full max-w-[640px] px-0 sm:px-8 group/carousel">
                  {/* Left Arrow */}
                  {images.length > 5 && (
                    <button
                      onClick={() => scrollThumbnails('left')}
                      className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center border border-[var(--border)] bg-[var(--bg-surface)]/90 backdrop-blur-sm text-[var(--text)] transition-colors hover:border-gold hover:text-gold rounded-none"
                      aria-label="Scroll thumbnails left"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                  )}

                  {/* Scrollable Container */}
                  <div
                    ref={containerRef}
                    className={`flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-1 justify-start ${
                      images.length <= 5 ? 'sm:justify-center' : ''
                    }`}
                  >
                    {images.map((img: string, index: number) => (
                      <button
                        key={`${img}-${index}`}
                        onClick={() => setActiveImage(index)}
                        className={`relative aspect-square w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] shrink-0 overflow-hidden border transition-all ${
                          activeImage === index
                            ? 'border-gold shadow-[0_0_0_1px_rgba(212,175,55,0.35)]'
                            : 'border-[var(--border)] opacity-75 hover:opacity-100'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </button>
                    ))}
                  </div>

                  {/* Right Arrow */}
                  {images.length > 5 && (
                    <button
                      onClick={() => scrollThumbnails('right')}
                      className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center border border-[var(--border)] bg-[var(--bg-surface)]/90 backdrop-blur-sm text-[var(--text)] transition-colors hover:border-gold hover:text-gold rounded-none"
                      aria-label="Scroll thumbnails right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </motion.section>

            <motion.aside
              className="lg:col-span-6 lg:sticky lg:top-28 lg:self-start min-w-0 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
            >
              <span className="inline-flex border border-gold/40 bg-gold/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                {divisionName}
              </span>

              <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-[var(--text)] md:text-4xl">
                {product.name}
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                {product.short_description}
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="border border-[var(--border)] bg-[var(--bg)]/60 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    Category
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--text)]">{categoryName}</p>
                </div>
                <div className="border border-[var(--border)] bg-[var(--bg)]/60 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">MOQ</p>
                  <p className="mt-1 text-sm font-medium text-[var(--text)]">
                    {product.moq || 'On request'}
                  </p>
                </div>
                <div className="border border-[var(--border)] bg-[var(--bg)]/60 px-4 py-3 sm:col-span-2">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                    Lead Time
                  </p>
                  <p className="mt-1 text-sm font-medium text-[var(--text)]">
                    {product.lead_time || 'As per production schedule'}
                  </p>
                </div>
              </div>

              {Object.keys(specs).length > 0 && (
                <div className="mt-7 border border-[var(--border)] bg-[var(--bg)]/45 p-4 sm:p-5">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Specifications
                  </h2>
                  <div className="mt-4 space-y-3">
                    {Object.entries(specs).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-5 border-b border-[var(--border)]/70 pb-3 last:border-none last:pb-0"
                      >
                        <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span className="text-left sm:text-right text-sm text-[var(--text)] font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(product.suitable_for ?? []).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
                    Suitable For
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.suitable_for.map((item: string) => (
                      <span
                        key={item}
                        className="border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text)]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 grid gap-2 grid-cols-3">
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className={`inline-flex items-center justify-center gap-1.5 border border-gold bg-gold px-1.5 py-3 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.12em] transition-colors hover:bg-gold/90 ${
                    isHouseholdsDivision ? 'text-white' : 'text-black'
                  }`}
                >
                  <Phone className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">Call</span>
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.email}?subject=Enquiry: ${product.name}`}
                  className="inline-flex items-center justify-center gap-1.5 border border-[var(--border)] px-1.5 py-3 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[var(--text)] transition-colors hover:border-gold/60 hover:text-gold"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">Email</span>
                </a>
                <a
                  href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 border border-[var(--border)] px-1.5 py-3 text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[var(--text)] transition-colors hover:border-gold/60 hover:text-gold"
                >
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">WhatsApp</span>
                </a>
              </div>
            </motion.aside>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="border-t border-[var(--border)] py-16 lg:py-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gold/90">Related Selection</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--text)] md:text-3xl">
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/products/${divisionSlug}`}
                className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] transition-colors hover:text-gold"
              >
                View All {divisionName}
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((item, index) => (
                <ProductCard
                  key={item.id}
                  product={{
                    ...item,
                    division: typeof item.division === 'object' && item.division !== null ? item.division : { name: item.division, slug: item.division_slug },
                    category: typeof item.category === 'object' && item.category !== null ? item.category : { name: item.category },
                  }}
                  index={index}
                  divisionSlug={divisionSlug}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
