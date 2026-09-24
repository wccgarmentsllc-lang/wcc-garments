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

            {/* CTA Division & Category Preset Selector */}
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Quick Target Division & Category Preset</label>
                <select
                  value={slide.ctaLink}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === 'custom') return
                    const allPresets = [
                      // Garments
                      { link: '/products/garments', text: 'EXPLORE GARMENTS' },
                      { link: '/products/garments?category=shirts', text: 'EXPLORE SHIRTS' },
                      { link: '/products/garments?category=t-shirts', text: 'EXPLORE T-SHIRTS' },
                      { link: '/products/garments?category=jeans', text: 'EXPLORE JEANS' },
                      { link: '/products/garments?category=trousers', text: 'EXPLORE TROUSERS' },
                      { link: '/products/garments?category=cargos', text: 'EXPLORE CARGOS' },
                      { link: '/products/garments?category=track-pants', text: 'EXPLORE TRACK PANTS' },
                      // Households
                      { link: '/products/households', text: 'EXPLORE HOUSEHOLDS' },
                      { link: '/products/households?category=cookware', text: 'EXPLORE COOKWARE' },
                      { link: '/products/households?category=cutlery', text: 'EXPLORE CUTLERY' },
                      { link: '/products/households?category=table-top', text: 'EXPLORE SERVEWARE' },
                      { link: '/products/households?category=utility', text: 'EXPLORE ORGANIZERS' },
                      // Hospitality
                      { link: '/products/hospitality', text: 'EXPLORE HOSPITALITY' },
                      { link: '/products/hospitality?category=barware', text: 'EXPLORE BARWARE' },
                      { link: '/products/hospitality?category=cookware', text: 'EXPLORE COOKWARE' },
                      { link: '/products/hospitality?category=kitchen-tools', text: 'EXPLORE KITCHEN TOOLS' },
                      { link: '/products/hospitality?category=cutlery', text: 'EXPLORE CUTLERY' },
                      { link: '/products/hospitality?category=storage', text: 'EXPLORE STORAGE' },
                      { link: '/products/hospitality?category=serving', text: 'EXPLORE SERVING' },
                      { link: '/products/hospitality?category=towels', text: 'EXPLORE TOWELS' },
                      { link: '/products/hospitality?category=fragrance', text: 'EXPLORE FRAGRANCE' },
                      { link: '/products/hospitality?category=hotel-linen', text: 'EXPLORE HOTEL LINEN' },
                      { link: '/products/hospitality?category=chef-uniforms', text: 'EXPLORE CHEF UNIFORMS' },
                      // Uniforms
                      { link: '/products/uniforms', text: 'EXPLORE UNIFORMS' },
                      { link: '/products/uniforms?category=corporate-workwear', text: 'EXPLORE WORKWEAR' },
                      { link: '/products/uniforms?category=security-attire', text: 'EXPLORE SECURITY ATTIRE' },
                      { link: '/products/uniforms?category=industrial-ppe', text: 'EXPLORE INDUSTRIAL & PPE' },
                      { link: '/products/uniforms?category=chef-kitchen-wear', text: 'EXPLORE CHEF WEAR' },
                      { link: '/products/uniforms?category=protective-aprons', text: 'EXPLORE APRONS' },
                      { link: '/products/uniforms?category=medical-scrubs', text: 'EXPLORE MEDICAL SCRUBS' },
                      // Home
                      { link: '/products/home', text: 'EXPLORE HOME LINEN' },
                      { link: '/products/home?category=bedsheets', text: 'EXPLORE BEDSETS' },
                      { link: '/products/home?category=bath-textiles', text: 'EXPLORE BATH TOWELS' },
                      { link: '/products/home?category=luxury-throws', text: 'EXPLORE LUXURY THROWS' },
                      { link: '/products/home?category=table-linen', text: 'EXPLORE TABLE LINEN' },
                      // Fragrance
                      { link: '/products/fragrance', text: 'EXPLORE FRAGRANCE' },
                      { link: '/products/fragrance?category=arabian-oud', text: 'EXPLORE ARABIAN OUD' },
                      { link: '/products/fragrance?category=bakhoor-incense', text: 'EXPLORE BAKHOOR' },
                      { link: '/products/fragrance?category=eau-de-parfum', text: 'EXPLORE EAU DE PARFUM' },
                      { link: '/products/fragrance?category=private-label', text: 'EXPLORE PRIVATE LABEL' },
                      { link: '/products/fragrance?category=raw-materials', text: 'EXPLORE RAW MATERIALS' },
                      // Contact
                      { link: '/contact', text: 'REQUEST QUOTATION' },
                    ]
                    const match = allPresets.find(p => p.link === val)
                    if (match) {
                      const updated = [...slides]
                      updated[sIdx].ctaText = match.text
                      updated[sIdx].ctaLink = match.link
                      setSlides(updated)
                    }
                  }}
                  className={inputClass}
                >
                  <option value="custom">-- Custom / Manual Entry --</option>
                  
                  <optgroup label="👔 Garments Division">
                    <option value="/products/garments">All Garments (EXPLORE GARMENTS)</option>
                    <option value="/products/garments?category=shirts">Shirts (EXPLORE SHIRTS)</option>
                    <option value="/products/garments?category=t-shirts">T-Shirts (EXPLORE T-SHIRTS)</option>
                    <option value="/products/garments?category=jeans">Jeans (EXPLORE JEANS)</option>
                    <option value="/products/garments?category=trousers">Trousers (EXPLORE TROUSERS)</option>
                    <option value="/products/garments?category=cargos">Cargos (EXPLORE CARGOS)</option>
                    <option value="/products/garments?category=track-pants">Track Pants (EXPLORE TRACK PANTS)</option>
                  </optgroup>

                  <optgroup label="🍳 Households & Kitchenware">
                    <option value="/products/households">All Households (EXPLORE HOUSEHOLDS)</option>
                    <option value="/products/households?category=cookware">Triply Cookware (EXPLORE COOKWARE)</option>
                    <option value="/products/households?category=cutlery">Premium Cutlery (EXPLORE CUTLERY)</option>
                    <option value="/products/households?category=table-top">Table & Serveware (EXPLORE SERVEWARE)</option>
                    <option value="/products/households?category=utility">Storage & Organizers (EXPLORE ORGANIZERS)</option>
                  </optgroup>

                  <optgroup label="🏨 Hospitality Division">
                    <option value="/products/hospitality">All Hospitality (EXPLORE HOSPITALITY)</option>
                    <option value="/products/hospitality?category=barware">Barware Products (EXPLORE BARWARE)</option>
                    <option value="/products/hospitality?category=cookware">Cookware Products (EXPLORE COOKWARE)</option>
                    <option value="/products/hospitality?category=kitchen-tools">Kitchen Tools (EXPLORE KITCHEN TOOLS)</option>
                    <option value="/products/hospitality?category=cutlery">Table Cutlery (EXPLORE CUTLERY)</option>
                    <option value="/products/hospitality?category=storage">Storage (EXPLORE STORAGE)</option>
                    <option value="/products/hospitality?category=serving">Serving (EXPLORE SERVING)</option>
                    <option value="/products/hospitality?category=towels">Towels & Linens (EXPLORE TOWELS)</option>
                    <option value="/products/hospitality?category=fragrance">Fragrance & Amenities (EXPLORE FRAGRANCE)</option>
                  </optgroup>

                  <optgroup label="🛡️ Uniforms & Workwear">
                    <option value="/products/uniforms">All Uniforms (EXPLORE UNIFORMS)</option>
                    <option value="/products/uniforms?category=corporate-workwear">Corporate Workwear (EXPLORE WORKWEAR)</option>
                    <option value="/products/uniforms?category=security-attire">Security Attire (EXPLORE SECURITY ATTIRE)</option>
                    <option value="/products/uniforms?category=industrial-ppe">Industrial & PPE (EXPLORE INDUSTRIAL & PPE)</option>
                    <option value="/products/uniforms?category=chef-kitchen-wear">Chef & Kitchen Wear (EXPLORE CHEF WEAR)</option>
                    <option value="/products/uniforms?category=protective-aprons">Protective Aprons (EXPLORE APRONS)</option>
                    <option value="/products/uniforms?category=medical-scrubs">Medical & Scrubs (EXPLORE MEDICAL SCRUBS)</option>
                  </optgroup>

                  <optgroup label="🛏️ Home Textiles Division">
                    <option value="/products/home">All Home Linens (EXPLORE HOME LINEN)</option>
                    <option value="/products/home?category=bedsheets">Bedsheets (EXPLORE BEDSETS)</option>
                    <option value="/products/home?category=bath-textiles">Bath Textiles (EXPLORE BATH TOWELS)</option>
                    <option value="/products/home?category=luxury-throws">Luxury Throws (EXPLORE LUXURY THROWS)</option>
                    <option value="/products/home?category=table-linen">Table Linen (EXPLORE TABLE LINEN)</option>
                  </optgroup>

                  <optgroup label="✨ Fragrance Division">
                    <option value="/products/fragrance">All Fragrances (EXPLORE FRAGRANCE)</option>
                    <option value="/products/fragrance?category=arabian-oud">Arabian Oud (EXPLORE ARABIAN OUD)</option>
                    <option value="/products/fragrance?category=bakhoor-incense">Bakhoor & Incense (EXPLORE BAKHOOR)</option>
                    <option value="/products/fragrance?category=eau-de-parfum">Eau de Parfum (EXPLORE EAU DE PARFUM)</option>
                    <option value="/products/fragrance?category=private-label">Private Label (EXPLORE PRIVATE LABEL)</option>
                    <option value="/products/fragrance?category=raw-materials">Raw Materials (EXPLORE RAW MATERIALS)</option>
                  </optgroup>

                  <optgroup label="📞 General Enquiries">
                    <option value="/contact">Contact Page (REQUEST QUOTATION)</option>
                  </optgroup>
                </select>
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
