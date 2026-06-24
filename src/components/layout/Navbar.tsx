'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, ChevronDown, Building2, ShieldCheck, Factory, Briefcase, Home, Package, ArrowRight, Award, Clock, Mail, MessageCircle, Globe, Flame, Sparkles, Layers } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { NAV_LINKS, SITE_CONFIG } from '@/lib/constants'
import { contentStore } from '@/lib/content-store'
import { getProductHref } from '@/lib/category-routing'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'
import { api } from '@/lib/api'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const { data: config } = useWebsiteContent('site_config', SITE_CONFIG)
  const pathname = usePathname()

  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileOpen(false)
    setMegaMenuOpen(false)
  }, [pathname])

  // Dynamic Mega Menu Products
  const [garmentsItems, setGarmentsItems] = useState<any[]>([])
  const [householdsItems, setHouseholdsItems] = useState<any[]>([])

  useEffect(() => {
    const fetchMegaMenuProducts = async () => {
      try {
        // Fetch featured garments
        let resGarments = await api.getProducts({ division: 'garments', featured: true, limit: 2 })
        let garmentsList = resGarments.data || []
        // Fallback to latest garments if none are featured
        if (garmentsList.length < 2) {
          const fallbackGarments = await api.getProducts({ division: 'garments', limit: 2 })
          garmentsList = fallbackGarments.data || []
        }
        setGarmentsItems(garmentsList)

        // Fetch featured households/hospitality
        let resHouseholds = await api.getProducts({ division: 'households', featured: true, limit: 1 })
        let householdsList = resHouseholds.data || []
        
        let resHospitality = await api.getProducts({ division: 'hospitality', featured: true, limit: 1 })
        let hospitalityList = resHospitality.data || []

        let combinedHouseholds = [...householdsList, ...hospitalityList]
        if (combinedHouseholds.length < 2) {
          const fallbackHouseholds = await api.getProducts({ division: 'households', limit: 1 })
          const fallbackHospitality = await api.getProducts({ division: 'hospitality', limit: 1 })
          combinedHouseholds = [
            ...(fallbackHouseholds.data || []),
            ...(fallbackHospitality.data || [])
          ]
        }
        setHouseholdsItems(combinedHouseholds.slice(0, 2))
      } catch (err) {
        console.error('Failed to load dynamic mega menu products:', err)
      }
    }
    fetchMegaMenuProducts()
  }, [])

  // Mapping helper from Database Product to Mega-Menu visual spec
  const getMenuProducts = (items: any[], fallbackItems: any[], divisionSlug: string) => {
    if (!items || items.length === 0) return fallbackItems
    return items.map(p => {
      const img = p.images?.[0] || 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80'
      const division_slug = p.division_slug || divisionSlug
      
      let badge = 'Featured'
      let badgeColor = 'text-blue-400 bg-blue-400/10'
      if (p.is_new) {
        badge = 'New Arrival'
        badgeColor = 'text-emerald-400 bg-emerald-400/10'
      } else if (p.is_offer) {
        badge = p.offer_label || 'Special Offer'
        badgeColor = 'text-amber-400 bg-amber-400/10'
      }

      return {
        href: getProductHref(division_slug, p.slug),
        img,
        alt: p.name,
        title: p.name,
        sub: p.short_description || p.description || '',
        moq: `MOQ: ${p.moq || '500 Pcs'}`,
        badge,
        badgeColor
      }
    })
  }

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  if (isAdmin) return null

  const displayFullName = config.fullName === 'WCC Fashions' ? 'Western Clothing Co' : config.fullName

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[999] py-3 transition-all duration-500 bg-white/90 dark:bg-black/90 backdrop-blur-xl ${isScrolled || megaMenuOpen ? 'shadow-2xl' : ''
          }`}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="group relative z-[120] flex items-center gap-3" onClick={() => setMegaMenuOpen(false)}>
            <div className="relative h-11 w-11 overflow-hidden transition-transform duration-500 group-hover:scale-105 sm:h-12 sm:w-12">
              <Image
                src="/images/wcc-logo.png"
                alt="WCC Garments Logo"
                fill
                className="object-contain"
                priority
                sizes="48px"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-poppins font-bold text-black dark:text-white tracking-widest text-[13px]">
                {config.name.toUpperCase()}
              </span>
              <span className="font-poppins text-[7px] font-medium uppercase tracking-[0.40em] text-gold/80">
                {displayFullName}
              </span>
            </div>
          </Link>

          {/* Center Nav Links - Desktop */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const isProducts = link.name.toLowerCase() === 'products'
              return (
                <div
                  key={link.href}
                  className="group relative py-3 cursor-pointer"
                  onMouseEnter={() => isProducts && setMegaMenuOpen(true)}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMegaMenuOpen(false)}
                    className="flex items-center gap-1.5"
                  >
                    <span
                      className={`font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-colors duration-300 ${pathname === link.href || (isProducts && megaMenuOpen)
                          ? 'text-gold font-bold scale-105'
                          : 'text-black/80 dark:text-white/80 group-hover:text-gold'
                        }`}
                    >
                      {link.name}
                    </span>
                    {isProducts && (
                      <ChevronDown className={`h-3.5 w-3.5 text-black/50 dark:text-white/50 transition-transform duration-300 ${megaMenuOpen ? 'rotate-180 text-gold' : 'group-hover:text-gold'}`} />
                    )}
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            <ThemeToggle className="hidden sm:flex" />
            <Link
              href="/contact"
              className="group relative hidden lg:inline-flex items-center gap-2 rounded-full border border-black dark:border-white bg-black dark:bg-white px-6 py-2.5 font-mono text-[10px] font-bold uppercase tracking-widest text-white dark:text-black backdrop-blur-md transition-all hover:bg-[#3b82f6] hover:border-[#3b82f6] hover:text-white hover:shadow-[0_0_25px_rgba(59,130,246,0.4)]"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
            </Link>

            {/* Premium Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="relative z-[120] flex h-11 w-11 items-center justify-center lg:hidden rounded-full border border-neutral-200/50 dark:border-neutral-800/80 bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md shadow-md"
              aria-label="Toggle menu"
            >
              {/* Animated Gold Ring on Open */}
              <motion.span
                className="absolute inset-0 rounded-full border"
                initial={{ borderColor: 'rgba(218,165,32,0)', scale: 1 }}
                animate={isMobileOpen ? { borderColor: 'rgba(218,165,32,0.6)', scale: 1.1 } : { borderColor: 'rgba(218,165,32,0)', scale: 1 }}
                transition={{ duration: 0.4 }}
              />

              {/* 3 Animated Bars */}
              <div className="relative flex flex-col items-center justify-center gap-[5px] w-5 h-5">
                <motion.span
                  className="block h-[1.5px] w-5 bg-black dark:bg-white origin-center"
                  animate={isMobileOpen
                    ? { rotate: 45, y: 6.5, backgroundColor: '#DAA520' }
                    : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                />
                <motion.span
                  className="block h-[1.5px] w-3.5 bg-black dark:bg-white origin-center self-start"
                  animate={isMobileOpen
                    ? { opacity: 0, scaleX: 0 }
                    : { opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-[1.5px] w-5 bg-black dark:bg-white origin-center"
                  animate={isMobileOpen
                    ? { rotate: -45, y: -6.5, backgroundColor: '#DAA520' }
                    : { rotate: 0, y: 0 }
                  }
                  transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Desktop Mega Menu */}
        <AnimatePresence>
          {megaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onMouseLeave={() => setMegaMenuOpen(false)}
              className="absolute left-0 right-0 top-full z-[90] border-b border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-[0_30px_100px_rgba(0,0,0,0.08)] dark:shadow-[0_30px_100px_rgba(0,0,0,0.95)]"
            >
              <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-12">
                <div className="grid gap-10 lg:grid-cols-12">
                  {/* Column 1: Core B2B Divisions */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="border-b border-black/10 dark:border-white/10 pb-3 flex items-center gap-2">
                      <Layers className="h-4 w-4 text-gold shrink-0" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                        Global B2B Divisions
                      </span>
                    </div>
                    <div className="space-y-4 font-sans text-xs">
                      {[
                        { href: '/products/garments', icon: <Factory className="h-4 w-4" />, label: 'Garments Division', desc: 'Premium corporate shirts, twill trousers, and bespoke formalwear manufactured for global B2B export.', color: 'text-gold' },
                        { href: '/products/households', icon: <Package className="h-4 w-4" />, label: 'Households Division', desc: 'Premium triply cookware, elegant cutlery, and artisanal wood serveware in collaboration with Aanya Homecraft.', color: 'text-amber-400' },
                      ].map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMegaMenuOpen(false)}
                          className="group block rounded-none border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 p-5 transition-all hover:bg-gold/10 hover:border-gold/50 flex flex-col justify-between space-y-3 shadow-sm"
                        >
                          <div className="flex items-center gap-3 font-body text-xs font-bold uppercase tracking-wider text-black dark:text-white group-hover:text-gold">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-black border border-black/10 dark:border-white/10 group-hover:border-gold ${item.color}`}>{item.icon}</div>
                            <span>{item.label}</span>
                          </div>
                          <p className="text-black/60 dark:text-white/60 leading-relaxed text-[11px] font-light">{item.desc}</p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Top Selling Garments */}
                  <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-black/10 lg:dark:border-white/10 lg:pl-8">
                    <div className="border-b border-black/10 dark:border-white/10 pb-3 flex items-center gap-2">
                      <Flame className="h-4 w-4 text-gold shrink-0" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                        Top Selling Garments
                      </span>
                    </div>
                    <div className="space-y-4">
                      {getMenuProducts(garmentsItems, [
                        { href: getProductHref('garments', 'egyptian-cotton-premium-shirts'), img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80', alt: 'Premium Shirt', title: 'Egyptian Cotton Shirts', sub: '300TC / Bespoke corporate fits', moq: 'MOQ: 500 Pcs', badge: 'High Demand', badgeColor: 'text-gold bg-gold/10' },
                        { href: getProductHref('garments', 'executive-velvet-blazer'), img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80', alt: 'Velvet Blazer', title: 'Executive Velvet Blazer', sub: 'Italian cotton velvet blazers', moq: 'MOQ: 50 Units', badge: 'Bespoke Cut', badgeColor: 'text-blue-400 bg-blue-400/10' },
                      ], 'garments').map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setMegaMenuOpen(false)} className="group flex items-center gap-4 rounded-none border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 p-3 transition-all hover:border-gold hover:bg-black/[0.05] dark:hover:bg-white/10">
                          {/* Pure White Background Container for Product Image */}
                          <div className="relative h-14 w-14 flex-shrink-0 rounded-none overflow-hidden bg-white border border-neutral-200 p-0.5 shadow-sm">
                            <div className="relative w-full h-full bg-white">
                              <Image src={item.img} alt={item.alt} fill className="object-contain transition-transform group-hover:scale-110" />
                            </div>
                          </div>
                          <div>
                            <h5 className="font-body text-xs font-bold uppercase tracking-wider text-black dark:text-white group-hover:text-gold transition-colors">{item.title}</h5>
                            <p className="text-[10px] text-black/50 dark:text-white/50 font-body mt-0.5">{item.sub}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-mono text-gold font-semibold">{item.moq}</span>
                              <span className={`inline-flex items-center text-[8px] font-body font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Column 3: Top Selling Households */}
                  <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-black/10 lg:dark:border-white/10 lg:pl-8">
                    <div className="border-b border-black/10 dark:border-white/10 pb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-gold shrink-0" />
                      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                        Top Selling Households
                      </span>
                    </div>
                    <div className="space-y-4">
                      {getMenuProducts(householdsItems, [
                        { href: getProductHref('households', 'triply-stainless-steel-casserole'), img: '/images/hh-1.png', alt: 'Triply Casserole', title: 'Triply Casserole', sub: 'Aanya Homecraft premium cookware', moq: 'MOQ: 100 Pcs', badge: 'New Arrival', badgeColor: 'text-emerald-400 bg-emerald-400/10' },
                        { href: getProductHref('hospitality', 'hotel-bed-linen-collection'), img: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80', alt: 'Bedding', title: 'Hotel Bed Linen Collection', sub: '400TC Combed Egyptian Cotton', moq: 'MOQ: 200 Sets', badge: 'Premium Tier', badgeColor: 'text-amber-400 bg-amber-400/10' },
                      ], 'households').map((item) => (
                        <Link key={item.href} href={item.href} onClick={() => setMegaMenuOpen(false)} className="group flex items-center gap-4 rounded-none border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/5 p-3 transition-all hover:border-gold hover:bg-black/[0.05] dark:hover:bg-white/10">
                          {/* Pure White Background Container for Product Image */}
                          <div className="relative h-14 w-14 flex-shrink-0 rounded-none overflow-hidden bg-white border border-neutral-200 p-0.5 shadow-sm">
                            <div className="relative w-full h-full bg-white">
                              <Image src={item.img} alt={item.alt} fill className="object-contain transition-transform group-hover:scale-110" />
                            </div>
                          </div>
                          <div>
                            <h5 className="font-body text-xs font-bold uppercase tracking-wider text-black dark:text-white group-hover:text-gold transition-colors">{item.title}</h5>
                            <p className="text-[10px] text-black/50 dark:text-white/50 font-body mt-0.5">{item.sub}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[9px] font-mono text-gold font-semibold">{item.moq}</span>
                              <span className={`inline-flex items-center text-[8px] font-body font-bold px-1.5 py-0.2 rounded uppercase tracking-wider ${item.badgeColor}`}>
                                {item.badge}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-black/10 dark:border-white/10">
                      <Link href="/products" onClick={() => setMegaMenuOpen(false)} className="group flex items-center justify-between rounded-none bg-gold py-3.5 px-5 font-body text-[10px] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-gold-light shadow-lg">
                        <span>Explore Complete Product Index</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ════════════════════════════════════════════════
          AWARD-LEVEL FLOATING COMPACT GLASS DECK MOBILE MENU
      ════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Theme-aware glass backdrop, clickable to close */}
            <motion.div
              className="fixed inset-0 z-[105] bg-white/45 backdrop-blur-sm dark:bg-black/40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Premium Floating Drawer (takes about 75-80% width, beautifully carded) */}
            <motion.div
              className="fixed top-[76px] right-4 bottom-4 w-[calc(100vw-32px)] max-w-[340px] z-[110] flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text)] shadow-[0_25px_60px_rgba(0,0,0,0.18)] backdrop-blur-[30px] dark:shadow-[0_25px_60px_rgba(0,0,0,0.85)] lg:hidden"
              initial={{ x: '110%', opacity: 0, scale: 0.95 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: '110%', opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            >
              {/* Premium texture & glows inside drawer */}
              <div
                className="pointer-events-none absolute inset-0 z-0 opacity-[0.025] dark:hidden"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.7) 2px, rgba(0,0,0,0.7) 3px)',
                  backgroundSize: '100% 4px',
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 z-0 hidden opacity-[0.03] dark:block"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.8) 2px, rgba(255,255,255,0.8) 3px)',
                  backgroundSize: '100% 4px',
                }}
              />
              <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-30"
                style={{ background: 'radial-gradient(circle, rgba(218,165,32,0.4) 0%, transparent 70%)' }}
              />

              {/* Title Section inside drawer */}
              <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[9px] font-bold text-gold uppercase tracking-[0.25em]">{displayFullName}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-wider text-[var(--text-muted)]">
                  <Globe className="h-3 w-3 text-gold" />
                  <span>HQ Dubai</span>
                </div>
              </div>

              {/* Staggered Navigation Items */}
              <div className="relative z-10 flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
                <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-6">Directory</p>

                <div className="space-y-1">
                  {NAV_LINKS.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        className="group relative flex items-center justify-between py-3.5"
                      >
                        <div className="flex items-baseline gap-3">
                          <span className="font-mono text-[10px] font-bold text-[var(--text-muted)] opacity-60 transition-colors group-hover:text-gold group-hover:opacity-100">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className={`font-display text-xl font-bold tracking-tight transition-all duration-300 group-hover:text-gold ${
                              pathname === link.href ? 'text-gold' : 'text-[var(--text)]'
                            }`}
                          >
                            {link.name}
                          </span>
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[var(--text-muted)] opacity-45 transition-all duration-300 group-hover:rotate-12 group-hover:text-gold group-hover:opacity-100" />
                      </Link>
                      <div className="h-[1px] bg-[var(--border)]" />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Bottom Quick Contact Panel */}
              <div className="relative z-10 p-5 bg-black/[0.03] border-t border-[var(--border)] rounded-b-3xl dark:bg-black/40">
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href={`mailto:${config.email}`}
                    className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-2.5 transition-all duration-300 hover:border-gold/40 hover:bg-gold/5"
                  >
                    <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
                    <div className="min-w-0">
                      <p className="font-mono text-[7px] uppercase tracking-wider text-[var(--text-muted)]">Email</p>
                      <p className="font-mono text-[8px] font-bold text-[var(--text)] truncate">{config.email}</p>
                    </div>
                  </a>
                  <a
                    href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-2.5 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/5"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-mono text-[7px] uppercase tracking-wider text-[var(--text-muted)]">WhatsApp</p>
                      <p className="font-mono text-[8px] font-bold text-[var(--text)]">Direct Line</p>
                    </div>
                  </a>
                </div>

                <div className="mt-4 flex items-center justify-between text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-widest">
                  <span>© 2026 {config.fullName}</span>
                  <ThemeToggle />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
