import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{
    brand: string
  }>
}

export default async function GarmentsBrandRedirectPage({ params }: PageProps) {
  const { brand } = await params
  redirect(`/products/garments?brand=${brand}`)
}
