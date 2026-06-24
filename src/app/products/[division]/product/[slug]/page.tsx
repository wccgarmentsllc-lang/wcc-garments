import { redirect } from 'next/navigation'

import { getProductHref } from '@/lib/category-routing'

export default async function LegacyProductDetailRedirect({
  params,
}: {
  params: Promise<{ division: string; slug: string }>
}) {
  const { division, slug } = await params
  redirect(getProductHref(division, slug))
}
