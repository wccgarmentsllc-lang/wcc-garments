import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    brand: string
    legacyBrand: string
  }>
}

export default async function LegacyGarmentsBrandSegmentPage({ params }: PageProps) {
  const { legacyBrand } = await params
  redirect(`/products/garments?brand=${legacyBrand}`)
}
