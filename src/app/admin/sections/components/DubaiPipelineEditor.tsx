'use client'

import { useState } from 'react'
import { FileText, Save, Loader2, CheckCircle2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import { ResponsiveImageUploader } from '@/components/admin/ResponsiveImageUploader'
import type { Pipeline, PipelineScene } from '../types'

interface Props {
  initialData: Pipeline;
}

export function DubaiPipelineEditor({ initialData }: Props) {
  const [pipeline, setPipeline] = useState<Pipeline>(initialData)
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
      await api.admin.updateContent(token, 'dubai-pipeline', pipeline as any)
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
            <FileText className="h-5 w-5 text-gold" />
            <span>8. Dubai Manufacturing Pipeline Steps</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>Configure step descriptions, step indicators, sequence cards, and images</p>
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
        <label className={labelClass}>Pipeline Tag Indicator</label>
        <input
          type="text"
          value={pipeline.indicator}
          onChange={e => setPipeline({ ...pipeline, indicator: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Heading Line Start</label>
          <input
            type="text"
            value={pipeline.headingStart}
            onChange={e => setPipeline({ ...pipeline, headingStart: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Heading Line Highlight (Gold Text)</label>
          <input
            type="text"
            value={pipeline.headingHighlight}
            onChange={e => setPipeline({ ...pipeline, headingHighlight: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Pipeline Subtitle Line Descriptor</label>
        <input
          type="text"
          value={pipeline.subHeading}
          onChange={e => setPipeline({ ...pipeline, subHeading: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className={`pt-4 border-t space-y-6 ${themeBorderSub}`}>
        <span className={labelClass}>Dubai Manufacturing Stages Matrix (5 Consecutive Stages)</span>
        
        {pipeline.scenes.map((scene: PipelineScene, sIdx: number) => (
          <div key={scene.step || sIdx} className={`border p-5 space-y-4 rounded-none ${themeBorder} ${isDark ? 'bg-black/40' : 'bg-gray-50'}`}>
            <div className={`flex justify-between items-center border-b pb-2 ${themeBorder}`}>
              <span className="text-[10px] font-mono font-bold text-gold uppercase tracking-wider">Pipeline Stage {scene.step}</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={`text-[9px] block ${themeTextSub}`}>Stage Title *</label>
                <input
                  type="text"
                  value={scene.title}
                  onChange={e => {
                    const updated = [...pipeline.scenes]
                    updated[sIdx].title = e.target.value
                    setPipeline({ ...pipeline, scenes: updated })
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={`text-[9px] block ${themeTextSub}`}>Step Number *</label>
                <input
                  type="text"
                  value={scene.step}
                  onChange={e => {
                    const updated = [...pipeline.scenes]
                    updated[sIdx].step = e.target.value
                    setPipeline({ ...pipeline, scenes: updated })
                  }}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={`text-[9px] block ${themeTextSub}`}>Comprehensive Description *</label>
              <textarea
                rows={2}
                value={scene.desc}
                onChange={e => {
                  const updated = [...pipeline.scenes]
                  updated[sIdx].desc = e.target.value
                  setPipeline({ ...pipeline, scenes: updated })
                }}
                className={inputClass}
              />
            </div>

            <div className="pt-2">
              <ResponsiveImageUploader
                label="Pipeline Stage Image"
                value={scene.image}
                onChange={(val) => {
                  const updated = [...pipeline.scenes]
                  updated[sIdx].image = val.desktop || val.mobile || ''
                  setPipeline({ ...pipeline, scenes: updated })
                }}
                aspectRatioHint="Suggested: 16:9 Landscape"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
