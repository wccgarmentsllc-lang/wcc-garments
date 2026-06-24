'use client'

import { useState } from 'react'
import { Settings, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { contentStore } from '@/lib/content-store'
import { useThemeContext } from '@/context/ThemeContext'
import type { SiteConfig } from '../types'

interface Props {
  initialData: SiteConfig;
}

export function GlobalConfigEditor({ initialData }: Props) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(initialData)
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
      await api.admin.updateContent(token, 'site_config', siteConfig as any)
      contentStore.saveSiteConfig(siteConfig)
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
            <Settings className="h-5 w-5 text-gold" />
            <span>1. Global Corporate Profile</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>Configure central B2B identity metrics, phone numbers, WhatsApp, and addresses</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2.5 rounded-none bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-gold-light shadow-md disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (success ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />)}
          <span>{saving ? 'Saving...' : (success ? 'Saved' : 'Save Changes')}</span>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>B2B Brand Tag *</label>
          <input
            type="text"
            required
            value={siteConfig.name || ''}
            onChange={e => setSiteConfig({ ...siteConfig, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Company Full Name *</label>
          <input
            type="text"
            required
            value={siteConfig.fullName || ''}
            onChange={e => setSiteConfig({ ...siteConfig, fullName: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tagline Descriptor *</label>
        <input
          type="text"
          required
          value={siteConfig.tagline || ''}
          onChange={e => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Comprehensive B2B Bio Summary *</label>
        <textarea
          rows={3}
          required
          value={siteConfig.description || ''}
          onChange={e => setSiteConfig({ ...siteConfig, description: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>Direct Phone Line *</label>
          <input
            type="text"
            required
            value={siteConfig.phone || ''}
            onChange={e => setSiteConfig({ ...siteConfig, phone: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Company Email *</label>
          <input
            type="text"
            required
            value={siteConfig.email || ''}
            onChange={e => setSiteConfig({ ...siteConfig, email: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>WhatsApp Number (Include Country Code) *</label>
          <input
            type="text"
            required
            value={siteConfig.whatsapp || ''}
            onChange={e => setSiteConfig({ ...siteConfig, whatsapp: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Physical Address *</label>
        <input
          type="text"
          required
          value={siteConfig.address || ''}
          onChange={e => setSiteConfig({ ...siteConfig, address: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className={`grid gap-4 sm:grid-cols-4 pt-4 border-t ${themeBorderSub}`}>
        <div>
          <label className={labelClass}>Year Founded</label>
          <input
            type="text"
            value={siteConfig.founded || ''}
            onChange={e => setSiteConfig({ ...siteConfig, founded: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Countries Active</label>
          <input
            type="text"
            value={siteConfig.countries || ''}
            onChange={e => setSiteConfig({ ...siteConfig, countries: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Products Listed</label>
          <input
            type="text"
            value={siteConfig.products || ''}
            onChange={e => setSiteConfig({ ...siteConfig, products: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Years Experience</label>
          <input
            type="text"
            value={siteConfig.years || ''}
            onChange={e => setSiteConfig({ ...siteConfig, years: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
