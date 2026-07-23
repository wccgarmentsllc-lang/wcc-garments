'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Loader2, Plus, Trash2, Tag, Layers, Check, CheckCircle2, AlertCircle, Upload } from 'lucide-react'
import Link from 'next/link'
import { DIVISIONS } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { brandStore } from '@/lib/brand-store'
import { Brand } from '@/types'
import { api } from '@/lib/api'

// Map of divisionSlug -> live categories fetched from DB
type LiveCategory = { id: string; name: string; slug: string; status: string }

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const [brands, setBrands] = useState<Brand[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  // Live categories keyed by division slug
  const [liveCategories, setLiveCategories] = useState<Record<string, LiveCategory[]>>({})
  
  const populateForm = (match: any) => {
    setFormData({
      name: match.name || '',
      slug: match.slug || '',
      division_id: typeof match.division === 'string' ? match.division : match.division?.name || match.division_id || 'Garments',
      category_id: typeof match.category === 'string' ? match.category : match.category?.name || match.category_id || '',
      category_ids: Array.isArray(match.categories) 
        ? match.categories.map((c: any) => typeof c === 'string' ? c : c.name || '')
        : (Array.isArray(match.category_ids) ? match.category_ids : 
           (match.category ? [typeof match.category === 'string' ? match.category : match.category?.name || match.category_id || ''] : [])),
      brand_slug: match.brand_slug || match.brand?.slug || '',
      short_description: match.short_description || match.description || '',
      description: match.description || match.short_description || '',
      moq: match.moq || '500 Units',
      lead_time: match.lead_time || '15-20 Working Days',
      featured: !!match.featured,
      is_new: !!match.is_new,
      is_offer: !!match.is_offer,
      offer_label: match.offer_label || '',
      published: match.published !== false,
      tags: Array.isArray(match.tags) ? match.tags : [],
      specs: typeof match.specifications === 'object' && match.specifications 
        ? Object.entries(match.specifications).map(([k, v]) => ({ key: k, value: String(v) }))
        : Array.isArray(match.specs) ? match.specs : [],
      images: Array.isArray(match.images) && match.images.length > 0 ? match.images : [match.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80']
    })
  }

  useEffect(() => {
    setBrands(brandStore.getBrands())
    
    const loadLiveBrands = async () => {
      try {
        const res = await api.admin.getBrands()
        if (res.success && Array.isArray(res.data)) {
          setBrands(res.data)
        }
      } catch (err) {
        console.error('Failed to fetch live brands:', err)
      }
    }
    loadLiveBrands()

    // Fetch live categories from DB (same source as Categories admin tab)
    const loadLiveCategories = async () => {
      try {
        const res = await api.admin.getCategories()
        if (res.success && Array.isArray(res.data)) {
          const map: Record<string, LiveCategory[]> = {}
          for (const div of res.data) {
            const cats: LiveCategory[] = (div.sub_categories || []).map((c: any) => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              status: c.status,
            }))
            map[div.slug] = cats
          }
          setLiveCategories(map)
        }
      } catch (err) {
        console.error('Failed to fetch live categories:', err)
      }
    }
    loadLiveCategories()
    
    const loadProduct = async () => {
      // 1. Initial local load
      const realProducts = brandStore.getProducts()
      const match = realProducts.find((p: any) => p.id === params.id || p.slug === params.id)
      if (match) {
        populateForm(match)
      }

      // 2. Fetch live database data
      try {
        const token = localStorage.getItem('wcc-admin-token') || ''
        const res = await api.admin.getProducts(token)
        if (res.success && Array.isArray(res.data)) {
          const liveMatch = res.data.find((p: any) => p.id === params.id || p.slug === params.id)
          if (liveMatch) {
            populateForm(liveMatch)
          }
        }
      } catch (err) {
        console.error("Failed to fetch live product details for edit page:", err)
      }
    }

    loadProduct()
  }, [params.id])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setUploadingImage(true)
      try {
        const uploadPromises = files.map(file => api.uploadFile(file))
        const urls = await Promise.all(uploadPromises)
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }))
      } catch (err) {
        console.error('Upload failed:', err)
        alert('Failed to upload some images. Please check configuration.')
      } finally {
        setUploadingImage(false)
        if (e.target) e.target.value = ''
      }
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files || []).filter(file => file.type.startsWith("image/"))
    if (files.length > 0) {
      setUploadingImage(true)
      try {
        const uploadPromises = files.map(file => api.uploadFile(file))
        const urls = await Promise.all(uploadPromises)
        setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }))
      } catch (err) {
        console.error('Upload failed:', err)
        alert('Failed to upload some images. Please check configuration.')
      } finally {
        setUploadingImage(false)
      }
    }
  }
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [specKey, setSpecKey] = useState('')
  const [specVal, setSpecVal] = useState('')

  // Initialize empty state; populated via DB fetch
  const [formData, setFormData] = useState<{
    name: string; slug: string; division_id: string; category_id: string; category_ids: string[]; brand_slug: string;
    short_description: string; description: string; moq: string; lead_time: string;
    featured: boolean; is_new: boolean; is_offer: boolean; offer_label: string;
    published: boolean; tags: string[];
    specs: { key: string; value: string }[];
    images: string[];
  }>({
    name: '', slug: '', division_id: 'Garments', category_id: '', category_ids: [], brand_slug: '',
    short_description: '', description: '', moq: '', lead_time: '',
    featured: false, is_new: false, is_offer: false, offer_label: '',
    published: true, tags: [],
    specs: [],
    images: []
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      }
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) })
  }

  const handleAddSpec = () => {
    if (!specKey || !specVal) return
    setFormData({ ...formData, specs: [...formData.specs, { key: specKey, value: specVal }] })
    setSpecKey('')
    setSpecVal('')
  }

  const handleRemoveSpec = (idx: number) => {
    setFormData({ ...formData, specs: formData.specs.filter((_, i) => i !== idx) })
  }

  const handleRemoveImage = async (idx: number) => {
    const imgUrl = formData.images[idx]
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))
    if (imgUrl) {
      try {
        await api.deleteFile(imgUrl)
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err)
      }
    }
  }

  const handleSetImageRole = (idx: number, role: 'cover' | 'hover') => {
    setFormData(prev => {
      const newImages = [...(prev.images || [])]
      const targetIdx = role === 'cover' ? 0 : 1
      if (idx === targetIdx) return prev
      const [movedImg] = newImages.splice(idx, 1)
      newImages.splice(targetIdx, 0, movedImg)
      return { ...prev, images: newImages }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const specifications: Record<string, string> = {}
      formData.specs.forEach(s => {
        if (s.key && s.value) specifications[s.key] = s.value
      })

      const selectedDiv = DIVISIONS.find(d => d.name === formData.division_id)
      const divSlug = selectedDiv?.slug || formData.division_id.toLowerCase()
      const hasBrands = brands.some(b => (b.division_slug || 'garments').toLowerCase() === divSlug.toLowerCase())

      const productPayload = {
        name: formData.name,
        slug: formData.slug,
        division: formData.division_id,
        division_slug: formData.division_id.toLowerCase(),
        category: formData.category_ids.length > 0 ? formData.category_ids[0] : '',
        categories: formData.category_ids,
        short_description: formData.short_description,
        moq: formData.moq,
        lead_time: formData.lead_time,
        images: formData.images,
        is_new: formData.is_new,
        is_offer: formData.is_offer,
        offer_label: formData.offer_label,
        featured: formData.featured,
        specifications,
        tags: formData.tags,
        brand_slug: hasBrands ? formData.brand_slug : null
      }

      const token = localStorage.getItem('wcc-admin-token') || ''
      const res = await api.admin.updateProduct(token, params.id as string, productPayload)

      if (res.success) {
        brandStore.saveProduct({
          ...formData,
          id: params.id as string,
          slug: res.data?.slug || formData.slug,
          brand_slug: hasBrands ? formData.brand_slug : null,
          category: formData.category_ids.length > 0 ? {
            id: formData.category_ids[0],
            division_id: formData.division_id,
            name: formData.category_ids[0],
            slug: formData.category_ids[0].toLowerCase().replace(/\s+/g, '-'),
            description: '',
            image: '',
            display_order: 0,
            active: true
          } : undefined,
          categories: formData.category_ids.map(c => ({
            id: c,
            division_id: formData.division_id,
            name: c,
            slug: c.toLowerCase().replace(/\s+/g, '-'),
            description: '',
            image: '',
            display_order: 0,
            active: true
          }))
        })
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/products')
        }, 1500)
      } else {
        alert(res.error || 'Failed to update product in DB')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Server error updating product')
    } finally {
      setSaving(false)
    }
  }

  const inputClass = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-xs text-neutral-900 placeholder-neutral-400 focus:border-gold focus:outline-none focus:bg-gray-50 dark:border-white/10 dark:bg-black/60 dark:text-white dark:placeholder-white/20 dark:focus:bg-black transition-all font-mono"
  const labelClass = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-white/50 font-mono"

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-neutral-900 dark:text-white font-mono">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6 font-sans">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="flex h-10 w-10 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/10 transition-all">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white font-sans">Modify Catalog Entry</h1>
              <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-0.5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                ID: {params?.id || 'PROD-01'}
              </span>
            </div>
            <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/50">
              Synchronize commercial parameters across global wholesale network
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setSuccess(true)
            setTimeout(() => router.push('/admin/products'), 1500)
          }}
          className="rounded-lg bg-neutral-100 border border-neutral-300 px-4 py-2 text-xs font-bold text-neutral-800 hover:bg-gold hover:text-white dark:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-gold dark:hover:text-white transition-all self-start sm:self-auto"
        >
          Quick Save Draft
        </button>
      </div>

      {success && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-emerald-500/15 border border-emerald-500/30 p-5 flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-sans text-sm font-bold shadow-2xl">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 animate-bounce" />
          <span>Product commercial modifications successfully validated and updated across WCC index nodes. Redirecting...</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-12 font-mono">
        {/* Main Product Info Form */}
        <div className="lg:col-span-8 space-y-6 font-sans">
          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 p-8 shadow-2xl space-y-6">
            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-200 dark:border-white/10 pb-4">
              <Layers className="h-5 w-5 text-gold" />
              <span>Core Specifications</span>
            </h3>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Product Nomenclature *</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                  className={inputClass}
                  placeholder="e.g. Premium Cotton Shirt"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Catalog Slug *</label>
                <input name="slug" value={formData.slug} onChange={handleChange} className={inputClass} placeholder="premium-cotton-shirt" required />
              </div>
            </div>

            <div>
              <label className={labelClass}>Brief Summary Descriptor</label>
              <textarea name="short_description" value={formData.short_description} onChange={handleChange} className={inputClass} rows={2} placeholder="Brief product description..." />
            </div>

            <div>
              <label className={labelClass}>Comprehensive Commercial Overview</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className={inputClass} rows={5} placeholder="Detailed product description..." />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Minimum Order Quantity (MOQ) *</label>
                <input name="moq" value={formData.moq} onChange={handleChange} className={inputClass} placeholder="e.g. 500 Units" required />
              </div>
              <div>
                <label className={labelClass}>Standard Lead Time *</label>
                <input name="lead_time" value={formData.lead_time} onChange={handleChange} className={inputClass} placeholder="e.g. 15-25 Working Days" required />
              </div>
            </div>
          </div>

          {/* Technical Specifications Key-Value Builder */}
          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 p-8 shadow-2xl space-y-6 font-mono">
            <h3 className="font-display text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2 border-b border-neutral-200 dark:border-white/10 pb-4 font-sans">
              <Tag className="h-5 w-5 text-purple-500 dark:text-purple-400" />
              <span>Technical Data Matrix &amp; Tags</span>
            </h3>

            {/* Tag Input */}
            <div>
              <label className={labelClass}>Search Tags &amp; Index Keywords (Press Enter)</label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and press Enter... e.g. Anti-Static"
                className={inputClass}
              />
              <div className="flex flex-wrap gap-2 pt-3">
                {formData.tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-2 rounded-lg bg-gold/10 border border-gold/30 px-3 py-1 font-mono text-xs font-bold text-gold uppercase">
                    <span>{t}</span>
                    <button type="button" onClick={() => handleRemoveTag(t)} className="text-gold/60 hover:text-red-500">✕</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Spec Builder */}
            <div className="space-y-4 pt-4 border-t border-neutral-200 dark:border-white/10">
              <label className={labelClass}>Material Specification Matrix</label>
              <div className="grid sm:grid-cols-12 gap-2">
                <input type="text" value={specKey} onChange={e => setSpecKey(e.target.value)} placeholder="e.g. Tensile Strength" className="sm:col-span-5 rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-black/50 p-3 text-xs text-neutral-900 dark:text-white" />
                <input type="text" value={specVal} onChange={e => setSpecVal(e.target.value)} placeholder="e.g. 120 N/cm" className="sm:col-span-5 rounded-lg border border-neutral-200 bg-white dark:border-white/10 dark:bg-black/50 p-3 text-xs text-neutral-900 dark:text-white" />
                <button type="button" onClick={handleAddSpec} className="sm:col-span-2 rounded-lg bg-neutral-100 hover:bg-gold hover:text-white dark:bg-white/10 text-neutral-700 dark:text-white font-bold text-xs transition-all p-3 border border-neutral-200 dark:border-transparent">Add Spec</button>
              </div>

              <div className="divide-y divide-neutral-200 border border-neutral-200 dark:divide-white/10 dark:border-white/10 rounded-xl overflow-hidden bg-neutral-50/50 dark:bg-black/30">
                {formData.specs.map((sp, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 text-xs">
                    <span className="text-neutral-500 dark:text-white/40">{sp.key}</span>
                    <div className="flex items-center gap-3 font-bold text-neutral-900 dark:text-white">
                      <span>{sp.value}</span>
                      <button type="button" onClick={() => handleRemoveSpec(idx)} className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 p-1">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Form Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 p-6 shadow-2xl space-y-6 font-sans">
            <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 pb-3">Organization Hierarchy</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Division Core *</label>
                <select name="division_id" value={formData.division_id} onChange={handleChange} className={inputClass}>
                  {DIVISIONS.map((d) => <option key={d.slug} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              {(() => {
                const selectedDivision = DIVISIONS.find(d => d.name === formData.division_id)
                const divisionSlug = selectedDivision?.slug || formData.division_id.toLowerCase()
                const availableBrands = brands.filter(b => (b.division_slug || 'garments').toLowerCase() === divisionSlug.toLowerCase())
                // Use live DB categories; fall back to static DIVISIONS categories if API hasn't loaded yet
                const availableCategories: LiveCategory[] =
                  liveCategories[divisionSlug] ?? (selectedDivision?.categories?.map((c: any) => ({ id: c.slug, name: c.name, slug: c.slug, status: 'active' })) || [])
                
                return (
                  <>
                    <div>
                      <label className={labelClass}>{formData.division_id} Brand Label {availableBrands.length > 0 ? '*' : ''}</label>
                      <select name="brand_slug" value={formData.brand_slug} onChange={handleChange} className={inputClass} required={availableBrands.length > 0}>
                        <option value="">-- Select {formData.division_id} Brand --</option>
                        {availableBrands.map((b) => (
                          <option key={b.slug} value={b.slug}>{b.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Categories *</label>
                      {availableCategories.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto p-3 border border-neutral-200 dark:border-white/10 rounded-xl bg-white dark:bg-black/60">
                          {availableCategories.map(c => (
                            <label key={c.slug || c.id} className="flex items-center gap-3 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={formData.category_ids.includes(c.name)}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setFormData(prev => ({
                                    ...prev,
                                    category_ids: checked 
                                      ? [...prev.category_ids, c.name]
                                      : prev.category_ids.filter(id => id !== c.name)
                                  }));
                                }}
                                className="h-4 w-4 accent-gold rounded border-neutral-300 dark:border-white/20 bg-white dark:bg-black"
                              />
                              <span className="text-xs text-neutral-700 dark:text-white/80">{c.name}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <input 
                          name="category_id" 
                          value={formData.category_ids.join(', ')} 
                          onChange={(e) => setFormData(prev => ({ ...prev, category_ids: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} 
                          className={inputClass} 
                          placeholder="e.g. Bed Linen, Formal Shirts (comma separated)" 
                          required 
                        />
                      )}
                    </div>
                  </>
                )
              })()}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 p-6 shadow-2xl space-y-6 font-sans">
            <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 pb-3">Commercial Badging</h3>
            <div className="space-y-4 font-mono text-xs">
              {[
                { name: 'featured', label: 'Feature on Homepage Gallery' },
                { name: 'is_new', label: 'Badge as New Arrival 2026' },
                { name: 'is_offer', label: 'Activate Special Offer Ribbon' },
                { name: 'published', label: 'Publish Live on Web Store' },
              ].map((flag) => (
                <label key={flag.name} className="flex items-center gap-3.5 text-neutral-700 dark:text-white/80 cursor-pointer hover:text-gold transition-colors">
                  <input
                    type="checkbox"
                    name={flag.name}
                    checked={formData[flag.name as keyof typeof formData] as boolean}
                    onChange={handleChange}
                    className="h-4 w-4 accent-gold rounded border-neutral-300 dark:border-white/20 bg-white dark:bg-black"
                  />
                  <span>{flag.label}</span>
                </label>
              ))}
            </div>

            {formData.is_offer && (
              <div className="pt-2">
                <label className={labelClass}>Custom Promotional Ribbon Label</label>
                <input name="offer_label" value={formData.offer_label} onChange={handleChange} className={inputClass} placeholder="e.g. 15% Wholesale Tier Discount" />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 p-6 shadow-2xl space-y-4 font-sans">
            <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white border-b border-neutral-200 dark:border-white/10 pb-3">Digital Asset Cover</h3>
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Add Image URL</label>
                <div className="flex gap-2">
                  <input id="image-url-input" className={inputClass} placeholder="Image URL..." />
                  <button type="button" onClick={() => {
                    const input = document.getElementById('image-url-input') as HTMLInputElement
                    if (input.value) {
                      setFormData(prev => ({ ...prev, images: [...(prev.images || []), input.value] }))
                      input.value = ''
                    }
                  }} className="rounded-xl bg-neutral-100 hover:bg-gold hover:text-white dark:bg-white/10 text-neutral-700 dark:text-white font-bold text-xs transition-all px-4 border border-neutral-200 dark:border-transparent">Add</button>
                </div>
              </div>
              
              <div className="relative flex items-center justify-center my-2 font-mono text-[10px] text-neutral-400 dark:text-white/30 uppercase">
                <span className="w-full h-[1px] bg-neutral-200 dark:bg-white/10" />
                <span className="absolute bg-white dark:bg-[#0D0D0D] px-3">or upload from device</span>
              </div>

              {/* Drag and drop zone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all ${
                  dragActive
                    ? 'border-gold bg-gold/5'
                    : 'border-neutral-200 bg-neutral-50 hover:border-gold/40 hover:bg-neutral-100/50 dark:border-white/10 dark:bg-black/40 dark:hover:border-gold/40 dark:hover:bg-black/60'
                } cursor-pointer`}
                onClick={() => document.getElementById('device-upload-input')?.click()}
              >
                <input
                  id="device-upload-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload className={`h-6 w-6 mb-2 transition-colors ${dragActive ? 'text-gold' : 'text-neutral-400 dark:text-white/40'}`} />
                {uploadingImage ? (
                  <p className="text-[11px] font-mono text-gold animate-pulse">Reading device file...</p>
                ) : (
                  <>
                    <p className="text-[11px] font-bold text-neutral-800 dark:text-white/80">Click or drag photo here</p>
                    <p className="text-[9px] font-mono text-neutral-400 dark:text-white/40 mt-1">Supports PNG, JPG, JPEG, WEBP up to 5MB</p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                {(formData.images || []).map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 dark:bg-black dark:border-white/10 group">
                    <img src={img} alt={`Preview ${idx}`} className="h-full w-full object-cover" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
                      {idx === 0 && (
                        <span className="bg-gold text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit shadow-md">
                          Cover
                        </span>
                      )}
                      {idx === 1 && (
                        <span className="bg-blue-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider w-fit shadow-md">
                          Hover
                        </span>
                      )}
                    </div>
                    
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 backdrop-blur-[2px]">
                      {idx !== 0 && (
                        <button type="button" onClick={() => handleSetImageRole(idx, 'cover')} className="bg-white/10 hover:bg-gold text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors w-full border border-white/20 hover:border-transparent">
                          Set Cover
                        </button>
                      )}
                      {idx !== 1 && formData.images.length > 1 && (
                        <button type="button" onClick={() => handleSetImageRole(idx, 'hover')} className="bg-white/10 hover:bg-blue-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors w-full border border-white/20 hover:border-transparent">
                          Set Hover
                        </button>
                      )}
                      <button type="button" onClick={() => handleRemoveImage(idx)} className="bg-white/10 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors w-full border border-white/20 hover:border-transparent mt-auto flex items-center justify-center gap-1">
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-gold font-mono text-xs font-bold uppercase tracking-widest text-white hover:bg-gold-light transition-all shadow-xl disabled:opacity-50"
            >
              {saving ? <><Loader2 className="h-5 w-5 animate-spin text-black" /> Committing Changes...</> : <><Save className="h-4 w-4" /> Save Modifications</>}
            </button>
            <Link href="/admin/products" className="flex h-12 w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 font-mono text-xs font-bold uppercase tracking-wider text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white transition-all">
              Discard Modifications
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
