import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/context/ThemeContext'
import { CategoriesProvider } from '@/context/CategoriesContext'
import { SmoothScroll } from '@/components/ui/SmoothScroll'
import { GrainOverlay } from '@/components/ui/GrainOverlay'
import { PreLoader } from '@/components/ui/PreLoader'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SITE_CONFIG } from '@/lib/constants'
import '@/app/globals.css'

const BASE_URL = 'https://wccfashions.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  verification: {
    google: '1IcHEmg7YDLx4mWw-yXS6isIQcUqMJsmpxzM-JvSslo',
  },
  icons: {
    icon: '/images/wcc-logo-email.png',
    shortcut: '/images/wcc-logo-email.png',
    apple: '/images/wcc-logo-email.png',
  },

  title: {
    default: 'WCC Fashions LLC — Best Garments Wholesale Team & B2B Textile Manufacturer in Dubai, UAE',
    template: `%s | WCC Fashions — UAE B2B Textile Manufacturing`,
  },

  description:
    'WCC Fashions LLC (formerly WCC Garments) is the best garments wholesale team and premier B2B textile manufacturer in Dubai, UAE. Wholesale clothing, uniforms, hospitality linen, and home furnishings. MOQ from 50 units. Exporting to 50+ countries.',

  keywords: [
    // Brand & Target Target Keywords
    'best garments wholesale team', 'best garments wholesale team Dubai', 'best garments wholesale team UAE',
    'best B2B garment supplier UAE', 'WCC Garments', 'WCC Fashions LLC',
    // UAE / Local
    'wholesale garments UAE', 'textile manufacturer Dubai', 'B2B garment supplier Dubai',
    'bulk clothing manufacturer UAE', 'garment factory Dubai', 'wholesale clothing supplier UAE',
    'Dubai textile exporter',
    // Garments
    'wholesale shirts Dubai', 'bulk jeans manufacturer UAE', 'corporate uniform supplier Dubai',
    'wholesale polo shirts UAE', 'formal shirts wholesale Dubai', 'blazer manufacturer UAE',
    // Hospitality
    'hotel linen supplier Dubai', 'hotel bedding manufacturer UAE', 'hospitality textile supplier Dubai',
    'restaurant linen UAE', 'hotel towel supplier Dubai', 'bulk bed sheets UAE', 'Horeca24h UAE',
    // Uniforms
    'uniform manufacturer Dubai', 'corporate workwear supplier UAE', 'chef uniform Dubai',
    'security uniform manufacturer UAE', 'hospital uniform supplier Dubai',
    // Home / Households
    'home textile manufacturer Dubai', 'bedsheet manufacturer UAE', 'wholesale home linen Dubai',
    'kitchen supplies wholesale Dubai', 'bulk household products UAE', 'triply cookware wholesale UAE',
    // International / B2B
    'B2B textile manufacturer', 'wholesale garment exporter', 'bulk clothing supplier',
    'garment manufacturing company', 'textile export company', 'OEM garment manufacturer',
    'private label clothing manufacturer',
    // Long-tail conversions
    'Egyptian cotton shirts 500 MOQ', 'hotel bedding 300 thread count supplier',
    'custom branded uniforms manufacturer Dubai', 'wholesale denim jeans bulk order',
    'export quality garments UAE',
    // GCC
    'textile manufacturer GCC', 'garment supplier Saudi Arabia', 'wholesale clothing Kuwait',
    'bulk supplier Middle East',
    // Africa
    'garment exporter to Africa', 'textile supplier Nigeria', 'wholesale clothing Kenya',
    // Fragrance
    'wholesale perfume manufacturer UAE', 'oud fragrance supplier Dubai', 'private label perfume UAE',
    // Trust
    'WCC Fashions', 'Western Clothing Company UAE', 'Aanya Homecraft', 'Horeca24h',
  ],

  authors: [{ name: 'WCC Fashions LLC', url: BASE_URL }],
  creator: 'WCC Fashions LLC',
  publisher: 'WCC Fashions LLC',

  formatDetection: { email: false, address: false, telephone: false },

  openGraph: {
    type: 'website',
    locale: 'en_AE',
    alternateLocale: ['ar_AE', 'en_US', 'en_GB'],
    url: BASE_URL,
    siteName: 'WCC Fashions LLC',
    title: 'WCC Fashions — Leading B2B Textile Manufacturer in UAE',
    description:
      'Premier wholesale garment, uniform, and hotel linen manufacturer in Dubai. Export-quality production. 50+ countries served. MOQ from 50 units.',
    images: [
      {
        url: '/og-image-main.jpg',
        width: 1200,
        height: 630,
        alt: 'WCC Fashions — UAE B2B Textile Manufacturing',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'WCC Fashions — B2B Textile Manufacturer UAE',
    description:
      'Wholesale garments, uniforms, hotel linen & household products. Dubai-based. Export to 50+ countries.',
    images: ['/og-image-main.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: BASE_URL,
    languages: {
      'en-AE': BASE_URL,
      'en-US': BASE_URL,
      'en-GB': BASE_URL,
    },
  },

  category: 'Business & Industrial',

  other: {
    // Geo tags — critical for UAE local SEO
    'geo.region': 'AE-DU',
    'geo.placename': 'Dubai, United Arab Emirates',
    'geo.position': '25.2048;55.2708',
    'ICBM': '25.2048, 55.2708',
    // Dublin Core — helps knowledge graph
    'DC.title': 'WCC Fashions LLC — B2B Textile Manufacturer Dubai',
    'DC.creator': 'WCC Fashions LLC',
    'DC.subject': 'Textile Manufacturing, Wholesale Garments, B2B Clothing, Hotel Linen, Uniforms',
    'DC.description': 'Leading B2B textile and garment manufacturer in Dubai, UAE. Established 2001.',
    'DC.language': 'en-AE',
    // Contact meta
    'contact:country_name': 'United Arab Emirates',
    'contact:region': 'Dubai',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // ── Organization Schema — triggers Google Knowledge Panel ──
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'WCC Fashions LLC',
    legalName: 'Western Clothing Company Fashions LLC',
    alternateName: ['WCC Garments', 'Western Clothing Company', 'WCC Fashions'],
    url: BASE_URL,
    logo: `${BASE_URL}/images/wcc-logo.png`,
    image: `${BASE_URL}/images/wcc-logo.png`,
    email: SITE_CONFIG.email,
    telephone: SITE_CONFIG.phone,
    foundingDate: SITE_CONFIG.founded,
    description:
      'B2B manufacturing and wholesale supplier for garments, uniforms, hospitality textiles, home furnishings, fragrance, and household products. Export to 50+ countries from Dubai, UAE.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Deira Wholesale Textile District',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      postalCode: '00000',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.2048,
      longitude: 55.2708,
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.phone,
        contactType: 'sales',
        email: SITE_CONFIG.email,
        areaServed: ['AE', 'SA', 'KW', 'BH', 'QA', 'OM', 'NG', 'KE', 'ZA', 'IN'],
        availableLanguage: ['en', 'ar'],
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/wcc-fashions',
      'https://www.facebook.com/wccfashions',
      'https://www.instagram.com/wccfashions',
    ],
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: 25.2048, longitude: 55.2708 },
      geoRadius: '20000km',
    },
    makesOffer: [
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Wholesale Garments', description: 'Bulk garment manufacturing and supply' },
        eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Hotel Linen & Hospitality Textiles', description: 'Commercial-grade hotel bedding and linen' },
        eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
      },
      {
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: 'Uniforms & Workwear', description: 'Custom uniforms for corporate, hospitality, and industrial sectors' },
        eligibleCustomerType: 'http://purl.org/goodrelations/v1#Business',
      },
    ],
    knowsAbout: [
      'Textile Manufacturing', 'Garment Production', 'Wholesale Clothing',
      'Hotel Linen Supply', 'Uniform Manufacturing', 'B2B Textile Export',
      'Fragrance Manufacturing', 'Household Products Wholesale',
    ],
    slogan: 'Precision in Every Stitch',
  }

  // ── Website Schema — enables sitelinks search box ──
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: 'WCC Fashions',
    url: BASE_URL,
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en-AE',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // ── LocalBusiness Schema — UAE local SEO dominance ──
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: 'WCC Fashions LLC',
    logo: `${BASE_URL}/images/wcc-logo.png`,
    image: `${BASE_URL}/images/wcc-logo.png`,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Deira Wholesale Textile District',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      postalCode: '00000',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 25.2048,
      longitude: 55.2708,
    },
    url: BASE_URL,
    priceRange: '$$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
  }

  return (
    <html lang="en-AE" suppressHydrationWarning>
      <head>
        {/* Preconnect for performance — reduces TTFB */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* hreflang — multi-region signal */}
        <link rel="alternate" hrefLang="en-ae" href={BASE_URL} />
        <link rel="alternate" hrefLang="en" href={BASE_URL} />
        <link rel="alternate" hrefLang="x-default" href={BASE_URL} />

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const saved = localStorage.getItem('wcc-theme');
                  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  const theme = saved || preferred;
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  // Bypass intro animation immediately for return visitors
                  if (sessionStorage.getItem('wcc-has-seen-intro')) {
                    document.documentElement.classList.add('preloader-done');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-body" suppressHydrationWarning>
        {/* JSON-LD Schemas */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
        <PreLoader />
        <ThemeProvider>
          <CategoriesProvider>
            <SmoothScroll>
              <div id="root-content">
                <GrainOverlay />
                <Navbar />
                <main>{children}</main>
                <Footer />
              </div>
            </SmoothScroll>
          </CategoriesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
