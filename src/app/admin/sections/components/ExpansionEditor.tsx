'use client'

import { useState } from 'react'
import { TrendingUp, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import type { Expansion } from '../types'

interface Props {
  initialData: Expansion;
}

export function ExpansionEditor({ initialData }: Props) {
  const [expansion, setExpansion] = useState<Expansion>(initialData)
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
          <p className={`text-xs mt-1 ${themeTextSub}`}>Configure active B2B statements, tags, and status descriptions for non-core sectors</p>
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
          value={expansion.indicator}
          onChange={e => setExpansion({ ...expansion, indicator: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Heading Line Start</label>
          <input
            type="text"
            value={expansion.headingStart}
            onChange={e => setExpansion({ ...expansion, headingStart: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Heading Line Highlight (Gold Text)</label>
          <input
            type="text"
            value={expansion.headingHighlight}
            onChange={e => setExpansion({ ...expansion, headingHighlight: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Comprehensive Expansion Statement descriptor *</label>
        <textarea
          rows={4}
          value={expansion.description}
          onChange={e => setExpansion({ ...expansion, description: e.target.value })}
          className={inputClass}
        />
      </div>
    </div>
  )
}
