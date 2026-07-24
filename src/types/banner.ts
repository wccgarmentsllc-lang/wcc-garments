import { ResponsiveImage } from '@/lib/image-utils'

export interface BannerItem {
  id: string
  title: string
  subtitle?: string
  description?: string
  image: string | ResponsiveImage
  badge?: string
  ctaText?: string
  ctaLink?: string
  active: boolean
  displayOrder: number
  theme?: 'dark' | 'light'
}

export interface BannerCarouselConfig {
  enabled: boolean
  autoPlay: boolean
  autoPlayInterval: number
  showIndicators: boolean
  showArrows: boolean
  banners: BannerItem[]
}
