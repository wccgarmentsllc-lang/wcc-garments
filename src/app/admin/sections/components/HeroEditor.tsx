'use client'

import { useState } from 'react'
import { Layout, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import { ResponsiveImageUploader } from '@/components/admin/ResponsiveImageUploader'
import type { HeroConfig, HeroCampaign } from '../types'

interface Props {
  initialData: HeroConfig;
}

export function HeroEditor({ initialData }: Props) {
  const [hero, setHero] = useState<HeroConfig>(initialData)
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
      await api.admin.updateContent(token, 'hero', hero as any)
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
            <Layout className="h-5 w-5 text-gold" />
            <span>3. Hero Section Carousel Campaigns</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>Configure active B2B campaign sets representing your signature brands</p>
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

      {hero.campaigns.map((camp: HeroCampaign, cIdx: number) => (
        <div key={camp.id} className={`border p-6 space-y-4 rounded-none ${themeBorder} ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className={`flex justify-between items-center border-b pb-3 ${themeBorder}`}>
            <span className="text-xs font-mono font-bold text-gold uppercase tracking-wider">Campaign Slot 0{cIdx + 1}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Campaign Title</label>
              <input
                type="text"
                value={camp.title}
                onChange={e => {
                  const updated = [...hero.campaigns]
                  updated[cIdx].title = e.target.value
                  setHero({ ...hero, campaigns: updated })
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Campaign Tag</label>
              <input
                type="text"
                value={camp.tag}
                onChange={e => {
                  const updated = [...hero.campaigns]
                  updated[cIdx].tag = e.target.value
                  setHero({ ...hero, campaigns: updated })
                }}
                className={inputClass}
              />
            </div>
          </div>

          {/* 3 Images separated (Left, Center, Right) */}
          <div className="grid gap-6 pt-3">
            <ResponsiveImageUploader
              label="Left Image (Emblem)"
              value={camp.left}
              onChange={(val) => {
                const updated = [...hero.campaigns]
                updated[cIdx].left = val.desktop || val.mobile || ''
                setHero({ ...hero, campaigns: updated })
              }}
              aspectRatioHint="Suggested: 3:4 Portrait"
            />
            <ResponsiveImageUploader
              label="Center Image (Signature)"
              value={camp.center}
              onChange={(val) => {
                const updated = [...hero.campaigns]
                updated[cIdx].center = val.desktop || val.mobile || ''
                setHero({ ...hero, campaigns: updated })
              }}
              aspectRatioHint="Suggested: 16:9 Landscape"
            />
            <ResponsiveImageUploader
              label="Right Image (Detail)"
              value={camp.right}
              onChange={(val) => {
                const updated = [...hero.campaigns]
                updated[cIdx].right = val.desktop || val.mobile || ''
                setHero({ ...hero, campaigns: updated })
              }}
              aspectRatioHint="Suggested: 3:4 Portrait"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
