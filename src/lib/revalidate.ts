import { revalidatePath } from 'next/cache'

/**
 * Revalidates all public-facing pages that display admin-managed content.
 * Call this after any admin mutation (content, products, categories, brands).
 * This instantly flushes Vercel's edge CDN cache — no redeploy needed.
 */
export function revalidateAllPublicPages() {
  const publicPaths = [
    '/',
    '/about',
    '/contact',
    '/products/garments',
    '/products/households',
    '/products/hospitality',
    '/products/uniforms',
    '/products/home',
    '/products/fragrance',
  ]

  for (const path of publicPaths) {
    revalidatePath(path)
  }

  // Also revalidate the dynamic product detail and division pages
  revalidatePath('/products/[division]', 'page')
  revalidatePath('/products/[division]/details/[slug]', 'page')
  revalidatePath('/products/[division]/category/[category]', 'page')
}
