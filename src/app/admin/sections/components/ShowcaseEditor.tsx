'use client'

import { useState } from 'react'
import { Layers, Save, Loader2, CheckCircle2, Plus, Trash2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import { ResponsiveImageUploader } from '@/components/admin/ResponsiveImageUploader'
import type { Showcase, Category } from '../types'

interface Props {
  initialData: Showcase;
  sectionId: string;
  title: string;
  subtitle: string;
  matrixTitle: string;
}

export function ShowcaseEditor({ initialData, sectionId, title, subtitle, matrixTitle }: Props) {
  const [showcase, setShowcase] = useState<Showcase>(initialData || { indicator: '', headingStart: '', headingHighlight: '', description: '', categories: [] })
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
      await api.admin.updateContent(token, sectionId, showcase as any)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save to Supabase', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddCategory = () => {
    const newCat: Category = {
      name: 'New Category',
      slug: `category-${Date.now().toString().slice(-4)}`,
      tagline: 'Crisp, premium tailored fits',
      count: '100+ Styles',
      image: ''
    }
    setShowcase(prev => ({
      ...prev,
      categories: [...(prev.categories || []), newCat]
    }))
  }

  const handleDeleteCategory = (indexToDelete: number) => {
    if (window.confirm('Are you sure you want to delete this category slot?')) {
      setShowcase(prev => ({
        ...prev,
        categories: prev.categories.filter((_, idx) => idx !== indexToDelete)
      }))
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className={`border-b pb-4 flex justify-between items-center ${themeBorder}`}>
        <div>
          <h3 className={`text-lg font-bold uppercase flex items-center gap-2 ${themeText}`}>
            <Layers className="h-5 w-5 text-gold" />
            <span>{title}</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>{subtitle}</p>
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
        <label className={labelClass}>Section Upper Indicator</label>
        <input
          type="text"
          value={showcase.indicator || ''}
          onChange={e => setShowcase({ ...showcase, indicator: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Heading Line Start</label>
          <input
            type="text"
            value={showcase.headingStart || ''}
            onChange={e => setShowcase({ ...showcase, headingStart: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Heading Line Highlight (Gold Text)</label>
          <input
            type="text"
            value={showcase.headingHighlight || ''}
            onChange={e => setShowcase({ ...showcase, headingHighlight: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Section Description Paragraph *</label>
        <textarea
          rows={2}
          value={showcase.description || ''}
          onChange={e => setShowcase({ ...showcase, description: e.target.value })}
          className={inputClass}
        />
      </div>

      <div className={`pt-4 border-t space-y-4 ${themeBorderSub}`}>
        <div className="flex items-center justify-between">
          <span className={labelClass}>{matrixTitle}</span>
          <button
            type="button"
            onClick={handleAddCategory}
            className="flex items-center gap-1.5 rounded bg-gold/10 border border-gold/30 px-3 py-1 font-mono text-xs font-bold uppercase text-gold hover:bg-gold hover:text-white transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Cutout Category</span>
          </button>
        </div>

        {(!showcase.categories || showcase.categories.length === 0) ? (
          <div className={`p-8 text-center border font-mono text-xs ${themeBorder} ${themeTextSub}`}>
            No cutout categories created yet. Click "Add Cutout Category" to create your first card.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {showcase.categories.map((cat: Category, cIdx: number) => (
              <div key={cat.slug || cIdx} className={`border p-4 space-y-3 rounded-none ${themeBorder} ${isDark ? 'bg-black/40' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between border-b pb-2 border-white/5">
                  <span className="text-[9px] font-mono font-bold text-gold uppercase block">Card Slot 0{cIdx + 1} ({cat.name || 'Untitled'})</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cIdx)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                    title="Delete Category Card"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Category Name</label>
                    <input
                      type="text"
                      value={cat.name || ''}
                      onChange={e => {
                        const updated = [...showcase.categories]
                        const newName = e.target.value
                        updated[cIdx].name = newName
                        // Auto-update slug if default or slug equals old auto-slug
                        if (!updated[cIdx].slug || updated[cIdx].slug.startsWith('category-')) {
                          updated[cIdx].slug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                        }
                        setShowcase({ ...showcase, categories: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Category Slug (URL parameter)</label>
                    <input
                      type="text"
                      value={cat.slug || ''}
                      onChange={e => {
                        const updated = [...showcase.categories]
                        updated[cIdx].slug = e.target.value.toLowerCase().replace(/\s+/g, '-')
                        setShowcase({ ...showcase, categories: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Value/Count Tag (e.g. 140+ Styles)</label>
                    <input
                      type="text"
                      value={cat.count || ''}
                      onChange={e => {
                        const updated = [...showcase.categories]
                        updated[cIdx].count = e.target.value
                        setShowcase({ ...showcase, categories: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Short Tagline Description</label>
                    <input
                      type="text"
                      value={cat.tagline || ''}
                      onChange={e => {
                        const updated = [...showcase.categories]
                        updated[cIdx].tagline = e.target.value
                        setShowcase({ ...showcase, categories: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Image Preview & Upload */}
                <div className="pt-2">
                  <ResponsiveImageUploader
                    label="Category Card Image"
                    value={cat.image}
                    onChange={(val) => {
                      const updated = [...showcase.categories]
                      updated[cIdx].image = val.desktop || val.mobile || ''
                      setShowcase({ ...showcase, categories: updated })
                    }}
                    aspectRatioHint="Suggested: 16:9 or 3:4"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
