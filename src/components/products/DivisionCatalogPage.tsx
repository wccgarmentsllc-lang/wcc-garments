import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, ArrowUpRight, ArrowRight } from 'lucide-react'

import { DIVISIONS, MOCK_PRODUCTS, SITE_CONFIG } from '@/lib/constants'
import { getProductHref, resolveDivisionCategorySlug, getDivisionCategoryHref } from '@/lib/category-routing'
import { DivisionProductsClient } from './DivisionProductsClient'
import { getSupabaseServerClient } from '@/lib/supabase'
import { fetchWithFallback } from '@/lib/db-service'

interface DivisionCatalogPageProps {
  divisionSlug: string
  initialCategorySlug?: string | null
  initialBrandSlug?: string | null
}

export async function DivisionCatalogPage({
  divisionSlug,
  initialCategorySlug,
  initialBrandSlug,
}: DivisionCatalogPageProps) {
  const division = DIVISIONS.find((item) => item.slug === divisionSlug)

  if (!division) {
    notFound()
  }

  const isHouseholdsDivision = divisionSlug === 'households'

  const resolvedInitialCategorySlug = resolveDivisionCategorySlug(
    divisionSlug,
    initialCategorySlug
  )

  // Fetch categories dynamically from database
  const dbDivisions = await fetchWithFallback(
    async () => {
      const supabase = getSupabaseServerClient()
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      return data || []
    },
    DIVISIONS,
    'Fetch Categories'
  )

  const dbDivision = dbDivisions.find((item: any) => item.slug === divisionSlug)
  const rawCategories = dbDivision ? (dbDivision.categories || dbDivision.sub_categories || []) : division.categories

  const divisionCategories = rawCategories.map((cat: any) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    status: cat.status || 'active',
    displayOrder: cat.displayOrder || cat.display_order || 1,
    image: cat.image,
    subCategories: (cat.subCategories || cat.sub_categories || []).map((sub: any) => ({
      id: sub.id,
      name: sub.name,
      slug: sub.slug,
      status: sub.status || 'active',
      displayOrder: sub.displayOrder || sub.display_order || 1,
      image: sub.image,
    }))
  }))

  let products = []
  try {
    const supabase = getSupabaseServerClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('division_slug', divisionSlug)
      .order('created_at', { ascending: false })

    if (error) throw error
    if (data) {
      products = data
    }
  } catch (err) {
    console.error("Failed to query DB products for division catalog page:", err)
    products = []
  }

  const otherDivisions = DIVISIONS.filter((item) => item.slug !== divisionSlug)

  const mappedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    images: Array.isArray(product.images) ? product.images : [],
    division: { name: product.division || '', slug: product.division_slug || '' },
    category: {
      name: product.category || '',
      slug: resolveDivisionCategorySlug(divisionSlug, product.category) ?? undefined,
    },
    categories: Array.isArray(product.categories) ? product.categories : [],
    moq: product.moq,
    is_new: product.is_new,
    is_offer: product.is_offer,
    offer_label: product.offer_label,
    short_description: product.short_description,
    brand_slug: product.brand_slug ?? null,
  }))

  const isFiltered = !!initialCategorySlug || !!initialBrandSlug

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.url || 'https://wccfashions.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: `${SITE_CONFIG.url || 'https://wccfashions.com'}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: division.name,
        item: `${SITE_CONFIG.url || 'https://wccfashions.com'}/products/${division.slug}`,
      },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${division.name} Products - WCC Fashions`,
    description: division.metaDescription,
    url: `${SITE_CONFIG.url || 'https://wccfashions.com'}/products/${division.slug}`,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: product.name,
      description: product.short_description,
      url: `${SITE_CONFIG.url || 'https://wccfashions.com'}${getProductHref(division.slug, product.slug)}`,
    })),
  }

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: division.metaTitle,
    description: division.metaDescription,
    url: `${SITE_CONFIG.url || 'https://wccfashions.com'}/products/${division.slug}`,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.fullName,
      url: SITE_CONFIG.url || 'https://wccfashions.com',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      <div className="min-h-screen bg-[var(--bg)]">
        <header className={`border-b border-[var(--border)] bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.09),transparent_40%),var(--bg-surface)] transition-all duration-300 ${
          isFiltered ? 'pt-28 pb-6 md:pt-32 md:pb-8' : 'pt-28 pb-12 md:pt-36 md:pb-16'
        }`}>
          <div className="mx-auto max-w-[1560px] px-6 lg:px-12">
            <nav
              aria-label="Breadcrumb"
              className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]"
            >
              <Link href="/" className="transition-colors hover:text-gold">
                Home
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/products" className="transition-colors hover:text-gold">
                Products
              </Link>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/products/${division.slug}`} className="transition-colors hover:text-gold">
                {division.name}
              </Link>
              {initialCategorySlug && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-gold capitalize">{initialCategorySlug.replace(/-/g, ' ')}</span>
                </>
              )}
              {initialBrandSlug && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-gold capitalize">{initialBrandSlug.replace(/-/g, ' ')}</span>
                </>
              )}
            </nav>

            {!isFiltered && (
              <>
                <div className="mt-8 max-w-4xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold/90">
                    {division.icon} · {division.name} Division
                  </p>
                  <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.1] text-[var(--text)] md:text-5xl lg:text-6xl">
                    {division.heroHeading}
                  </h1>
                  <p className="mt-5 max-w-2xl text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                    {division.heroSubtitle}
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap gap-0 divide-x divide-[var(--border)] border border-[var(--border)] bg-[var(--bg)]/60 backdrop-blur-sm w-fit">
                  <div className="px-5 py-3">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      {division.stat1Label}
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-[var(--text)]">
                      {division.stat1Value}
                    </p>
                  </div>
                  <div className="px-5 py-3">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      {division.stat2Label}
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-[var(--text)]">
                      {division.stat2Value}
                    </p>
                  </div>
                  <div className="px-5 py-3">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      {division.stat3Label}
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-[var(--text)]">
                      {division.stat3Value}
                    </p>
                  </div>
                  <div className="px-5 py-3">
                    <p className="text-[9px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                      Products
                    </p>
                    <p className="mt-0.5 text-base font-semibold text-[var(--text)]">
                      {products.length} Listed
                    </p>
                  </div>
                </div>
              </>
            )}

          </div>
        </header>

        <section className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12 lg:py-16">
          <DivisionProductsClient
            products={mappedProducts}
            categories={divisionCategories}
            divisionSlug={divisionSlug}
            divisionName={division.name}
            initialCategorySlug={resolvedInitialCategorySlug ?? undefined}
            initialBrandSlug={initialBrandSlug ?? undefined}
          />
        </section>

        <section className="border-t border-[var(--border)] bg-[var(--bg-surface)]">
          <div className="mx-auto max-w-[1560px] px-6 py-12 lg:px-12 lg:py-16">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="md:col-span-2 lg:col-span-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/80">
                  Why WCC Garments?
                </p>
                <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-[var(--text)]">
                  Trusted {division.name} Supplier for B2B Buyers Worldwide
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
                  {division.metaDescription}
                </p>
                <Link
                  href={`/contact?division=${divisionSlug}&source=division_catalog`}
                  className={`mt-5 inline-flex items-center gap-2 border border-gold bg-gold px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-gold/90 ${
                    isHouseholdsDivision ? 'text-white' : 'text-black'
                  }`}
                >
                  Request a Quote
                </Link>
              </div>

              <div className="space-y-4 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: 'Custom Branding & Private Label',
                      desc: 'Woven labels, embroidery, heat transfer, custom packaging - all available for qualified bulk orders.',
                    },
                    {
                      title: 'Export-Grade Quality Control',
                      desc: 'Every shipment undergoes multi-stage inspection. AQL-standard batch testing on request.',
                    },
                    {
                      title: 'Fast Turnaround & Lead Times',
                      desc: `Standard lead time: ${division.stat2Value}. Rush orders discussed on production slot availability.`,
                    },
                    {
                      title: 'Global Shipping & Trade Terms',
                      desc: 'FOB Dubai, CIF destination, EXW available. We work with major freight forwarders worldwide.',
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="border border-[var(--border)] bg-[var(--bg)]/60 p-4"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text)]">
                        {item.title}
                      </p>
                      <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--border)]">
          <div className="mx-auto max-w-[1560px] px-6 py-10 lg:px-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Also Browse
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {otherDivisions.map((item) => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className="group flex items-center gap-2 border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2.5 transition-all duration-300 hover:border-gold/40"
                >
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)] transition-colors group-hover:text-gold">
                    {item.icon}
                  </span>
                  <span className="text-xs font-medium text-[var(--text)]">{item.name}</span>
                  <ChevronRight className="h-3 w-3 text-[var(--text-muted)] transition-colors group-hover:text-gold" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
