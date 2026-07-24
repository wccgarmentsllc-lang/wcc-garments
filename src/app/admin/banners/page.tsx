'use client'

import { useState, useEffect } from 'react'
import { Sliders } from 'lucide-react'
import { api } from '@/lib/api'
import { BannerCarouselEditor } from '@/app/admin/sections/components/BannerCarouselEditor'
import { DEFAULT_BANNER_CAROUSEL } from '@/app/admin/sections/defaults'
import type { BannerCarouselConfig } from '@/types/banner'

export default function AdminBannersPage() {
  const [data, setData] = useState<BannerCarouselConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadContent = async () => {
      try {
        const token = localStorage.getItem('wcc-admin-token') || ''
        const res = await api.admin.getContent(token, 'banner-carousel')
        if (res?.data) {
          setData(res.data)
        } else {
          setData(DEFAULT_BANNER_CAROUSEL)
        }
      } catch (err) {
        console.error('Failed to fetch banner carousel data:', err)
        setData(DEFAULT_BANNER_CAROUSEL)
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [])

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto font-mono text-neutral-900 dark:text-white">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6 font-sans">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight uppercase">Banner Carousel Manager</h1>
            <span className="bg-gold/10 border border-gold/30 px-3 py-0.5 font-mono text-xs font-bold text-gold rounded-none">
              Hero & Section Banners
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/50">
            Configure homepage top hero banners, promotional slide graphics, badges, auto-play speed, and CTA action links.
          </p>
        </div>
      </div>

      {/* Editor Content */}
      <div className="border border-neutral-200 dark:border-white/10 p-6 lg:p-8 bg-white dark:bg-[#0C0C0C] shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <span className="text-sm font-mono text-gold animate-pulse">Loading Banner Config...</span>
          </div>
        ) : (
          <BannerCarouselEditor initialData={data || DEFAULT_BANNER_CAROUSEL} />
        )}
      </div>
    </div>
  )
}
