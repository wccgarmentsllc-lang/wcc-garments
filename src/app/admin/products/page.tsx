'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Search, Edit2, Trash2, Eye, EyeOff, Filter, ArrowUpDown, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { DIVISIONS } from '@/lib/constants'
import { api } from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminProductsPage() {
  const [search, setSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [selectedDivision, setSelectedDivision] = useState<string>('all')
  const [productList, setProductList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.admin.getProducts('')
      if (res.success && res.data) {
        setProductList(res.data)
      }
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteProduct('', id)
      await fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
    }
    setDeleteModal(null)
  }

  const filteredProducts = productList.filter((p) => {
    const categoriesStr = Array.isArray(p.categories) ? p.categories.map((c: any) => typeof c === 'string' ? c : c.name).join(' ') : (p.category || '');
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || categoriesStr.toLowerCase().includes(search.toLowerCase())
    const matchDivision = selectedDivision === 'all' || p.division.toLowerCase() === selectedDivision.toLowerCase()
    return matchSearch && matchDivision
  })

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-neutral-900 dark:text-white">
      {/* Top Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6 font-sans">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Product Catalog</h1>
            <span className="bg-gold/10 border border-gold/30 px-3 py-0.5 font-mono text-xs font-bold text-gold rounded-none">
              {filteredProducts.length} Listed
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/50">
            Real-time catalog synchronization and commercial pricing rules
          </p>
        </div>

        <Link
          href={`/admin/products/new${selectedDivision !== 'all' ? `?division=${selectedDivision}` : ''}`}
          className="flex items-center gap-2.5 rounded-none bg-gold px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-gold-light hover:shadow-[0_0_25px_rgba(59,130,246,0.1)] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-neutral-50 dark:bg-white/5 p-4 rounded-none border border-neutral-200 dark:border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedDivision('all')}
            className={`px-4 py-2 font-mono text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all rounded-none ${
              selectedDivision === 'all' ? 'bg-gold text-white shadow-md font-bold' : 'text-neutral-500 hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
          >
            All Divisions
          </button>
          {DIVISIONS.map((d) => (
            <button
              key={d.slug}
              onClick={() => setSelectedDivision(d.name)}
              className={`px-4 py-2 font-mono text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all rounded-none ${
                selectedDivision.toLowerCase() === d.name.toLowerCase() ? 'bg-gold text-white shadow-md font-bold' : 'text-neutral-500 hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or tag..."
            className="w-full rounded-none border border-neutral-200 bg-white py-2.5 pl-10 pr-4 font-mono text-xs text-neutral-900 placeholder-neutral-400 dark:border-white/10 dark:bg-black/50 dark:text-white dark:placeholder-white/30 focus:border-gold focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Products Table Bento Box */}
      <div className="overflow-hidden rounded-none border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono">
            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-black/40 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">
              <tr>
                <th className="px-6 py-4">Item Core</th>
                <th className="px-6 py-4">Division Hierarchy</th>
                <th className="px-6 py-4">Commercial MOQ</th>
                <th className="px-6 py-4">Special Flags</th>
                <th className="px-6 py-4 text-center">Telemetry</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-white/10 text-xs text-neutral-700 dark:text-white/80">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin text-gold mx-auto" /></td></tr>
              ) : (
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4.5">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 flex-shrink-0 rounded-none overflow-hidden border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 group-hover:border-gold/50 transition-colors">
                          <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform group-hover:scale-110 duration-500 rounded-none" sizes="56px" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-display text-sm font-bold text-neutral-900 dark:text-white group-hover:text-gold transition-colors">{product.name}</p>
                          <p className="text-[10px] text-neutral-400 dark:text-white/40 font-mono">ID: {product.slug}</p>
                          <div className="flex items-center gap-2 pt-0.5">
                            {(product.tags || []).slice(0, 2).map((t: string, i: number) => (
                              <span key={i} className="bg-neutral-100 border border-neutral-200 dark:bg-white/5 dark:border-white/10 px-1.5 py-0.2 font-mono text-[9px] text-neutral-600 dark:text-white/60 uppercase tracking-wider rounded-none">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="font-bold text-neutral-900 dark:text-white">{product.division}</span>
                      <span className="block text-[10px] text-neutral-400 dark:text-white/50">{Array.isArray(product.categories) && product.categories.length > 0 ? product.categories.map((c: any) => typeof c === 'string' ? c : c.name).join(', ') : product.category}</span>
                    </td>
                    <td className="px-6 py-4.5 font-bold text-gold">
                      {product.moq || '500 Units'}
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {product.is_new && (
                          <span className="bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase rounded-none">
                            New Arrival
                          </span>
                        )}
                        {product.is_offer && (
                          <span className="bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase rounded-none">
                            Offer
                          </span>
                        )}
                        {product.featured && (
                          <span className="bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase rounded-none">
                            Featured
                          </span>
                        )}
                        {!product.is_new && !product.is_offer && !product.featured && (
                          <span className="text-[10px] text-neutral-400 dark:text-white/30 uppercase rounded-none">Standard</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 rounded-none">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Live</span>
                      </span>
                    </td>
                    <td className="px-6 py-4.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="flex items-center gap-1 rounded-none border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-600 transition-all hover:bg-neutral-100 hover:text-neutral-900 hover:border-neutral-300 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/20"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </Link>
                        <button
                          onClick={() => setDeleteModal(product.id)}
                          className="flex items-center gap-1 rounded-none border border-red-500/20 bg-red-500/10 px-3 py-2 text-red-500 transition-all hover:bg-red-500/20 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-16 text-center font-mono space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-none bg-neutral-50 border border-neutral-200 dark:bg-white/5 dark:border-white/10 mx-auto">
              <Search className="h-6 w-6 text-neutral-400 dark:text-white/30" />
            </div>
            <p className="text-sm text-neutral-500 dark:text-white/60 font-semibold">No product entries match your telemetry filters.</p>
            <button onClick={() => { setSearch(''); setSelectedDivision('all') }} className="text-xs text-gold underline hover:text-gold-light">
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-md font-mono text-neutral-900 dark:text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-none border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#0D0D0D] p-8 shadow-2xl text-center space-y-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-none bg-red-500/10 border border-red-500/20 mx-auto text-red-500">
                <Trash2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-neutral-900 dark:text-white">Decommission Product Listing</h3>
                <p className="mt-2 text-xs text-neutral-500 dark:text-white/60 leading-relaxed">
                  Are you sure you want to permanently decommission this product from the WCC global catalog? This telemetry action cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 rounded-none border border-neutral-200 bg-neutral-50 py-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="flex-1 rounded-none bg-red-500 py-3 text-xs font-bold text-black hover:bg-red-400 transition-all shadow-lg"
                >
                  Confirm Deletion
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
