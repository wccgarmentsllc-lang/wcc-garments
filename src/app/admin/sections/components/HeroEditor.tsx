'use client'

import { useState } from 'react'
import { Layout, Save, Loader2, CheckCircle2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import { ResponsiveImageUploader } from '@/components/admin/ResponsiveImageUploader'
import type { HeroConfig, HeroSlide } from '../types'
import { DEFAULT_HERO } from '../defaults'

interface Props {
  initialData: HeroConfig;
}

export function HeroEditor({ initialData }: Props) {
  const getInitialSlides = (): HeroSlide[] => {
    if (initialData?.slides && Array.isArray(initialData.slides) && initialData.slides.length > 0) {
      return initialData.slides
    }
    if (initialData?.campaigns && Array.isArray(initialData.campaigns) && initialData.campaigns.length > 0) {
      return initialData.campaigns.map((c: any, idx: number) => ({
        id: c.id || idx + 1,
        tag: c.tag || "GARMENTS & APPAREL",
        titleLine1: c.title || "Built for Brands.",
        titleLine2: "Made for Scale.",
        highlightWord: "Scale.",
        description: "End-to-end garment manufacturing for fashion brands, retailers and global buyers.",
        ctaText: "EXPLORE GARMENTS",
        ctaLink: "/products/garments",
        image: c.center || c.image || "/images/products/egyptian_cotton_shirt.png"
      }))
    }
    return DEFAULT_HERO.slides
  }

  const [slides, setSlides] = useState<HeroSlide[]>(getInitialSlides())
  const [autoPlay, setAutoPlay] = useState<boolean>(initialData?.autoPlay ?? true)
  const [interval, setInterval] = useState<number>(initialData?.interval ?? 5000)

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const { isDark } = useThemeContext()

  const themeText = isDark ? 'text-white' : 'text-gray-900'
  const themeTextSub = isDark ? 'text-white/50' : 'text-gray-500'
  const themeBorder = isDark ? 'border-white/10' : 'border-gray-200'

  const inputClass = `w-full rounded-xl border px-4 py-3 text-xs transition-all font-mono focus:border-gold focus:outline-none ${
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
      const updatedConfig: HeroConfig = {
        autoPlay,
        interval,
        slides,
      }
      await api.admin.updateContent(token, 'hero', updatedConfig as any)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save hero section to Supabase', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now(),
      tag: "GARMENTS & APPAREL",
      titleLine1: "Built for Brands.",
      titleLine2: "Made for Scale.",
      highlightWord: "Scale.",
      description: "End-to-end garment manufacturing for fashion brands, retailers and global buyers.",
      ctaText: "EXPLORE GARMENTS",
      ctaLink: "/products/garments",
      image: "/images/products/egyptian_cotton_shirt.png"
    }
    setSlides([...slides, newSlide])
  }

  const removeSlide = (index: number) => {
    if (slides.length <= 1) {
      alert("At least one slide is required.")
      return
    }
    setSlides(slides.filter((_, idx) => idx !== index))
  }

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides]
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= slides.length) return
    const temp = newSlides[index]
    newSlides[index] = newSlides[targetIdx]
    newSlides[targetIdx] = temp
    setSlides(newSlides)
  }

  return (
    <div className="space-y-6 font-sans">
      <div className={`border-b pb-4 flex justify-between items-center ${themeBorder}`}>
        <div>
          <h3 className={`text-lg font-bold uppercase flex items-center gap-2 ${themeText}`}>
            <Layout className="h-5 w-5 text-gold" />
            <span>1. Hero Section Slides Editor</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>
            Manage text, highlighted words, background images, and links for each slide in the main Hero section
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2.5 rounded-none bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-gold-light shadow-md disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (success ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />)}
          <span>{saving ? 'Saving...' : (success ? 'Saved' : 'Save')}</span>
        </button>
      </div>

      {/* Global Carousel Controls */}
      <div className={`border p-4 rounded-none space-y-4 ${themeBorder} ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
        <h4 className="text-xs font-mono font-bold text-gold uppercase tracking-wider">Carousel Global Settings</h4>
        <div className="grid gap-4 sm:grid-cols-2 items-center">
          <div className="flex items-center gap-3">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => setAutoPlay(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
            </label>
            <span className={`text-xs font-mono font-semibold ${themeText}`}>
              Autoplay Slides ({autoPlay ? 'Enabled' : 'Disabled'})
            </span>
          </div>

          <div>
            <label className={labelClass}>Autoplay Interval (ms)</label>
            <input
              type="number"
              step={500}
              min={2000}
              max={15000}
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Slides Matrix */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gold">
            Active Hero Slides ({slides.length})
          </span>
          <button
            onClick={addSlide}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 font-mono text-xs font-bold uppercase transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Slide</span>
          </button>
        </div>

        {slides.map((slide: HeroSlide, sIdx: number) => (
          <div
            key={slide.id}
            className={`border p-6 space-y-4 rounded-none ${themeBorder} ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}
          >
            <div className={`flex justify-between items-center border-b pb-3 ${themeBorder}`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">
                  Slide 0{sIdx + 1}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveSlide(sIdx, 'up')}
                  disabled={sIdx === 0}
                  className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                  title="Move Up"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSlide(sIdx, 'down')}
                  disabled={sIdx === slides.length - 1}
                  className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                  title="Move Down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSlide(sIdx)}
                  className="p-1 text-red-400 hover:text-red-300 ml-2"
                  title="Delete Slide"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Category Tag Line</label>
                <input
                  type="text"
                  value={slide.tag}
                  onChange={(e) => {
                    const updated = [...slides]
                    updated[sIdx].tag = e.target.value
                    setSlides(updated)
                  }}
                  placeholder="e.g. GARMENTS & APPAREL"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Highlight Word (Colored Blue)</label>
                <input
                  type="text"
                  value={slide.highlightWord}
                  onChange={(e) => {
                    const updated = [...slides]
                    updated[sIdx].highlightWord = e.target.value
                    setSlides(updated)
                  }}
                  placeholder="e.g. Scale."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Title Line 1</label>
                <input
                  type="text"
                  value={slide.titleLine1}
                  onChange={(e) => {
                    const updated = [...slides]
                    updated[sIdx].titleLine1 = e.target.value
                    setSlides(updated)
                  }}
                  placeholder="e.g. Built for Brands."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Title Line 2</label>
                <input
                  type="text"
                  value={slide.titleLine2}
                  onChange={(e) => {
                    const updated = [...slides]
                    updated[sIdx].titleLine2 = e.target.value
                    setSlides(updated)
                  }}
                  placeholder="e.g. Made for Scale."
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Description Text</label>
              <textarea
                rows={2}
                value={slide.description}
                onChange={(e) => {
                  const updated = [...slides]
                  updated[sIdx].description = e.target.value
                  setSlides(updated)
                }}
                placeholder="End-to-end garment manufacturing for fashion brands..."
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>CTA Button Text</label>
                <input
                  type="text"
                  value={slide.ctaText}
                  onChange={(e) => {
                    const updated = [...slides]
                    updated[sIdx].ctaText = e.target.value
                    setSlides(updated)
                  }}
                  placeholder="EXPLORE GARMENTS"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>CTA Button Link URL</label>
                <input
                  type="text"
                  value={slide.ctaLink}
                  onChange={(e) => {
                    const updated = [...slides]
                    updated[sIdx].ctaLink = e.target.value
                    setSlides(updated)
                  }}
                  placeholder="/products/garments"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="pt-2">
              <ResponsiveImageUploader
                label="Slide Background Images (Desktop & Mobile)"
                value={{
                  desktop: slide.desktopImage || slide.image || '',
                  mobile: slide.mobileImage || slide.image || ''
                }}
                onChange={(val) => {
                  const updated = [...slides]
                  updated[sIdx].desktopImage = val.desktop || ''
                  updated[sIdx].mobileImage = val.mobile || ''
                  updated[sIdx].image = val.desktop || val.mobile || ''
                  setSlides(updated)
                }}
                aspectRatioHint="Upload separate images for Desktop layout and Mobile layout"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
