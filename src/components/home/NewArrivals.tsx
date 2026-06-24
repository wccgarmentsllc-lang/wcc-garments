'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowUpRight, MessageCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { ProductCard } from '@/components/products/ProductCard'
import { brandStore } from '@/lib/brand-store'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'
import { useProducts } from '@/hooks/useProducts'

const CATEGORIES = ['All', 'Garments', 'Households', 'Hospitality', 'Uniforms', 'Home', 'Fragrance']

export function NewArrivals() {
  const [activeTab, setActiveTab] = useState('Garments')
  const gridRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<any[]>([])
  const { data: config } = useWebsiteContent('site_config', { whatsapp: '+971 XX XXX XXXX' })

  const { products: rawProducts } = useProducts({
    division: activeTab === 'All' ? undefined : activeTab.toLowerCase(),
    limit: 100
  })

  useEffect(() => {
    const filtered = rawProducts.filter((p) => {
      if (activeTab === 'All') return p.is_new || p.featured
      return true
    }).slice(0, 8)
    setProducts(filtered)
  }, [rawProducts, activeTab])

  const handleTabChange = (cat: string) => {
    setActiveTab(cat)
    setTimeout(() => {
      if (gridRef.current) {
        const yOffset = -100 // Ample clearance below fixed navbar
        const element = gridRef.current
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset
        window.scrollTo({ top: y, behavior: 'smooth' })
      }
    }, 50)
  }

  const whatsappBase = config.whatsapp ? config.whatsapp.replace(/[^0-9]/g, '') : ''

  return (
    <section className="bg-[var(--bg)] py-20" data-cursor="view">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="flex flex-col gap-8 justify-between lg:flex-row lg:items-center lg:gap-20">
          <div className="max-w-xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              Curated Production
            </span>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl lg:text-6xl">
              Latest <span className="text-gold">releases</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
              B2B-only product launches for wholesale buyers. No public pricing; enquire based on MOQ, lead time, and customization scope.
            </p>
          </div>

          <div className="hidden sm:flex flex-wrap items-center justify-center lg:justify-end gap-5">
            <Link
              href="/contact?source=new-arrivals&intent=request-quote&businessType=Wholesale%20Distributor"
              className="group inline-flex items-center gap-2 border border-gold  px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-gold whitespace-nowrap hover:text-white"
            >
              Request Bulk Quote
              <span className="relative flex h-4 w-4 items-center justify-center">
                <ArrowUpRight className="absolute h-4 w-4 transition-all duration-500 ease-in-out opacity-100 scale-100 translate-x-0 group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                <ArrowRight className="absolute h-4 w-4 opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
              </span>
            </Link>
            <a
              href={`https://wa.me/${whatsappBase}?text=${encodeURIComponent('Hi WCC Garments, I need a quote for your new arrivals. Please share MOQ, lead times, and available customization options.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[var(--border)] bg-[var(--bg-surface)] bg-green-500 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-all hover:border-green-100 hover:text-white whitespace-nowrap"
            >
              Enquire On WhatsApp 
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Filter Tabs - Swipable on mobile, centered on desktop */}
        <div className="hidden sm:block mt-16 w-full">
          <div className="flex w-full overflow-x-auto pb-4 lg:justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="inline-flex min-w-max items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-surface)] p-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleTabChange(cat)}
                  className={`relative shrink-0 rounded-full px-6 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-colors duration-300 ${
                    activeTab === cat
                      ? 'text-white font-bold'
                      : 'text-[var(--text-muted)] hover:bg-blue-100 hover:text-black'
                  }`}
                >
                  <span className="relative z-10">{cat}</span>
                  {activeTab === cat && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 rounded-full bg-gold "
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Perfectly Aligned 4-Column Card Grid */}
        <div className="mt-12 min-h-[500px]" ref={gridRef}>
          {products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center border border-[var(--border)] bg-[var(--bg-surface)] py-24 px-6 text-center max-w-4xl mx-auto"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10 text-gold mb-6 border border-gold/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text)]">
                Bespoke {activeTab} Manufacturing
              </h3>
              <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-[var(--text-muted)]">
                Our ready B2B catalog for this division is currently being compiled. However, we offer complete private-label manufacturing and bulk supply for all products in the {activeTab} division.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link
                  href={`/contact?source=empty-category-${activeTab.toLowerCase()}&intent=custom-quote`}
                  className="group inline-flex items-center gap-2 border border-gold px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-white"
                >
                  Request Custom Quote
                </Link>
                <a
                  href={`https://wa.me/${whatsappBase}?text=${encodeURIComponent(`Hi WCC Garments team, I would like to query custom B2B manufacturing and bulk pricing for ${activeTab} items.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-green-500 bg-green-500 hover:bg-green-600 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-all"
                >
                  WhatsApp Production Desk
                </a>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 md:gap-x-6 md:gap-y-10">
                <AnimatePresence mode="popLayout">
                  {products.map((product, idx) => {
                    // Adapt MOCK_PRODUCTS fields to match ProductCard expects
                    const formattedProduct = {
                      ...product,
                      division: { name: product.division?.name || '', slug: product.division?.slug || '' },
                      category: { name: product.category?.name || '' }
                    };

                    return (
                      <ProductCard
                        key={product.id}
                        product={formattedProduct}
                        index={idx}
                      />
                    )
                  })}
                </AnimatePresence>
              </div>

              {/* View All text link */}
              <div className="mt-10 flex justify-center">
                <Link
                  href={
                    activeTab === 'All'          ? '/products' :
                    activeTab === 'Garments'     ? '/products/garments' :
                    activeTab === 'Uniforms'     ? '/products/uniforms' :
                    activeTab === 'Hospitality'  ? '/products/hospitality' :
                    activeTab === 'Home'         ? '/products/home' :
                    activeTab === 'Fragrance'    ? '/products/fragrance' :
                    activeTab === 'Households'   ? '/products/households' :
                    '/products'
                  }
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-muted)] transition-colors duration-200 hover:text-gold"
                >
                  View All {activeTab === 'All' ? 'Products' : activeTab}
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <ArrowUpRight className="absolute h-4 w-4 transition-all duration-500 ease-in-out opacity-100 scale-100 translate-x-0 group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                    <ArrowRight className="absolute h-4 w-4 opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
