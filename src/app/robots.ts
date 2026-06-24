import { MetadataRoute } from 'next'

const BASE_URL = 'https://wccfashions.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // All bots — allow everything except admin/api/private
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/_next/', '/private/'],
      },
      // Googlebot — fastest crawl (no delay)
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // Googlebot-Image — allow product/category images
      {
        userAgent: 'Googlebot-Image',
        allow: ['/images/', '/public/'],
        disallow: ['/admin/'],
      },
      // Bingbot
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
        crawlDelay: 1,
      },
      // Yandex (Russia)
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/admin/', '/api/'],
        crawlDelay: 2,
      },
      // Baiduspider (China)
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: ['/admin/', '/api/'],
        crawlDelay: 2,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
