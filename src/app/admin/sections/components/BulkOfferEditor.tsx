'use client'

import { useState } from 'react'
import { Sliders, Save, Loader2, CheckCircle2, ToggleLeft, ToggleRight } from 'lucide-react'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import { ResponsiveImageUploader } from '@/components/admin/ResponsiveImageUploader'
import type { BulkOffer } from '../types'

interface Props {
  initialData: BulkOffer;
}

export function BulkOfferEditor({ initialData }: Props) {
  const [bulkOffer, setBulkOffer] = useState<BulkOffer>(initialData)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const { isDark } = useThemeContext()

  const themeText = isDark ? 'text-white' : 'text-gray-900'
  const themeTextSub = isDark ? 'text-white/50' : 'text-gray-500'
  const themeBorder = isDark ? 'border-white/10' : 'border-gray-200'
  const themeBorderSub = isDark ? 'border-white/5' : 'border-gray-100'

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
      await api.admin.updateContent(token, 'bulk-offer', bulkOffer as any)
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
      <div className={`border-b pb-4 flex items-center justify-between ${themeBorder}`}>
        <div>
          <h3 className={`text-lg font-bold uppercase flex items-center gap-2 ${themeText}`}>
            <Sliders className="h-5 w-5 text-gold" />
            <span>2. Bulk Offer Banner Option</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>Configure active clearance events, discount values, and on/off visibility</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setBulkOffer({ ...bulkOffer, enabled: !bulkOffer.enabled })}
            className={`flex items-center gap-2 px-4 py-2 border transition-all rounded-none ${
              isDark 
                ? 'border-white/10 bg-white/5 hover:bg-white/10' 
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            {bulkOffer.enabled ? (
              <>
                <ToggleRight className="h-5 w-5 text-gold" />
                <span className="text-gold font-bold text-xs uppercase tracking-wider">ACTIVE (ON)</span>
              </>
            ) : (
              <>
                <ToggleLeft className="h-5 w-5 text-white/30" />
                <span className={`${isDark ? 'text-white/40' : 'text-gray-400'} font-bold text-xs uppercase tracking-wider`}>DEACTIVATED (OFF)</span>
              </>
            )}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2.5 rounded-none bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-gold-light shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (success ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />)}
            <span>{saving ? 'Saving...' : (success ? 'Saved' : 'Save')}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Promo Tag text</label>
          <input
            type="text"
            value={bulkOffer.tagText}
            onChange={e => setBulkOffer({ ...bulkOffer, tagText: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Call-to-Action Button Text</label>
          <input
            type="text"
            value={bulkOffer.buttonText}
            onChange={e => setBulkOffer({ ...bulkOffer, buttonText: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Heading Line Start</label>
          <input
            type="text"
            value={bulkOffer.headingStart}
            onChange={e => setBulkOffer({ ...bulkOffer, headingStart: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Heading Line Highlight (Gold Text)</label>
          <input
            type="text"
            value={bulkOffer.headingHighlight}
            onChange={e => setBulkOffer({ ...bulkOffer, headingHighlight: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Promo Description *</label>
        <textarea
          rows={2}
          value={bulkOffer.description}
          onChange={e => setBulkOffer({ ...bulkOffer, description: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className={`grid gap-4 sm:grid-cols-4 pt-4 border-t ${themeBorderSub}`}>
        <div>
          <label className={labelClass}>Discount Percent *</label>
          <input
            type="number"
            value={bulkOffer.discountPercentage}
            onChange={e => setBulkOffer({ ...bulkOffer, discountPercentage: parseInt(e.target.value) || 0 })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Discount Tag Label</label>
          <input
            type="text"
            value={bulkOffer.discountText}
            onChange={e => setBulkOffer({ ...bulkOffer, discountText: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Discount Minimum terms</label>
          <input
            type="text"
            value={bulkOffer.discountSubText}
            onChange={e => setBulkOffer({ ...bulkOffer, discountSubText: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Offer End Date</label>
          <input
            type="text"
            value={bulkOffer.offerEndDate}
            onChange={e => setBulkOffer({ ...bulkOffer, offerEndDate: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Slide Images Uploads (3 Slots) */}
      <div className={`pt-6 border-t ${themeBorderSub}`}>
        <span className={labelClass}>Promo Carousel Slide Images</span>
        <div className="grid gap-6 mt-3">
          {bulkOffer.slideImages.map((img: string, idx: number) => (
            <ResponsiveImageUploader
              key={idx}
              label={`Slide 0${idx + 1}`}
              value={img}
              onChange={(val) => {
                const updated = [...bulkOffer.slideImages]
                updated[idx] = val.desktop || val.mobile || ''
                setBulkOffer({ ...bulkOffer, slideImages: updated })
              }}
              aspectRatioHint="Suggested: 16:9 for Desktop, 4:5 for Mobile"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
