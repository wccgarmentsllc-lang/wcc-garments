'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import {
  Plus, Search, Edit2, Trash2, Save, Loader2, Award,
  CheckCircle2, Upload, ChevronDown, ChevronRight,
  Tag, Shirt, HardHat, Hotel, Home, Sparkles, CookingPot,
  LucideIcon, AlertCircle, X,
} from 'lucide-react'
import { api } from '@/lib/api'
import { Brand } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Division metadata ────────────────────────────────────────────────────────
const DIVISIONS: {
  slug: string; name: string; Icon: LucideIcon
  color: string; border: string; badge: string; iconColor: string
}[] = [
  { slug: 'garments',    name: 'Garments',    Icon: Shirt,      iconColor: 'text-blue-400',    color: 'from-blue-900/30 to-blue-800/10',      border: 'border-blue-700/40',   badge: 'bg-blue-900/50 text-blue-300'    },
  { slug: 'uniforms',    name: 'Uniforms',    Icon: HardHat,    iconColor: 'text-emerald-400', color: 'from-emerald-900/30 to-emerald-800/10', border: 'border-emerald-700/40', badge: 'bg-emerald-900/50 text-emerald-300' },
  { slug: 'hospitality', name: 'Hospitality', Icon: Hotel,      iconColor: 'text-amber-400',   color: 'from-amber-900/30 to-amber-800/10',    border: 'border-amber-700/40',  badge: 'bg-amber-900/50 text-amber-300'  },
  { slug: 'home',        name: 'Home',        Icon: Home,       iconColor: 'text-purple-400',  color: 'from-purple-900/30 to-purple-800/10',  border: 'border-purple-700/40', badge: 'bg-purple-900/50 text-purple-300' },
  { slug: 'fragrance',   name: 'Fragrance',   Icon: Sparkles,   iconColor: 'text-pink-400',    color: 'from-pink-900/30 to-pink-800/10',      border: 'border-pink-700/40',   badge: 'bg-pink-900/50 text-pink-300'    },
  { slug: 'households',  name: 'Households',  Icon: CookingPot, iconColor: 'text-orange-400',  color: 'from-orange-900/30 to-orange-800/10',  border: 'border-orange-700/40', badge: 'bg-orange-900/50 text-orange-300' },
]

// ─── Form shape ───────────────────────────────────────────────────────────────
interface BrandForm {
  id?: string
  name: string
  slug: string
  division_slug: string
  tagline: string
  description: string
  logo_mobile: string
  logo_desktop: string
  featured: boolean
  display_order: number
}

const BLANK_FORM: BrandForm = {
  id: undefined,
  name: '', slug: '', division_slug: 'garments',
  tagline: '', description: '',
  logo_mobile: '', logo_desktop: '',
  featured: true, display_order: 1,
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminBrandsPage() {
  const [brands, setBrands]           = useState<Brand[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')

  // Modal state
  const [editOpen, setEditOpen]       = useState(false)
  const [deleteId, setDeleteId]       = useState<string | null>(null)
  const [form, setForm]               = useState<BrandForm>(BLANK_FORM)
  const [saving, setSaving]           = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError]     = useState<string | null>(null)
  const [uploadingField, setUploadingField] = useState<string | null>(null)

  // Division collapse
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchBrands = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.admin.getBrands()
      if (res.success && res.data) setBrands(res.data)
    } catch (err) {
      console.error('fetchBrands error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBrands() }, [fetchBrands])

  // ── Open modal ─────────────────────────────────────────────────────────────
  const openEdit = (brand?: Brand, divisionSlug?: string) => {
    setSaveError(null)
    setSaveSuccess(false)
    if (brand) {
      setForm({
        id:            brand.id,
        name:          brand.name          ?? '',
        slug:          brand.slug          ?? '',
        division_slug: brand.division_slug ?? 'garments',
        tagline:       brand.tagline       ?? '',
        description:   brand.description   ?? '',
        logo_mobile:   brand.logo_mobile   ?? '',
        logo_desktop:  brand.logo_desktop  ?? '',
        featured:      brand.featured      ?? true,
        display_order: brand.display_order ?? 1,
      })
    } else {
      const divBrands = brands.filter(b => b.division_slug === (divisionSlug ?? 'garments'))
      setForm({ ...BLANK_FORM, division_slug: divisionSlug ?? 'garments', display_order: divBrands.length + 1 })
    }
    setEditOpen(true)
  }

  const closeEdit = () => { setEditOpen(false); setSaveError(null); setSaveSuccess(false) }

  // ── Field change helpers ───────────────────────────────────────────────────
  const set = (field: keyof BrandForm, value: string | boolean | number) =>
    setForm(prev => ({ ...prev, [field]: value }))

  // ── File upload ────────────────────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_desktop' | 'logo_mobile') => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingField(field)
    try {
      const oldUrl = form[field]
      const url = await api.uploadFile(file)
      setForm(prev => ({ ...prev, [field]: url }))
      if (oldUrl) { try { await api.deleteFile(oldUrl) } catch {} }
    } catch (err) {
      console.error('Upload failed:', err)
      setSaveError('Image upload failed.')
    } finally {
      setUploadingField(null)
      e.target.value = ''
    }
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaveError(null)

    // Validate
    if (!form.name.trim())        return setSaveError('Brand name is required.')
    if (!form.slug.trim())        return setSaveError('URL slug is required.')
    if (!form.tagline.trim())     return setSaveError('Tagline is required.')
    if (!form.description.trim()) return setSaveError('Description is required.')

    setSaving(true)
    try {
      // Strip `id` (and `created_at` if present) — Supabase rejects updating PK
      const { id, ...payload } = form as BrandForm & { created_at?: string }
      if (id) {
        // Also strip `slug` on update — products FK (products_brand_slug_fkey) prevents slug changes
        const { slug: _slug, ...updatePayload } = payload
        await api.admin.updateBrand(undefined, id, updatePayload as Record<string, unknown>)
      } else {
        await api.admin.createBrand(undefined, payload as Record<string, unknown>)
      }
      await fetchBrands()
      setSaveSuccess(true)
      setTimeout(() => { closeEdit() }, 1200)
    } catch (err: any) {
      console.error('handleSave error:', err)
      setSaveError(err?.message ?? 'Save failed — check the browser console.')
    } finally {
      setSaving(false)
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return
    const brand = brands.find(b => b.id === deleteId)
    try {
      if (brand?.logo_desktop) { try { await api.deleteFile(brand.logo_desktop) } catch {} }
      if (brand?.logo_mobile)  { try { await api.deleteFile(brand.logo_mobile)  } catch {} }
      await api.admin.deleteBrand(undefined, deleteId)
      setDeleteId(null)
      await fetchBrands()
    } catch (err) {
      console.error('handleDelete error:', err)
    }
  }

  // ── Toggle division collapse ───────────────────────────────────────────────
  const toggleCollapse = (slug: string) =>
    setCollapsed(prev => { const n = new Set(prev); n.has(slug) ? n.delete(slug) : n.add(slug); return n })

  // ── Derived data ───────────────────────────────────────────────────────────
  const filtered  = brands.filter(b =>
    !search || b.name?.toLowerCase().includes(search.toLowerCase()) ||
    b.tagline?.toLowerCase().includes(search.toLowerCase()) ||
    b.division_slug?.toLowerCase().includes(search.toLowerCase())
  )
  const grouped   = DIVISIONS.map(div => ({ ...div, items: filtered.filter(b => b.division_slug === div.slug) }))
  const unmatched = filtered.filter(b => !DIVISIONS.some(d => d.slug === b.division_slug))

  // ── Styles ─────────────────────────────────────────────────────────────────
  const iClass = 'w-full border border-neutral-200 bg-white px-4 py-3 text-xs text-neutral-900 placeholder-neutral-400 dark:border-white/10 dark:bg-black/60 dark:text-white dark:placeholder-white/30 focus:border-gold focus:outline-none transition-colors font-mono rounded-none'
  const lClass  = 'mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-white/50 font-mono'

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-neutral-900 dark:text-white font-mono">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6 font-sans">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Brands Directory</h1>
            <span className="bg-gold/10 border border-gold/30 px-3 py-0.5 font-mono text-xs font-bold text-gold rounded-none">{filtered.length} total</span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/50">Brands organised by division — click a division header to collapse/expand</p>
        </div>
        <button
          onClick={() => openEdit()}
          className="flex items-center gap-2.5 bg-gold px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-gold/80 shadow-md self-start sm:self-auto rounded-none transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Brand
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 bg-neutral-50 dark:bg-white/5 p-4 border border-neutral-200 dark:border-white/10">
        <Award className="h-4 w-4 text-gold flex-shrink-0" />
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search brands across all divisions..."
            className="w-full border border-neutral-200 bg-white py-2.5 pl-10 pr-4 font-mono text-xs text-neutral-900 placeholder-neutral-400 dark:border-white/10 dark:bg-black/50 dark:text-white dark:placeholder-white/30 focus:border-gold focus:outline-none transition-colors rounded-none"
          />
        </div>
        {search && <span className="text-xs text-neutral-500 dark:text-white/50 font-mono">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>}
      </div>

      {/* Brand lists */}
      {loading ? (
        <div className="py-24 flex justify-center"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>
      ) : (
        <div className="space-y-6">
          {grouped.map(div => (
            <div key={div.slug} className={`border ${div.border} rounded-none overflow-hidden`}>

              {/* Division header */}
              <div
                role="button" tabIndex={0}
                onClick={() => toggleCollapse(div.slug)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCollapse(div.slug) } }}
                className={`w-full flex items-center justify-between gap-4 px-5 py-4 bg-gradient-to-r ${div.color} hover:brightness-110 transition-all cursor-pointer select-none`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div.Icon className={`h-5 w-5 flex-shrink-0 ${div.iconColor}`} />
                  <div className="flex items-center gap-3 min-w-0">
                    <h2 className="font-display text-base font-bold uppercase tracking-[0.18em] text-neutral-900 dark:text-white">{div.name}</h2>
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-widest rounded-none ${div.badge}`}>{div.items.length} brand{div.items.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); openEdit(undefined, div.slug) }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border border-gold/40 bg-gold/10 text-gold hover:bg-gold hover:text-white transition-all rounded-none"
                  >
                    <Plus className="h-3 w-3" />Add Brand
                  </button>
                  {collapsed.has(div.slug) ? <ChevronRight className="h-4 w-4 text-neutral-400 dark:text-white/50" /> : <ChevronDown className="h-4 w-4 text-neutral-400 dark:text-white/50" />}
                </div>
              </div>

              {/* Brand cards */}
              <AnimatePresence initial={false}>
                {!collapsed.has(div.slug) && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    {div.items.length === 0 ? (
                      <div className="px-6 py-10 text-center text-xs text-neutral-400 dark:text-white/40 bg-white dark:bg-black/20 border-t border-neutral-200 dark:border-white/10">
                        <Tag className="h-6 w-6 mx-auto mb-2 opacity-40" />
                        No brands yet.{' '}
                        <button onClick={() => openEdit(undefined, div.slug)} className="text-gold hover:underline">Add the first →</button>
                      </div>
                    ) : (
                      <div className="grid gap-px bg-neutral-200 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
                        {div.items.map(brand => (
                          <BrandCard key={brand.id} brand={brand} onEdit={() => openEdit(brand)} onDelete={() => setDeleteId(brand.id)} />
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Unmatched */}
          {unmatched.length > 0 && (
            <div className="border border-neutral-300 dark:border-white/20 rounded-none overflow-hidden">
              <div className="px-5 py-4 bg-neutral-100 dark:bg-white/5 flex items-center gap-3">
                <Tag className="h-5 w-5 text-neutral-400 dark:text-white/40" />
                <h2 className="font-display text-base font-bold uppercase tracking-[0.18em]">Unassigned</h2>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase bg-neutral-200 dark:bg-white/10 text-neutral-600 dark:text-white/60 rounded-none">{unmatched.length}</span>
              </div>
              <div className="grid gap-px bg-neutral-200 dark:bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
                {unmatched.map(brand => (
                  <BrandCard key={brand.id} brand={brand} onEdit={() => openEdit(brand)} onDelete={() => setDeleteId(brand.id)} />
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="border border-neutral-200 dark:border-white/10 p-16 text-center text-neutral-400 dark:text-white/50 space-y-3">
              <Award className="h-8 w-8 text-neutral-300 dark:text-white/20 mx-auto" />
              <p>No brands found matching your search.</p>
            </div>
          )}
        </div>
      )}

      {/* ══════ Edit / Add Modal ══════ */}
      {editOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto p-4 bg-black/70 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) closeEdit() }}>
          <div className="relative w-full max-w-2xl my-8 border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0E0E0E] shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 px-6 py-4 sticky top-0 bg-white dark:bg-[#0E0E0E] z-10">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-gold" />
                <h3 className="font-display text-xl font-bold uppercase">{form.id ? 'Edit Brand' : 'New Brand'}</h3>
              </div>
              <button type="button" onClick={closeEdit} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Success state */}
            {saveSuccess ? (
              <div className="py-16 text-center space-y-4 px-6">
                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Saved!</h4>
              </div>
            ) : (
              <div className="p-6 space-y-5">

                {/* Error banner */}
                {saveError && (
                  <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/40 text-red-500 px-4 py-3 text-xs font-mono font-bold">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{saveError}</span>
                  </div>
                )}

                {/* Division selector */}
                <div>
                  <label className={lClass}>Division *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DIVISIONS.map(div => (
                      <button
                        key={div.slug}
                        type="button"
                        onClick={() => set('division_slug', div.slug)}
                        className={`flex items-center gap-2 px-3 py-2.5 border text-[10px] font-mono font-bold uppercase tracking-wider transition-all rounded-none ${
                          form.division_slug === div.slug
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-white/60 hover:border-gold/40 bg-white dark:bg-black/30'
                        }`}
                      >
                        <div.Icon className={`h-3.5 w-3.5 ${form.division_slug === div.slug ? 'text-gold' : ''}`} />
                        <span>{div.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + Slug */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={lClass}>Brand Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(prev => ({
                        ...prev,
                        name: e.target.value,
                        // Only auto-generate slug for new brands
                        ...(prev.id ? {} : { slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') })
                      }))}
                      className={iClass}
                      placeholder="e.g. TREASURE"
                    />
                  </div>
                  <div>
                    <label className={lClass}>URL Slug {form.id ? <span className="text-neutral-400 normal-case font-normal">(locked — linked to products)</span> : '*'}</label>
                    <input
                      type="text"
                      value={form.slug}
                      readOnly={!!form.id}
                      onChange={e => !form.id && set('slug', e.target.value)}
                      className={`${iClass} ${form.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder="treasure"
                    />
                  </div>
                </div>

                {/* Tagline */}
                <div>
                  <label className={lClass}>Tagline *</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={e => set('tagline', e.target.value)}
                    className={iClass}
                    placeholder="Sleek Corporate Tailoring & Bespoke Formal Wear"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className={lClass}>Description *</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    className={iClass}
                    placeholder="A B2B overview of this brand..."
                  />
                </div>

                {/* Images */}
                {(['logo_desktop', 'logo_mobile'] as const).map(field => (
                  <div key={field}>
                    <label className={lClass}>{field === 'logo_desktop' ? 'Desktop / Banner Image' : 'Mobile / Portrait Image'}</label>
                    {form[field] && (
                      <div className="mb-2 relative h-20 w-full border border-neutral-200 dark:border-white/10 overflow-hidden bg-neutral-50 dark:bg-black/30">
                        <Image src={form[field]} alt="preview" fill className="object-cover" sizes="600px" unoptimized />
                      </div>
                    )}
                    <input
                      type="text"
                      value={form[field]}
                      onChange={e => set(field, e.target.value)}
                      className={iClass}
                      placeholder="https://... or upload below"
                    />
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-[9px] text-neutral-400 dark:text-white/30 font-mono uppercase">or upload:</span>
                      <input id={`upload-${field}`} type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e, field)} />
                      <button
                        type="button"
                        disabled={uploadingField === field}
                        onClick={() => document.getElementById(`upload-${field}`)?.click()}
                        className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold text-gold border border-gold/30 bg-gold/5 hover:bg-gold hover:text-white transition-all disabled:opacity-50 rounded-none"
                      >
                        {uploadingField === field ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                        <span>{uploadingField === field ? 'Uploading…' : 'Choose File'}</span>
                      </button>
                      {form[field] && (
                        <button
                          type="button"
                          onClick={async () => { const u = form[field]; set(field, ''); if (u) { try { await api.deleteFile(u) } catch {} } }}
                          className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[10px] font-bold text-red-500 border border-red-500/30 bg-red-50/5 hover:bg-red-500 hover:text-white transition-all rounded-none"
                        >
                          <Trash2 className="h-3 w-3" /><span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Display order + Featured */}
                <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-neutral-100 dark:border-white/5">
                  <div>
                    <label className={lClass}>Display Order</label>
                    <input
                      type="number"
                      min={1}
                      value={form.display_order}
                      onChange={e => set('display_order', parseInt(e.target.value) || 1)}
                      className={iClass}
                    />
                  </div>
                  <div className="flex items-center gap-3 h-full pt-6">
                    <input
                      type="checkbox"
                      id="featured-brand"
                      checked={form.featured}
                      onChange={e => set('featured', e.target.checked)}
                      className="h-4 w-4 accent-gold"
                    />
                    <label htmlFor="featured-brand" className="text-xs text-neutral-700 dark:text-white/80 cursor-pointer select-none">Feature on homepage</label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 flex h-12 items-center justify-center gap-2 bg-gold text-white text-xs font-bold uppercase tracking-wider hover:bg-gold/80 disabled:opacity-60 transition-all rounded-none shadow-md"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    <span>{saving ? 'Saving…' : 'Save Brand'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeEdit}
                    className="flex-1 flex h-12 items-center justify-center border border-neutral-200 text-neutral-500 hover:bg-neutral-100 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5 transition-all rounded-none text-xs font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ Delete Confirm Modal ══════ */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#0E0E0E] p-8 shadow-2xl text-center space-y-6">
            <div className="flex h-16 w-16 items-center justify-center bg-red-500/10 border border-red-500/20 mx-auto text-red-500">
              <Trash2 className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold uppercase">Remove Brand?</h3>
              <p className="mt-2 text-xs text-neutral-500 dark:text-white/60 leading-relaxed">
                This will permanently delete the brand and disassociate any linked products.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-neutral-200 dark:border-white/10 py-3 text-xs font-semibold text-neutral-700 dark:text-white/70 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 py-3 text-xs font-bold text-white hover:bg-red-600 transition-all shadow-lg">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// ─── Brand card ───────────────────────────────────────────────────────────────
function BrandCard({ brand, onEdit, onDelete }: { brand: Brand; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white dark:bg-black/20 p-5 flex flex-col gap-4 group hover:bg-neutral-50/80 dark:hover:bg-white/5 transition-all">
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-black/30">
          {brand.logo_mobile
            ? <Image src={brand.logo_mobile} alt={brand.name} fill className="object-cover" sizes="44px" unoptimized />
            : <div className="h-full w-full flex items-center justify-center text-neutral-300 dark:text-white/20 text-xs font-bold">{brand.name?.charAt(0)}</div>
          }
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-bold text-neutral-900 dark:text-white group-hover:text-gold transition-colors truncate">{brand.name}</h3>
          <span className="text-[9px] font-mono text-neutral-400 dark:text-white/40 uppercase">/{brand.slug}</span>
        </div>
        <span className="text-[9px] font-mono text-neutral-400 dark:text-white/30 flex-shrink-0">#{brand.display_order}</span>
      </div>

      <div className="space-y-1 flex-1">
        <p className="text-[11px] font-semibold text-neutral-700 dark:text-white/80 line-clamp-1">{brand.tagline}</p>
        <p className="text-[11px] leading-relaxed text-neutral-500 dark:text-white/50 line-clamp-3 font-sans font-light">{brand.description}</p>
      </div>

      {brand.featured && (
        <span className="self-start text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-gold/10 border border-gold/30 text-gold">★ Featured</span>
      )}

      <div className="flex items-center gap-2 pt-3 border-t border-neutral-200 dark:border-white/10">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 dark:text-white/70 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 transition-all"
        >
          <Edit2 className="h-3.5 w-3.5" /><span>Edit</span>
        </button>
        <button
          onClick={onDelete}
          className="flex h-9 w-9 items-center justify-center text-red-500 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
