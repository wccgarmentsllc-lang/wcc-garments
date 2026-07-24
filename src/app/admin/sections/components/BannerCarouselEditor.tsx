'use client'

import { useState } from 'react'
import { 
  Sliders, Save, Loader2, CheckCircle2, ToggleLeft, ToggleRight, 
  Plus, Trash2, Edit3, ArrowUp, ArrowDown, Image as ImageIcon,
  Eye, EyeOff, Sparkles, Settings
} from 'lucide-react'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import { ResponsiveImageUploader } from '@/components/admin/ResponsiveImageUploader'
import type { BannerCarouselConfig, BannerItem } from '@/types/banner'

interface Props {
  initialData: BannerCarouselConfig
}

export function BannerCarouselEditor({ initialData }: Props) {
  const [config, setConfig] = useState<BannerCarouselConfig>(initialData)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null)
  const [isNew, setIsNew] = useState(false)

  const { isDark } = useThemeContext()

  const themeText = isDark ? 'text-white' : 'text-gray-900'
  const themeTextSub = isDark ? 'text-white/50' : 'text-gray-500'
  const themeBorder = isDark ? 'border-white/10' : 'border-gray-200'
  const themeBorderSub = isDark ? 'border-white/5' : 'border-gray-100'

  const inputClass = `w-full rounded-none border px-4 py-2.5 text-xs transition-all font-mono focus:border-gold focus:outline-none ${
    isDark 
      ? 'border-white/10 bg-black/60 text-white placeholder-white/20 focus:bg-black' 
      : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:bg-gray-50'
  }`
  const labelClass = `mb-1.5 block text-[10px] font-bold uppercase tracking-wider font-mono ${
    isDark ? 'text-white/50' : 'text-gray-500'
  }`

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      const token = localStorage.getItem('wcc-admin-token') || ''
      await api.admin.updateContent(token, 'banner-carousel', config as any)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save Banner Carousel settings', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCreateNew = () => {
    const newSlide: BannerItem = {
      id: `banner-${Date.now()}`,
      title: 'NEW PROMOTIONAL BANNER',
      subtitle: 'SUBTITLE / CAMPAIGN HIGHLIGHT',
      description: 'Add detailed description text here for your new promotional banner slide.',
      badge: 'NEW ARRIVAL',
      ctaText: 'SHOP NOW',
      ctaLink: '/products/garments',
      image: {
        desktop: '/images/products/egyptian_cotton_shirt.png',
        mobile: '/images/products/egyptian_cotton_shirt.png',
      },
      active: true,
      displayOrder: (config.banners?.length || 0) + 1,
    }
    setEditingBanner(newSlide)
    setIsNew(true)
  }

  const handleSaveBannerModal = () => {
    if (!editingBanner) return
    const banners = [...(config.banners || [])]
    if (isNew) {
      banners.push(editingBanner)
    } else {
      const index = banners.findIndex((b) => b.id === editingBanner.id)
      if (index !== -1) {
        banners[index] = editingBanner
      } else {
        banners.push(editingBanner)
      }
    }
    setConfig({ ...config, banners })
    setEditingBanner(null)
    setIsNew(false)
  }

  const handleDeleteBanner = (id: string) => {
    if (confirm('Are you sure you want to delete this banner image?')) {
      const banners = config.banners.filter((b) => b.id !== id)
      setConfig({ ...config, banners })
    }
  }

  const handleToggleActive = (id: string) => {
    const banners = config.banners.map((b) =>
      b.id === id ? { ...b, active: !b.active } : b
    )
    setConfig({ ...config, banners })
  }

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newBanners = [...config.banners]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newBanners.length) return

    const temp = newBanners[index]
    newBanners[index] = newBanners[targetIndex]
    newBanners[targetIndex] = temp

    // Re-index display orders
    const reordered = newBanners.map((item, idx) => ({ ...item, displayOrder: idx + 1 }))
    setConfig({ ...config, banners: reordered })
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header Actions */}
      <div className={`border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${themeBorder}`}>
        <div>
          <h3 className={`text-lg font-bold uppercase flex items-center gap-2 ${themeText}`}>
            <Sliders className="h-5 w-5 text-gold" />
            <span>Banner Section & Carousel Manager</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>
            Add, edit, delete, and reorder homepage banner slides with automatic carousel transitions
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setConfig({ ...config, enabled: !config.enabled })}
            className={`flex items-center gap-2 px-4 py-2 border transition-all rounded-none ${
              isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {config.enabled ? (
              <>
                <ToggleRight className="h-5 w-5 text-gold" />
                <span className="text-gold font-bold text-xs uppercase tracking-wider">SECTION ENABLED</span>
              </>
            ) : (
              <>
                <ToggleLeft className="h-5 w-5 text-white/30" />
                <span className={`${themeTextSub} font-bold text-xs uppercase tracking-wider`}>SECTION DISABLED</span>
              </>
            )}
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2.5 rounded-none bg-gold px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-gold-light shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (success ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />)}
            <span>{saving ? 'Saving...' : (success ? 'Saved' : 'Save Changes')}</span>
          </button>
        </div>
      </div>

      {/* Global Carousel Controls */}
      <div className={`p-4 border rounded-none space-y-4 ${themeBorder} ${isDark ? 'bg-black/30' : 'bg-gray-50/70'}`}>
        <h4 className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${themeText}`}>
          <Settings className="h-4 w-4 text-gold" />
          <span>Carousel Settings</span>
        </h4>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className={labelClass}>Auto-play Slides</label>
            <button
              type="button"
              onClick={() => setConfig({ ...config, autoPlay: !config.autoPlay })}
              className={`w-full py-2 px-3 border font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 ${
                config.autoPlay ? 'border-gold text-gold bg-gold/10' : `${themeBorder} ${themeTextSub}`
              }`}
            >
              {config.autoPlay ? 'AUTOPLAY ON' : 'AUTOPLAY OFF'}
            </button>
          </div>

          <div>
            <label className={labelClass}>Slide Interval (ms)</label>
            <input
              type="number"
              step={500}
              min={2000}
              max={15000}
              value={config.autoPlayInterval || 5000}
              onChange={(e) => setConfig({ ...config, autoPlayInterval: parseInt(e.target.value) || 5000 })}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Show Pagination Dots</label>
            <button
              type="button"
              onClick={() => setConfig({ ...config, showIndicators: !config.showIndicators })}
              className={`w-full py-2 px-3 border font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 ${
                config.showIndicators ? 'border-gold text-gold bg-gold/10' : `${themeBorder} ${themeTextSub}`
              }`}
            >
              {config.showIndicators ? 'INDICATORS VISIBLE' : 'INDICATORS HIDDEN'}
            </button>
          </div>

          <div>
            <label className={labelClass}>Show Navigation Arrows</label>
            <button
              type="button"
              onClick={() => setConfig({ ...config, showArrows: !config.showArrows })}
              className={`w-full py-2 px-3 border font-mono text-xs font-bold uppercase flex items-center justify-center gap-2 ${
                config.showArrows ? 'border-gold text-gold bg-gold/10' : `${themeBorder} ${themeTextSub}`
              }`}
            >
              {config.showArrows ? 'ARROWS VISIBLE' : 'ARROWS HIDDEN'}
            </button>
          </div>
        </div>
      </div>

      {/* Banner Slides List Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${themeText}`}>
            Active Banner Slides ({config.banners?.length || 0})
          </h4>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 px-4 py-2 bg-gold text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-gold-light transition-all rounded-none"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Banner Slide</span>
          </button>
        </div>

        {/* Banners List */}
        <div className="space-y-3">
          {config.banners && config.banners.length > 0 ? (
            config.banners.map((banner, index) => {
              const imgUrl = typeof banner.image === 'object' ? banner.image.desktop : banner.image
              return (
                <div
                  key={banner.id || index}
                  className={`border p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all ${themeBorder} ${
                    isDark ? 'bg-black/20 hover:bg-black/40' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-16 bg-neutral-900 overflow-hidden border border-white/10 shrink-0">
                      {imgUrl ? (
                        <img src={imgUrl} alt={banner.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {banner.badge && (
                          <span className="px-2 py-0.5 bg-gold/20 text-gold font-mono text-[9px] font-bold uppercase">
                            {banner.badge}
                          </span>
                        )}
                        <span className={`font-mono text-[10px] font-bold ${banner.active ? 'text-emerald-400' : 'text-red-400'}`}>
                          {banner.active ? '● LIVE' : '○ HIDDEN'}
                        </span>
                      </div>
                      <h5 className={`font-display text-sm font-bold truncate ${themeText}`}>
                        {banner.title || 'Untitled Banner'}
                      </h5>
                      <p className={`font-mono text-xs truncate ${themeTextSub}`}>
                        {banner.subtitle || banner.description || 'No description set'}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Reordering */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleMoveOrder(index, 'up')}
                      disabled={index === 0}
                      title="Move Up"
                      className={`p-2 border ${themeBorder} ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} disabled:opacity-30`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleMoveOrder(index, 'down')}
                      disabled={index === config.banners.length - 1}
                      title="Move Down"
                      className={`p-2 border ${themeBorder} ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'} disabled:opacity-30`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleToggleActive(banner.id)}
                      title={banner.active ? 'Hide Banner' : 'Show Banner'}
                      className={`p-2 border ${themeBorder} ${banner.active ? 'text-emerald-400' : 'text-gray-400'}`}
                    >
                      {banner.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={() => {
                        setEditingBanner({ ...banner })
                        setIsNew(false)
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 border border-gold text-gold font-mono text-xs font-bold uppercase hover:bg-gold hover:text-white transition-all"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className={`p-8 border text-center font-mono text-xs ${themeBorder} ${themeTextSub}`}>
              No banner slides added yet. Click "Add New Banner Slide" to get started.
            </div>
          )}
        </div>
      </div>

      {/* Edit / Add Modal Form */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-3xl border p-6 lg:p-8 space-y-6 max-h-[90vh] overflow-y-auto ${themeBorder} ${isDark ? 'bg-[#0D0D0D] text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center justify-between border-b pb-4">
              <h4 className="font-display text-lg font-bold uppercase flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-gold" />
                <span>{isNew ? 'Create New Banner Slide' : 'Edit Banner Slide'}</span>
              </h4>
              <button
                onClick={() => setEditingBanner(null)}
                className="text-xs font-mono font-bold uppercase text-gray-400 hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Banner Main Title *</label>
                  <input
                    type="text"
                    value={editingBanner.title}
                    onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. INDUSTRIAL ELEGANCE"
                  />
                </div>
                <div>
                  <label className={labelClass}>Badge / Campaign Tag</label>
                  <input
                    type="text"
                    value={editingBanner.badge || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, badge: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. CAMPAIGN 2026"
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Subtitle / Category Highlight</label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Bespoke Garments & Corporate Uniforms"
                />
              </div>

              <div>
                <label className={labelClass}>Detailed Paragraph Description</label>
                <textarea
                  rows={3}
                  value={editingBanner.description || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, description: e.target.value })}
                  className={inputClass}
                  placeholder="Write a compelling promotional description for this banner slide..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Call-to-Action Button Text</label>
                  <input
                    type="text"
                    value={editingBanner.ctaText || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. EXPLORE COLLECTION"
                  />
                </div>
                <div>
                  <label className={labelClass}>Call-to-Action Target Link</label>
                  <input
                    type="text"
                    value={editingBanner.ctaLink || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, ctaLink: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. /products/garments or /contact"
                  />
                </div>
              </div>

              {/* Image Uploader */}
              <div className="pt-2">
                <ResponsiveImageUploader
                  label="Banner Background Image"
                  value={editingBanner.image as any}
                  onChange={(val) => setEditingBanner({ ...editingBanner, image: val })}
                  aspectRatioHint="Recommended: 16:9 for Desktop (1920x1080), 4:5 or 1:1 for Mobile"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="px-5 py-2.5 border font-mono text-xs font-bold uppercase hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveBannerModal}
                className="px-6 py-2.5 bg-gold text-white font-mono text-xs font-bold uppercase hover:bg-gold-light"
              >
                Save Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
