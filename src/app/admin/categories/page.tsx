'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, X, HelpCircle, Loader2, Upload, Shirt, Home, Briefcase, Sparkles, Building2, LayoutGrid } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'
import { DIVISIONS } from '@/lib/constants'

// ── Types ──────────────────────────────────────────────────────────────────────
type ItemStatus = 'active' | 'coming-soon' | 'hidden'

interface SubCatItem {
  id: string
  name: string
  slug: string
  status: ItemStatus
  displayOrder: number
  image?: string
}
interface CatItem {
  id: string
  divisionSlug: string
  divisionName: string
  name: string
  slug: string
  status: ItemStatus
  displayOrder: number
  subCategories: SubCatItem[]
  image?: string
}

const STATUS_STYLES: Record<ItemStatus, string> = {
  active:         'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  'coming-soon':  'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  hidden:         'bg-neutral-200 text-neutral-600 dark:bg-neutral-700/30 dark:text-neutral-400 border-neutral-300 dark:border-neutral-600/30',
}
const STATUS_LABELS: Record<ItemStatus, string> = {
  active: 'Active', 'coming-soon': 'Coming Soon', hidden: 'Hidden',
}

const getDivisionIcon = (slug: string) => {
  switch (slug) {
    case 'garments': return Shirt
    case 'uniforms': return Briefcase
    case 'hospitality': return Building2
    case 'home': return Home
    case 'fragrance': return Sparkles
    case 'households': return Home
    default: return LayoutGrid
  }
}

// removed SECTION_SLUGS

// ── Empty form state ───────────────────────────────────────────────────────────
const EMPTY_CAT = { divisionSlug: 'garments', name: '', slug: '', status: 'active' as ItemStatus, image: '' }
const EMPTY_SUB = { name: '', slug: '', status: 'active' as ItemStatus, image: '' }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CatItem[]>([])
  const [divisionsData, setDivisionsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [section, setSection] = useState<string>('all')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  // Category modal
  const [catModal, setCatModal] = useState<'add' | 'edit' | null>(null)
  const [editingCat, setEditingCat] = useState<CatItem | null>(null)
  const [catForm, setCatForm] = useState(EMPTY_CAT)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState<'cat' | 'sub' | 'div' | null>(null)

  // Sub-category modal
  const [subModal, setSubModal] = useState<'add' | 'edit' | null>(null)
  const [subParentId, setSubParentId] = useState<string | null>(null)
  const [editingSubId, setEditingSubId] = useState<string | null>(null)
  const [subForm, setSubForm] = useState(EMPTY_SUB)

  // Drag and drop states
  const [dragActiveCat, setDragActiveCat] = useState(false)
  const [dragActiveSub, setDragActiveSub] = useState(false)
  const [dragActiveDiv, setDragActiveDiv] = useState(false)

  // Division modal states
  const [divModal, setDivModal] = useState(false)
  const [editingDiv, setEditingDiv] = useState<any | null>(null)
  const [divForm, setDivForm] = useState({ id: '', name: '', image: '' })

  const handleDragDiv = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveDiv(true)
    } else if (e.type === "dragleave") {
      setDragActiveDiv(false)
    }
  }

  const handleDropDiv = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveDiv(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setUploadingImage('div' as any)
      try {
        const url = await api.uploadFile(file)
        setDivForm(prev => ({ ...prev, image: url }))
      } catch (err) {
        console.error('Upload failed:', err)
        alert('Failed to upload image. Please check Supabase configuration.')
      } finally {
        setUploadingImage(null)
      }
    }
  }

  const openEditDiv = (div: any) => {
    setEditingDiv(div)
    setDivForm({ id: div.id, name: div.name, image: div.image || '' })
    setDivModal(true)
  }

  const saveDiv = async () => {
    if (!divForm.id) return
    setSaving(true)
    try {
      await api.admin.updateCategory(undefined, divForm.id, { image: divForm.image })
      
      // Update divisionsData in local state
      setDivisionsData(prev => prev.map(d => d.id === divForm.id ? { ...d, image: divForm.image } : d))
      
      // Refresh list
      fetchCategories()
      setDivModal(false)
    } catch (err) {
      console.error('Failed to save division image:', err)
      alert('Failed to save division image.')
    } finally {
      setSaving(false)
    }
  }

  const handleDragCat = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveCat(true)
    } else if (e.type === "dragleave") {
      setDragActiveCat(false)
    }
  }

  const handleDropCat = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveCat(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setUploadingImage('cat')
      try {
        const url = await api.uploadFile(file)
        setCatForm(prev => ({ ...prev, image: url }))
      } catch (err) {
        console.error('Upload failed:', err)
        alert('Failed to upload image. Please check Supabase configuration.')
      } finally {
        setUploadingImage(null)
      }
    }
  }

  const handleDragSub = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActiveSub(true)
    } else if (e.type === "dragleave") {
      setDragActiveSub(false)
    }
  }

  const handleDropSub = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActiveSub(false)
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      setUploadingImage('sub')
      try {
        const url = await api.uploadFile(file)
        setSubForm(prev => ({ ...prev, image: url }))
      } catch (err) {
        console.error('Upload failed:', err)
        alert('Failed to upload image. Please check Supabase configuration.')
      } finally {
        setUploadingImage(null)
      }
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await api.admin.getCategories()
      if (res.success && res.data) {
        setDivisionsData(res.data)
        const result: CatItem[] = []
        for (const div of res.data) {
          for (const cat of (div.sub_categories ?? [])) {
            result.push({
              id: cat.id,
              divisionSlug: div.slug,
              divisionName: div.name,
              name: cat.name,
              slug: cat.slug,
              status: cat.status as ItemStatus,
              displayOrder: cat.displayOrder || cat.display_order,
              image: cat.image,
              subCategories: (cat.subCategories || cat.sub_categories || []).map((s: any) => ({
                id: s.id, name: s.name, slug: s.slug,
                status: s.status as ItemStatus, displayOrder: s.displayOrder || s.display_order,
                image: s.image
              })),
            })
          }
        }
        setCategories(result)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cat' | 'sub' | 'div') => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingImage(type as any)
      try {
        const url = await api.uploadFile(file)
        if (type === 'cat') {
          setCatForm(prev => ({ ...prev, image: url }))
        } else if (type === 'sub') {
          setSubForm(prev => ({ ...prev, image: url }))
        } else {
          setDivForm(prev => ({ ...prev, image: url }))
        }
      } catch (err) {
        console.error('Upload failed:', err)
        alert('Failed to upload image. Please check Supabase configuration.')
      } finally {
        setUploadingImage(null)
      }
    }
  }

  // ── Filtered view ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (section === 'all') return categories
    return categories.filter((c) => c.divisionSlug === section)
  }, [categories, section])

  const grouped = useMemo(() => {
    const map = new Map<string, { divisionName: string; items: CatItem[] }>()
    for (const cat of filtered) {
      if (!map.has(cat.divisionSlug)) map.set(cat.divisionSlug, { divisionName: cat.divisionName, items: [] })
      map.get(cat.divisionSlug)!.items.push(cat)
    }
    return map
  }, [filtered])

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const toggleExpand = (id: string) => setExpanded((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  const divOptions = divisionsData.map((d) => ({ slug: d.slug, name: d.name }))

  // ── Category CRUD ────────────────────────────────────────────────────────────
  const openAddCat = () => { setCatForm(EMPTY_CAT); setEditingCat(null); setCatModal('add') }
  const openEditCat = (c: CatItem) => { setEditingCat(c); setCatForm({ divisionSlug: c.divisionSlug, name: c.name, slug: c.slug, status: c.status, image: c.image || '' }); setCatModal('edit') }

  const syncDivisionToDB = async (divisionSlug: string, updatedCategories: any[]) => {
    const div = divisionsData.find(d => d.slug === divisionSlug)
    if (div && div.id) {
      await api.admin.updateCategory(undefined, div.id, { sub_categories: updatedCategories })
    }
  }

  const saveCat = async () => {
    if (!catForm.name || !catForm.slug) return
    setSaving(true)
    
    let updatedList = [...categories]
    if (catModal === 'add') {
      const newCat: CatItem = {
        id: `CAT-${Date.now()}`, divisionSlug: catForm.divisionSlug,
        divisionName: divOptions.find((d) => d.slug === catForm.divisionSlug)?.name ?? catForm.divisionSlug,
        name: catForm.name, slug: catForm.slug, status: catForm.status, image: catForm.image,
        displayOrder: categories.filter((c) => c.divisionSlug === catForm.divisionSlug).length + 1,
        subCategories: [],
      }
      updatedList.push(newCat)
    } else if (catModal === 'edit' && editingCat) {
      updatedList = categories.map((c) => c.id === editingCat.id ? { ...c, ...catForm, divisionName: divOptions.find((d) => d.slug === catForm.divisionSlug)?.name ?? catForm.divisionSlug } : c)
    }
    
    // Extract just the categories for this division to save to DB
    const divCats = updatedList.filter(c => c.divisionSlug === catForm.divisionSlug).map(c => ({
      id: c.id, name: c.name, slug: c.slug, status: c.status, displayOrder: c.displayOrder, subCategories: c.subCategories, image: c.image
    }))
    
    await syncDivisionToDB(catForm.divisionSlug, divCats)
    setCategories(updatedList)
    setSaving(false)
    setCatModal(null)
  }

  const deleteCat = async (id: string, divSlug: string) => {
    if (!confirm('Remove this category? Sub-categories will also be removed.')) return
    const updatedList = categories.filter((c) => c.id !== id)
    
    const divCats = updatedList.filter(c => c.divisionSlug === divSlug).map(c => ({
      id: c.id, name: c.name, slug: c.slug, status: c.status, displayOrder: c.displayOrder, subCategories: c.subCategories, image: c.image
    }))
    await syncDivisionToDB(divSlug, divCats)
    setCategories(updatedList)
  }

  const toggleCatStatus = async (id: string, divSlug: string) => {
    const updatedList = categories.map((c) => {
      if (c.id !== id) return c
      const next: ItemStatus = c.status === 'active' ? 'coming-soon' : c.status === 'coming-soon' ? 'hidden' : 'active'
      return { ...c, status: next }
    })
    
    const divCats = updatedList.filter(c => c.divisionSlug === divSlug).map(c => ({
      id: c.id, name: c.name, slug: c.slug, status: c.status, displayOrder: c.displayOrder, subCategories: c.subCategories, image: c.image
    }))
    await syncDivisionToDB(divSlug, divCats)
    setCategories(updatedList)
  }

  // ── Sub-category CRUD ─────────────────────────────────────────────────────────
  const openAddSub = (parentId: string) => { setSubParentId(parentId); setEditingSubId(null); setSubForm(EMPTY_SUB); setSubModal('add') }
  const openEditSub = (parentId: string, sub: SubCatItem) => { setSubParentId(parentId); setEditingSubId(sub.id); setSubForm({ name: sub.name, slug: sub.slug, status: sub.status, image: sub.image || '' }); setSubModal('edit') }

  const saveSub = async () => {
    if (!subForm.name || !subForm.slug || !subParentId) return
    setSaving(true)
    
    let targetCat: CatItem | undefined
    
    const updatedList = categories.map((c) => {
      if (c.id !== subParentId) return c
      let newCat = { ...c }
      if (subModal === 'add') {
        const newSub: SubCatItem = { id: `SUB-${Date.now()}`, name: subForm.name, slug: subForm.slug, status: subForm.status, displayOrder: c.subCategories.length + 1, image: subForm.image }
        newCat = { ...c, subCategories: [...c.subCategories, newSub] }
      } else if (subModal === 'edit' && editingSubId) {
        newCat = { ...c, subCategories: c.subCategories.map((s) => s.id === editingSubId ? { ...s, ...subForm } : s) }
      }
      targetCat = newCat
      return newCat
    })
    
    if (targetCat) {
      const divCats = updatedList.filter(c => c.divisionSlug === targetCat!.divisionSlug).map(c => ({
        id: c.id, name: c.name, slug: c.slug, status: c.status, displayOrder: c.displayOrder, subCategories: c.subCategories, image: c.image
      }))
      await syncDivisionToDB(targetCat.divisionSlug, divCats)
    }
    
    setCategories(updatedList)
    setSaving(false)
    setSubModal(null)
  }

  const deleteSub = async (parentId: string, subId: string) => {
    if (!confirm('Remove this sub-category?')) return
    
    let divSlug = ''
    const updatedList = categories.map((c) => {
      if (c.id === parentId) {
        divSlug = c.divisionSlug
        return { ...c, subCategories: c.subCategories.filter((s) => s.id !== subId) }
      }
      return c
    })
    
    if (divSlug) {
      const divCats = updatedList.filter(c => c.divisionSlug === divSlug).map(c => ({
        id: c.id, name: c.name, slug: c.slug, status: c.status, displayOrder: c.displayOrder, subCategories: c.subCategories, image: c.image
      }))
      await syncDivisionToDB(divSlug, divCats)
    }
    setCategories(updatedList)
  }

  const toggleSubStatus = async (parentId: string, subId: string) => {
    let divSlug = ''
    const updatedList = categories.map((c) => {
      if (c.id !== parentId) return c
      divSlug = c.divisionSlug
      return { ...c, subCategories: c.subCategories.map((s) => {
        if (s.id !== subId) return s
        const next: ItemStatus = s.status === 'active' ? 'coming-soon' : s.status === 'coming-soon' ? 'hidden' : 'active'
        return { ...s, status: next }
      })}
    })
    
    if (divSlug) {
      const divCats = updatedList.filter(c => c.divisionSlug === divSlug).map(c => ({
        id: c.id, name: c.name, slug: c.slug, status: c.status, displayOrder: c.displayOrder, subCategories: c.subCategories, image: c.image
      }))
      await syncDivisionToDB(divSlug, divCats)
    }
    setCategories(updatedList)
  }

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const totalCats = categories.length
  const totalSubs = categories.reduce((a, c) => a + c.subCategories.length, 0)
  const activeCats = categories.filter((c) => c.status === 'active').length
  const comingSoon = categories.filter((c) => c.status === 'coming-soon').length

  // ── Form field helpers ────────────────────────────────────────────────────────
  const inputCls = 'w-full rounded-none border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 focus:border-gold focus:outline-none dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/20'
  const selectCls = 'w-full rounded-none border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 focus:border-gold focus:outline-none dark:border-white/10 dark:bg-black dark:text-white'
  const labelCls = 'mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-white/40'

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-neutral-900 dark:text-white">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Category & Sub-Category Manager</h1>
            <span className="bg-gold/10 border border-gold/30 px-3 py-0.5 font-mono text-xs font-bold text-gold">Live Control</span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/40">Manage all division categories and sub-categories. Changes reflect across the site and API instantly.</p>
        </div>
        <button onClick={openAddCat} className="flex items-center gap-2 bg-gold px-5 py-2.5 font-mono text-xs font-bold text-white hover:bg-gold/90 transition-all shrink-0">
          <Plus className="h-3.5 w-3.5" /> Add Category
        </button>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Categories', value: totalCats },
          { label: 'Sub-Categories', value: totalSubs },
          { label: 'Active', value: activeCats },
          { label: 'Coming Soon', value: comingSoon },
        ].map((s) => (
          <div key={s.label} className="border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 shadow-sm">
            <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 dark:text-white/30">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold text-neutral-900 dark:text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Guide ── */}
      <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-4 flex items-start gap-3">
        <HelpCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <div className="font-mono text-xs text-neutral-600 dark:text-white/60 space-y-1">
          <p className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[10px]">How it works</p>
          <p>• Click <strong className="text-gold">chevron ›</strong> on any category to expand sub-categories.</p>
          <p>• Click <strong className="text-gold">status badge</strong> to cycle: Active → Coming Soon → Hidden.</p>
          <p>• Click <strong className="text-gold">+ Sub</strong> inside any category to add a new sub-category.</p>
          <p>• <strong className="text-gold">Adding future items:</strong> just click "Add Category" or "+ Sub" — set status to Coming Soon until ready.</p>
        </div>
      </div>

      {/* ── Section Tabs ── */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-white/10 pb-4">
        <button
          onClick={() => setSection('all')}
          className={`px-4 py-2 flex items-center gap-2 font-mono text-xs font-bold uppercase border transition-all ${section === 'all' ? 'bg-gold border-gold text-white' : 'border-neutral-200 text-neutral-500 hover:text-neutral-950 dark:border-white/10 dark:text-white/50 dark:hover:text-white'}`}
        >
          All ({totalCats})
        </button>
        {DIVISIONS.map((div) => {
          const Icon = getDivisionIcon(div.slug)
          return (
            <button
              key={div.slug}
              onClick={() => setSection(div.slug)}
              className={`px-4 py-2 flex items-center gap-2 font-mono text-xs font-bold uppercase border transition-all ${section === div.slug ? 'bg-gold border-gold text-white' : 'border-neutral-200 text-neutral-500 hover:text-neutral-950 dark:border-white/10 dark:text-white/50 dark:hover:text-white'}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {div.name}
            </button>
          )
        })}
      </div>

      {/* ── Category Groups ── */}
      <div className="space-y-8">
        {Array.from(grouped.entries()).map(([divSlug, { divisionName, items }]) => {
          const div = divisionsData.find(d => d.slug === divSlug)
          return (
            <div key={divSlug}>
              {/* Division header */}
              <div className="flex items-center justify-between border-l-4 border-gold pl-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-bold uppercase text-neutral-900 dark:text-white">{divisionName}</h2>
                    {div && (
                      <button
                        onClick={() => openEditDiv(div)}
                        className="text-neutral-400 hover:text-gold transition-colors p-1"
                        title={`Edit ${divisionName} Image`}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="font-mono text-[10px] text-neutral-400 dark:text-white/30">{items.length} categories · {items.reduce((a, c) => a + c.subCategories.length, 0)} sub-categories</p>
                </div>
              <button
                onClick={() => { setCatForm({ ...EMPTY_CAT, divisionSlug: divSlug }); setEditingCat(null); setCatModal('add') }}
                className="flex items-center gap-1.5 border border-neutral-200 bg-white dark:border-white/15 dark:bg-white/5 px-3 py-1.5 font-mono text-[10px] font-bold text-neutral-700 dark:text-white hover:bg-gold hover:text-white dark:hover:text-white transition-all shadow-sm"
              >
                <Plus className="h-3 w-3" /> Add to {divisionName}
              </button>
            </div>

            {/* Category cards */}
            <div className="space-y-3">
              {loading ? (
                <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 text-gold animate-spin" /></div>
              ) : items.sort((a, b) => a.displayOrder - b.displayOrder).map((cat) => (
                <div key={cat.id} className="border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.03] hover:border-neutral-300 dark:hover:border-white/20 transition-all shadow-sm">
                  {/* Category row */}
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button onClick={() => toggleExpand(cat.id)} className="text-neutral-400 hover:text-neutral-600 dark:text-white/40 dark:hover:text-white transition-colors shrink-0">
                      {expanded.has(cat.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[9px] text-neutral-400 dark:text-white/30">{cat.id}</span>
                        <span className="font-body text-sm font-semibold text-neutral-900 dark:text-white">{cat.name}</span>
                        <span className="font-mono text-[10px] text-neutral-400 dark:text-white/30">/products/{cat.divisionSlug}/{cat.slug}</span>
                      </div>
                      <p className="font-mono text-[9px] text-neutral-400 dark:text-white/20 mt-0.5">{cat.subCategories.length} sub-categories</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status toggle badge */}
                      <button
                        onClick={() => toggleCatStatus(cat.id, cat.divisionSlug)}
                        title="Click to cycle status"
                        className={`px-2.5 py-0.5 font-mono text-[8px] font-bold uppercase border transition-all cursor-pointer hover:opacity-80 ${STATUS_STYLES[cat.status]}`}
                      >
                        {STATUS_LABELS[cat.status]}
                      </button>
                      <button onClick={() => openAddSub(cat.id)} className="flex items-center gap-1 border border-neutral-200 bg-neutral-50 dark:border-white/15 dark:bg-white/5 px-2.5 py-1 font-mono text-[9px] font-bold text-neutral-700 dark:text-white hover:bg-gold hover:text-white dark:hover:text-white transition-all">
                        <Plus className="h-3 w-3" /> Sub
                      </button>
                      <button onClick={() => openEditCat(cat)} className="flex h-7 w-7 items-center justify-center border border-gold/20 bg-gold/10 text-gold hover:bg-gold hover:text-white transition-colors">
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button onClick={() => deleteCat(cat.id, cat.divisionSlug)} className="flex h-7 w-7 items-center justify-center border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-categories expanded */}
                  <AnimatePresence>
                    {expanded.has(cat.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-t border-neutral-100 dark:border-white/[0.06]"
                      >
                        <div className="px-4 py-3 space-y-2 bg-neutral-50/50 dark:bg-white/[0.02]">
                          <p className="font-mono text-[9px] uppercase tracking-widest text-neutral-400 dark:text-white/20 mb-2">Sub-Categories</p>
                          {cat.subCategories.length === 0 && (
                            <p className="font-mono text-[10px] text-neutral-400 dark:text-white/20 italic">No sub-categories yet. Click "+ Sub" to add one.</p>
                          )}
                          {cat.subCategories.sort((a, b) => a.displayOrder - b.displayOrder).map((sub) => (
                            <div key={sub.id} className="flex items-center gap-3 pl-4 border-l border-neutral-200 dark:border-white/10">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-[8px] text-neutral-400 dark:text-white/20">{sub.id}</span>
                                  <span className="font-body text-xs text-neutral-700 dark:text-white/80">{sub.name}</span>
                                  <span className="font-mono text-[9px] text-neutral-400 dark:text-white/20">/.../{sub.slug}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => toggleSubStatus(cat.id, sub.id)}
                                  className={`px-2 py-0.5 font-mono text-[8px] font-bold uppercase border cursor-pointer hover:opacity-80 transition-all ${STATUS_STYLES[sub.status]}`}
                                >
                                  {STATUS_LABELS[sub.status]}
                                </button>
                                <button onClick={() => openEditSub(cat.id, sub)} className="flex h-6 w-6 items-center justify-center border border-gold/20 bg-gold/10 text-gold hover:bg-gold hover:text-white transition-colors">
                                  <Edit2 className="h-3 w-3" />
                                </button>
                                <button onClick={() => deleteSub(cat.id, sub.id)} className="flex h-6 w-6 items-center justify-center border border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
          )
        })}
      </div>

      {/* ── Category Modal ── */}
      <AnimatePresence>
        {catModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md flex flex-col border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#0D0D0D] shadow-2xl text-neutral-900 dark:text-white"
              style={{ maxHeight: 'calc(100vh - 2rem)' }}>
              {/* Sticky Header */}
              <div className="flex-shrink-0 flex items-center justify-between border-b border-neutral-200 dark:border-white/10 px-7 py-5">
                <h3 className="font-display text-lg font-bold uppercase text-neutral-900 dark:text-white">
                  {catModal === 'add' ? 'Add Category' : 'Edit Category'}
                </h3>
                <button onClick={() => setCatModal(null)} className="text-neutral-400 hover:text-neutral-600 dark:text-white/40 dark:hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">
                <div>
                  <label className={labelCls}>Division</label>
                  <select value={catForm.divisionSlug} onChange={(e) => setCatForm({ ...catForm, divisionSlug: e.target.value })} className={selectCls}>
                    {divOptions.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category Name *</label>
                  <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: toSlug(e.target.value) })} placeholder="e.g. Kitchen" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>URL Slug *</label>
                  <input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: toSlug(e.target.value) })} placeholder="kitchen" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select value={catForm.status} onChange={(e) => setCatForm({ ...catForm, status: e.target.value as ItemStatus })} className={selectCls}>
                    <option value="active">Active</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Category Image</label>
                  
                  {catForm.image ? (
                    <div className="relative aspect-video w-full rounded-none overflow-hidden bg-neutral-100 border border-neutral-200 dark:bg-black dark:border-white/10 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={catForm.image} alt="Category preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={async () => {
                            const imgUrl = catForm.image
                            setCatForm(prev => ({ ...prev, image: '' }))
                            if (imgUrl) {
                              try {
                                await api.deleteFile(imgUrl)
                              } catch (err) {
                                console.error('Failed to delete file from Cloudinary:', err)
                              }
                            }
                          }}
                          className="bg-white/10 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-none transition-all border border-white/20 hover:border-transparent flex items-center gap-1 font-mono uppercase tracking-wider"
                        >
                          <Trash2 className="h-3 w-3" /> Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDragCat}
                      onDragOver={handleDragCat}
                      onDragLeave={handleDragCat}
                      onDrop={handleDropCat}
                      onClick={() => document.getElementById('cat-device-upload-input')?.click()}
                      className={`relative border border-dashed p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        dragActiveCat
                          ? 'border-gold bg-gold/5'
                          : 'border-neutral-200 bg-neutral-50 hover:border-gold/40 hover:bg-neutral-100/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-gold/40 dark:hover:bg-white/[0.08]'
                      }`}
                    >
                      <input
                        id="cat-device-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'cat')}
                        className="hidden"
                      />
                      <Upload className={`h-5 w-5 mb-2 transition-colors ${dragActiveCat ? 'text-gold' : 'text-neutral-400 dark:text-white/40'}`} />
                      {uploadingImage === 'cat' ? (
                        <p className="text-[10px] font-mono text-gold animate-pulse">Uploading asset...</p>
                      ) : (
                        <>
                          <p className="text-[10px] font-bold text-neutral-800 dark:text-white/80 uppercase tracking-wide">Click or drag image here</p>
                          <p className="text-[8px] font-mono text-neutral-400 dark:text-white/40 mt-1">PNG, JPG, JPEG, WEBP up to 5MB</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Manual input fallback */}
                  <div className="mt-3">
                    <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-white/30 font-mono">Or enter image URL</label>
                    <input
                      value={catForm.image}
                      onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                      placeholder="https://example.com/image.png"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
              {/* Sticky Footer */}
              <div className="flex-shrink-0 flex gap-3 border-t border-neutral-200 dark:border-white/10 px-7 py-5">
                <button onClick={() => setCatModal(null)} className="flex-1 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5 transition-all py-2.5 font-mono text-xs">Cancel</button>
                <button disabled={saving} onClick={saveCat} className="flex-1 flex justify-center items-center gap-2 bg-gold py-2.5 font-mono text-xs font-bold text-white hover:bg-gold/90 transition-all">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  {catModal === 'add' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Sub-Category Modal ── */}
      <AnimatePresence>
        {subModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md flex flex-col border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#0D0D0D] shadow-2xl text-neutral-900 dark:text-white"
              style={{ maxHeight: 'calc(100vh - 2rem)' }}>
              {/* Sticky Header */}
              <div className="flex-shrink-0 flex items-center justify-between border-b border-neutral-200 dark:border-white/10 px-7 py-5">
                <h3 className="font-display text-lg font-bold uppercase text-neutral-900 dark:text-white">
                  {subModal === 'add' ? 'Add Sub-Category' : 'Edit Sub-Category'}
                </h3>
                <button onClick={() => setSubModal(null)} className="text-neutral-400 hover:text-neutral-600 dark:text-white/40 dark:hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">
                <div>
                  <label className={labelCls}>Sub-Category Name *</label>
                  <input value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value, slug: toSlug(e.target.value) })} placeholder="e.g. Cutlery" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>URL Slug *</label>
                  <input value={subForm.slug} onChange={(e) => setSubForm({ ...subForm, slug: toSlug(e.target.value) })} placeholder="cutlery" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Status</label>
                  <select value={subForm.status} onChange={(e) => setSubForm({ ...subForm, status: e.target.value as ItemStatus })} className={selectCls}>
                    <option value="active">Active</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Sub-Category Image</label>
                  
                  {subForm.image ? (
                    <div className="relative aspect-video w-full rounded-none overflow-hidden bg-neutral-100 border border-neutral-200 dark:bg-black dark:border-white/10 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={subForm.image} alt="Sub-category preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={async () => {
                            const imgUrl = subForm.image
                            setSubForm(prev => ({ ...prev, image: '' }))
                            if (imgUrl) {
                              try {
                                await api.deleteFile(imgUrl)
                              } catch (err) {
                                console.error('Failed to delete file from Cloudinary:', err)
                              }
                            }
                          }}
                          className="bg-white/10 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-none transition-all border border-white/20 hover:border-transparent flex items-center gap-1 font-mono uppercase tracking-wider"
                        >
                          <Trash2 className="h-3 w-3" /> Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDragSub}
                      onDragOver={handleDragSub}
                      onDragLeave={handleDragSub}
                      onDrop={handleDropSub}
                      onClick={() => document.getElementById('sub-device-upload-input')?.click()}
                      className={`relative border border-dashed p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        dragActiveSub
                          ? 'border-gold bg-gold/5'
                          : 'border-neutral-200 bg-neutral-50 hover:border-gold/40 hover:bg-neutral-100/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-gold/40 dark:hover:bg-white/[0.08]'
                      }`}
                    >
                      <input
                        id="sub-device-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'sub')}
                        className="hidden"
                      />
                      <Upload className={`h-5 w-5 mb-2 transition-colors ${dragActiveSub ? 'text-gold' : 'text-neutral-400 dark:text-white/40'}`} />
                      {uploadingImage === 'sub' ? (
                        <p className="text-[10px] font-mono text-gold animate-pulse">Uploading asset...</p>
                      ) : (
                        <>
                          <p className="text-[10px] font-bold text-neutral-800 dark:text-white/80 uppercase tracking-wide">Click or drag image here</p>
                          <p className="text-[8px] font-mono text-neutral-400 dark:text-white/40 mt-1">PNG, JPG, JPEG, WEBP up to 5MB</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Manual input fallback */}
                  <div className="mt-3">
                    <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-white/30 font-mono">Or enter image URL</label>
                    <input
                      value={subForm.image}
                      onChange={(e) => setSubForm({ ...subForm, image: e.target.value })}
                      placeholder="https://example.com/image.png"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
              {/* Sticky Footer */}
              <div className="flex-shrink-0 flex gap-3 border-t border-neutral-200 dark:border-white/10 px-7 py-5">
                <button onClick={() => setSubModal(null)} className="flex-1 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5 transition-all py-2.5 font-mono text-xs">Cancel</button>
                <button disabled={saving} onClick={saveSub} className="flex-1 flex justify-center items-center gap-2 bg-gold py-2.5 font-mono text-xs font-bold text-white hover:bg-gold/90 transition-all">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  {subModal === 'add' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Division Modal ── */}
      <AnimatePresence>
        {divModal && editingDiv && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#0D0D0D] p-7 shadow-2xl space-y-5 text-neutral-900 dark:text-white">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                <h3 className="font-display text-lg font-bold uppercase text-neutral-900 dark:text-white">
                  Edit Division Image: {divForm.name}
                </h3>
                <button onClick={() => setDivModal(false)} className="text-neutral-400 hover:text-neutral-600 dark:text-white/40 dark:hover:text-white"><X className="h-5 w-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Division Image</label>
                  
                  {divForm.image ? (
                    <div className="relative aspect-video w-full rounded-none overflow-hidden bg-neutral-100 border border-neutral-200 dark:bg-black dark:border-white/10 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={divForm.image} alt="Division preview" className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button
                          type="button"
                          onClick={async () => {
                            const imgUrl = divForm.image
                            setDivForm(prev => ({ ...prev, image: '' }))
                            if (imgUrl) {
                              try {
                                await api.deleteFile(imgUrl)
                              } catch (err) {
                                console.error('Failed to delete file from Cloudinary:', err)
                              }
                            }
                          }}
                          className="bg-white/10 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-none transition-all border border-white/20 hover:border-transparent flex items-center gap-1 font-mono uppercase tracking-wider"
                        >
                          <Trash2 className="h-3 w-3" /> Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDragEnter={handleDragDiv}
                      onDragOver={handleDragDiv}
                      onDragLeave={handleDragDiv}
                      onDrop={handleDropDiv}
                      onClick={() => document.getElementById('div-device-upload-input')?.click()}
                      className={`relative border border-dashed p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                        dragActiveDiv
                          ? 'border-gold bg-gold/5'
                          : 'border-neutral-200 bg-neutral-50 hover:border-gold/40 hover:bg-neutral-100/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-gold/40 dark:hover:bg-white/[0.08]'
                      }`}
                    >
                      <input
                        id="div-device-upload-input"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'div')}
                        className="hidden"
                      />
                      <Upload className={`h-5 w-5 mb-2 transition-colors ${dragActiveDiv ? 'text-gold' : 'text-neutral-400 dark:text-white/40'}`} />
                      {uploadingImage === 'div' ? (
                        <p className="text-[10px] font-mono text-gold animate-pulse">Uploading asset...</p>
                      ) : (
                        <>
                          <p className="text-[10px] font-bold text-neutral-800 dark:text-white/80 uppercase tracking-wide">Click or drag image here</p>
                          <p className="text-[8px] font-mono text-neutral-400 dark:text-white/40 mt-1">PNG, JPG, JPEG, WEBP up to 5MB</p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Manual input fallback */}
                  <div className="mt-3">
                    <label className="mb-1 block text-[9px] font-bold uppercase tracking-wider text-neutral-400 dark:text-white/30 font-mono">Or enter image URL</label>
                    <input
                      value={divForm.image}
                      onChange={(e) => setDivForm({ ...divForm, image: e.target.value })}
                      placeholder="https://example.com/image.png"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setDivModal(false)} className="flex-1 border border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5 transition-all py-2.5 font-mono text-xs">Cancel</button>
                <button disabled={saving} onClick={saveDiv} className="flex-1 flex justify-center items-center gap-2 bg-gold py-2.5 font-mono text-xs font-bold text-white hover:bg-gold/90 transition-all">
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
