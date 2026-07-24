import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { DIVISIONS, MOCK_PRODUCTS, SITE_CONFIG } from '@/lib/constants'
import { DivisionCard } from '@/components/products/DivisionCard'

export const metadata: Metadata = {
  title: 'All Product Divisions | Wholesale Garments, Uniforms, Hospitality & More',
  description:
    'Browse all WCC Garments product divisions — garments, workwear uniforms, hospitality textiles, home linen, fragrance, and household products. B2B bulk supply from Dubai, UAE.',
  keywords: [
    'wholesale garments UAE',
    'B2B garment manufacturer Dubai',
    'uniform supplier UAE',
    'hospitality textiles wholesale',
    'home linen bulk order Dubai',
    'fragrance manufacturer UAE',
    'household products wholesale',
    'WCC Garments product catalogue',
    'bulk clothing manufacturer Middle East',
  ],
  openGraph: {
    title: 'Product Catalogue | WCC Garments — UAE B2B Manufacturer',
    description:
      'Explore WCC Garments complete B2B product catalogue across 6 divisions. Bulk supply from Dubai for global buyers.',
    type: 'website',
    url: `${SITE_CONFIG.url}/products`,
  },
  alternates: {
    canonical: `${SITE_CONFIG.url}/products`,
  },
}

export const dynamic = 'force-dynamic'

export default async function ProductsHubPage() {
  // Count products per division
  const countByDivision = (slug: string) =>
    MOCK_PRODUCTS.filter((p) => p.division_slug === slug).length

  let divisions = DIVISIONS
  try {
    const { getSupabaseServerClient, isSupabaseConfigured } = await import('@/lib/supabase')
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseServerClient()
      const { data } = await supabase
        .from('categories')
        .select('*')
      if (data && data.length > 0) {
        const staticMap = Object.fromEntries(
          DIVISIONS.map((d, index) => [d.slug, { icon: d.icon, index }])
        )

        divisions = data.map((d: any) => ({
          ...d,
          icon: staticMap[d.slug]?.icon || d.icon,
          stat1Label: d.stat1_label || d.stat1Label,
          stat1Value: d.stat1_value || d.stat1Value,
          stat2Label: d.stat2_label || d.stat2Label,
          stat2Value: d.stat2_value || d.stat2Value,
          stat3Label: d.stat3_label || d.stat3Label,
          stat3Value: d.stat3_value || d.stat3Value,
          heroHeading: d.hero_heading || d.heroHeading,
          heroSubtitle: d.hero_subtitle || d.heroSubtitle,
        }))

        // Sort by the order in constants.ts
        divisions.sort((a, b) => {
          const idxA = staticMap[a.slug]?.index ?? 99
          const idxB = staticMap[b.slug]?.index ?? 99
          return idxA - idxB
        })
      }
    }
  } catch (err) {
    console.error('Failed to fetch divisions for products hub:', err)
  }

  // For JSON-LD ItemList — all divisions
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_CONFIG.url || 'https://wccfashions.com' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_CONFIG.url || 'https://wccfashions.com'}/products` },
    ],
  }

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'WCC Fashions — Product Catalogue',
    description:
      'Complete B2B product catalogue from WCC Fashions, Dubai UAE. 6 divisions covering garments, uniforms, hospitality textiles, home linen, fragrance and household products.',
    url: `${SITE_CONFIG.url || 'https://wccfashions.com'}/products`,
    hasPart: divisions.map((div) => ({
      '@type': 'CollectionPage',
      name: `${div.name} — WCC Fashions`,
      url: `${SITE_CONFIG.url || 'https://wccfashions.com'}/products/${div.slug}`,
      description: div.metaDescription || (div as any).meta_description,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="min-h-screen bg-[var(--bg)]">
        {/* ── Hero ── */}
        <header className="bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.09),transparent_40%),var(--bg-surface)] py-28 md:py-28">
          <div className="mx-auto max-w-[1560px] px-6 lg:px-12">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]"
            >
              <Link href="/" className="transition-colors hover:text-gold">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-[var(--text)]">Products</span>
            </nav>

            <div className="mt-8 max-w-4xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/90">
                Global Product Catalogue
              </p>
              <h1 className="mt-4 font-display text-3xl font-semibold leading-[1.1] text-[var(--text)] md:text-4xl lg:text-5xl">
                Precision-Made Products
                <br />
                <span className="text-gold">for Modern Enterprises</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                Explore our complete portfolio across six product divisions — built for large-scale B2B buyers in
                hospitality, retail, corporate, and industrial sectors across 50+ countries.
              </p>
            </div>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 border border-[var(--border)] bg-[var(--bg)]/60 backdrop-blur-sm w-full sm:w-fit">
              {[
                { label: 'Divisions', value: '6' },
                { label: 'Products', value: `${MOCK_PRODUCTS.length}+` },
                { label: 'Countries Served', value: SITE_CONFIG.countries },
                { label: 'Years Active', value: SITE_CONFIG.years },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-4 sm:px-5 py-3 text-center sm:text-left ${
                    i % 2 === 0 ? 'border-r border-[var(--border)]' : ''
                  } ${
                    i < 2 ? 'border-b sm:border-b-0 border-[var(--border)]' : ''
                  } ${
                    i < 3 ? 'sm:border-r sm:border-[var(--border)]' : ''
                  }`}
                >
                  <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                  <p className="mt-0.5 text-base font-semibold text-[var(--text)]">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* ── Division Grid ── */}
        <section className="mx-auto max-w-[1560px] px-6 lg:px-12">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/80 mb-5">
                Browse by Division
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--text)] md:text-3xl">
                Select a Product <span className='text-gold'>Category</span> 
              </h2>
            </div>
            <p className="hidden text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] md:block">
              {DIVISIONS.length} Divisions · {MOCK_PRODUCTS.length} Products
            </p>
          </div>

          {/* Editorial masonry-style grid */}
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {divisions.map((div, i) => (
              <DivisionCard
                key={div.slug}
                division={div}
                productCount={countByDivision(div.slug)}
                index={i}
                variant="small"
              />
            ))}
          </div>
        </section>

        {/* ── B2B Trust Strip ── */}
        <section className="py-10">
          <div className="mx-auto max-w-[1560px] px-6 py-10 lg:px-12 bg-[var(--bg-surface)] ">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Quote-Based Pricing', desc: 'No public pricing. MOQ-tiered quotes provided within 24 hrs.' },
                { label: 'Export-Grade QC', desc: 'Every batch passes multi-stage quality inspection before dispatch.' },
                { label: 'Custom Branding', desc: 'Private label, woven labels, embroidery and packaging available.' },
                { label: 'Global Logistics', desc: 'We ship to 50+ countries — CIF, FOB, EXW terms available.' },
              ].map((item) => (
                <div key={item.label} className="border-l-2 border-gold/30 pl-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text)]">
                    {item.label}
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--text-muted)]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
