import ProductDetailPageOriginal, { generateMetadata as generateMetadataOriginal } from '../../../[division]/details/[slug]/page'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  return generateMetadataOriginal({
    params: Promise.resolve({ division: 'garments', slug })
  })
}

export const dynamic = 'force-dynamic'

export default async function GarmentsProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  return <ProductDetailPageOriginal params={Promise.resolve({ division: 'garments', slug })} />
}
