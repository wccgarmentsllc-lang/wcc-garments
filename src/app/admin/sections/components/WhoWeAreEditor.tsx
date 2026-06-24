'use client'

import { useState } from 'react'
import { Users, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import { ResponsiveImageUploader } from '@/components/admin/ResponsiveImageUploader'
import type { WhoWeAre } from '../types'

interface Props {
  initialData: WhoWeAre;
}

export function WhoWeAreEditor({ initialData }: Props) {
  const [whoWeAre, setWhoWeAre] = useState<WhoWeAre>(initialData)
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
      await api.admin.updateContent(token, 'who-we-are', whoWeAre as any)
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
            <Users className="h-5 w-5 text-gold" />
            <span>4. Who We Are Section</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>Configure company legacy story, stats, achievements, and editorial images</p>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Heritage Tagline Label</label>
          <input
            type="text"
            value={whoWeAre.heritageLabel}
            onChange={e => setWhoWeAre({ ...whoWeAre, heritageLabel: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Main Editorial Heading</label>
          <input
            type="text"
            value={whoWeAre.heading}
            onChange={e => setWhoWeAre({ ...whoWeAre, heading: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Established Label Subtitle</label>
          <input
            type="text"
            value={whoWeAre.subHeading}
            onChange={e => setWhoWeAre({ ...whoWeAre, subHeading: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Floating Glass Badge Title</label>
          <input
            type="text"
            value={whoWeAre.floatingBadgeTitle}
            onChange={e => setWhoWeAre({ ...whoWeAre, floatingBadgeTitle: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Floating Glass Badge Description</label>
        <input
          type="text"
          value={whoWeAre.floatingBadgeDesc}
          onChange={e => setWhoWeAre({ ...whoWeAre, floatingBadgeDesc: e.target.value })}
          className={inputClass}
        />
      </div>

      {/* 3 Paragraphs fields */}
      <div className="space-y-3">
        <span className={labelClass}>Editorial Paragraphs (Legibility & Structure)</span>
        {whoWeAre.paragraphs.map((pText: string, pIdx: number) => (
          <div key={pIdx}>
            <label className={`text-[9px] block mb-1 ${themeTextSub}`}>Paragraph 0{pIdx + 1}</label>
            <textarea
              rows={2}
              value={pText}
              onChange={e => {
                const updated = [...whoWeAre.paragraphs]
                updated[pIdx] = e.target.value
                setWhoWeAre({ ...whoWeAre, paragraphs: updated })
              }}
              className={inputClass}
            />
          </div>
        ))}
      </div>

      {/* Stats edit */}
      <div className={`pt-4 border-t space-y-4 ${themeBorderSub}`}>
        <span className={labelClass}>Authority Stats Matrix</span>
        <div className="grid gap-4 sm:grid-cols-3">
          {whoWeAre.stats.map((stat, sIdx: number) => (
            <div key={sIdx} className={`border p-4 space-y-3 ${themeBorder} ${isDark ? 'bg-black/40' : 'bg-gray-50'}`}>
              <span className="text-[9px] font-mono font-bold text-gold uppercase block">Stat Slot 0{sIdx + 1}</span>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`text-[9px] block ${themeTextSub}`}>Number</label>
                  <input
                    type="number"
                    value={stat.value}
                    onChange={e => {
                      const updated = [...whoWeAre.stats]
                      updated[sIdx].value = parseInt(e.target.value) || 0
                      setWhoWeAre({ ...whoWeAre, stats: updated })
                    }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={`text-[9px] block ${themeTextSub}`}>Suffix</label>
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={e => {
                      const updated = [...whoWeAre.stats]
                      updated[sIdx].suffix = e.target.value
                      setWhoWeAre({ ...whoWeAre, stats: updated })
                    }}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={`text-[9px] block ${themeTextSub}`}>Label Tag</label>
                <input
                  type="text"
                  value={stat.label}
                  onChange={e => {
                    const updated = [...whoWeAre.stats]
                    updated[sIdx].label = e.target.value
                    setWhoWeAre({ ...whoWeAre, stats: updated })
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={`text-[9px] block ${themeTextSub}`}>Short Description</label>
                <textarea
                  rows={2}
                  value={stat.desc}
                  onChange={e => {
                    const updated = [...whoWeAre.stats]
                    updated[sIdx].desc = e.target.value
                    setWhoWeAre({ ...whoWeAre, stats: updated })
                  }}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main editorial Image upload */}
      <div className={`pt-6 border-t ${themeBorderSub}`}>
        <ResponsiveImageUploader
          label="Main Editorial Image (Vibrant & Sharp)"
          value={whoWeAre.mainImage}
          onChange={(val) => {
            setWhoWeAre({ ...whoWeAre, mainImage: val.desktop || val.mobile || '' })
          }}
          aspectRatioHint="Suggested: 16:9 for Desktop, 4:5 for Mobile"
        />
      </div>
    </div>
  )
}
