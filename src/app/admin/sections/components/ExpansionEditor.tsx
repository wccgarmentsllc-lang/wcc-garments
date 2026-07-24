'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Save, Loader2, CheckCircle2, Upload, LayoutGrid, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import type { Expansion } from '../types'

interface Props {
  initialData: Expansion;
}

const ALL_DIVISIONS = [
  { slug: 'garments', name: 'Garments' },
  { slug: 'households', name: 'Households' },
  { slug: 'hospitality', name: 'Hospitality' },
  { slug: 'uniforms', name: 'Uniforms' },
  { slug: 'home', name: 'Home' },
  { slug: 'fragrance', name: 'Fragrance' },
]

const DEFAULT_SLUGS = ['households', 'hospitality', 'uniforms', 'fragrance']

export function ExpansionEditor({ initialData }: Props) {
  const [expansion, setExpansion] = useState<Expansion>({
    ...initialData,
    selectedDivisions: initialData.selectedDivisions && initialData.selectedDivisions.length > 0
      ? initialData.selectedDivisions
      : DEFAULT_SLUGS
  })

  const [divisionsData, setDivisionsData] = useState<any[]>([])
  const [loadingDivs, setLoadingDivs] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null)
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

  // Load all divisions from DB
  const loadDivisions = async () => {
    try {
      setLoadingDivs(true)
      const res = await fetch('/api/categories?divisions=true', { cache: 'no-store' })
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setDivisionsData(json.data)
      }
    } catch (err) {
      console.error('Failed to fetch divisions', err)
    } finally {
      setLoadingDivs(false)
    }
  }

  useEffect(() => {
    loadDivisions()
  }, [])

  const toggleDivision = (slug: string) => {
    const current = expansion.selectedDivisions || DEFAULT_SLUGS
    let updated: string[]
    if (current.includes(slug)) {
      updated = current.filter(s => s !== slug)
    } else {
      updated = [...current, slug]
    }
    setExpansion({ ...expansion, selectedDivisions: updated })
  }

  const handleImageUpload = async (slug: string, file: File) => {
    setUploadingSlug(slug)
    try {
      const imageUrl = await api.uploadFile(file)
      const targetDiv = divisionsData.find(d => d.slug === slug)
      if (targetDiv) {
        const token = localStorage.getItem('wcc-admin-token') || ''
        await api.admin.updateCategory(token, targetDiv.id, {
          ...targetDiv,
          image: imageUrl
        })
        await loadDivisions()
      }
    } catch (err) {
      console.error('Image upload failed', err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploadingSlug(null)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      const token = localStorage.getItem('wcc-admin-token') || ''
      await api.admin.updateContent(token, 'strategic-expansion', expansion as any)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save to Supabase', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className={`border-b pb-4 flex justify-between items-center ${themeBorder}`}>
        <div>
          <h3 className={`text-lg font-bold uppercase flex items-center gap-2 ${themeText}`}>
            <TrendingUp className="h-5 w-5 text-gold" />
            <span>7. Strategic Diversification &amp; Expansion</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>Configure active B2B statements, tag labels, selected expansion divisions, and division card images</p>
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

      <div>
        <label className={labelClass}>Diversification Tag Label</label>
        <input
          type="text"
          value={expansion.indicator || ''}
          onChange={e => setExpansion({ ...expansion, indicator: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Heading Line Start</label>
          <input
            type="text"
            value={expansion.headingStart || ''}
            onChange={e => setExpansion({ ...expansion, headingStart: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Heading Line Highlight (Gold Text)</label>
          <input
            type="text"
            value={expansion.headingHighlight || ''}
            onChange={e => setExpansion({ ...expansion, headingHighlight: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Comprehensive Expansion Statement descriptor *</label>
        <textarea
          rows={4}
          value={expansion.description || ''}
          onChange={e => setExpansion({ ...expansion, description: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* ── Division Selection & Image Upload ─────────────────────────────────────── */}
      <div className={`border-t pt-6 ${themeBorder}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className={`text-sm font-bold uppercase flex items-center gap-2 ${themeText}`}>
              <LayoutGrid className="h-4 w-4 text-gold" />
              <span>Select Divisions &amp; Manage Images</span>
            </h4>
            <p className={`text-xs mt-0.5 ${themeTextSub}`}>Select which divisions to display in this section and upload/change their cover images</p>
          </div>
        </div>

        {loadingDivs ? (
          <div className="py-8 text-center text-xs font-mono text-gold flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading live divisions...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {ALL_DIVISIONS.map(div => {
              const liveDiv = divisionsData.find(d => d.slug === div.slug)
              const isSelected = (expansion.selectedDivisions || DEFAULT_SLUGS).includes(div.slug)
              const imageUrl = liveDiv?.image || ''
              const isUploading = uploadingSlug === div.slug

              return (
                <div
                  key={div.slug}
                  className={`relative p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-gold bg-gold/5 dark:bg-gold/10'
                      : isDark ? 'border-white/10 bg-black/40' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  {/* Selection Checkbox Header */}
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleDivision(div.slug)}
                        className="h-4 w-4 rounded border-gray-300 text-gold focus:ring-gold accent-gold"
                      />
                      <span className={`text-xs font-bold font-mono ${themeText}`}>{div.name}</span>
                    </label>
                    {isSelected && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-gold text-white rounded">
                        Visible
                      </span>
                    )}
                  </div>

                  {/* Image Preview & Upload Button */}
                  <div className="relative h-28 w-full rounded-lg overflow-hidden border border-white/10 bg-black/60 flex items-center justify-center group">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={div.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <ImageIcon className="h-6 w-6 text-neutral-500 mx-auto mb-1" />
                        <span className="text-[9px] font-mono text-neutral-400 block">No Custom Image</span>
                      </div>
                    )}

                    {/* Upload Overlay */}
                    <label className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer p-2 text-center">
                      {isUploading ? (
                        <Loader2 className="h-5 w-5 animate-spin text-gold" />
                      ) : (
                        <>
                          <Upload className="h-5 w-5 text-gold mb-1" />
                          <span className="text-[10px] font-mono font-bold uppercase text-white">Upload New Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploading}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(div.slug, file)
                        }}
                      />
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
