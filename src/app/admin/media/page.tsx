'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, Plus, Film, Image as ImageIcon, Copy, Check, Trash2, Filter, Sparkles, ExternalLink, RefreshCw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface MediaAsset {
  id: string
  title: string
  type: 'new_arrival' | 'offer' | 'banner' | 'product_showcase'
  image: string
  dimensions: string
  size: string
  uploadedAt: string
}

import { api } from '@/lib/api'
import { useEffect } from 'react'

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([])
  const [selectedTab, setSelectedTab] = useState<'all' | 'new_arrival' | 'offer' | 'banner'>('all')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteModal, setDeleteModal] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await api.admin.getMedia('')
      if (res.success && res.data) {
        setMediaList(res.data.map((m: any) => ({
          id: m.id,
          title: m.title || 'Untitled Asset',
          type: m.type || 'banner',
          image: m.url,
          dimensions: m.dimensions || 'N/A',
          size: m.size || 'N/A',
          uploadedAt: m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Just Now'
        })))
      }
    } catch (error) {
      console.error('Failed to fetch media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSimulateUpload = async () => {
    setUploading(true)
    setUploadProgress(15)
    for (let p = 30; p <= 100; p += 35) {
      await new Promise(r => setTimeout(r, 400))
      setUploadProgress(p)
    }

    try {
      const payload = {
        title: 'Newly Synced Production Asset ' + new Date().toLocaleTimeString(),
        type: selectedTab === 'all' ? 'new_arrival' : selectedTab,
        url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
        dimensions: '2400x1600',
        size: '2.1 MB'
      }
      await api.admin.createMedia('', payload)
      await fetchMedia()
    } catch (error) {
      console.error('Failed to create media:', error)
    }
    setUploading(false)
    setUploadProgress(0)
  }

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = async (id: string) => {
    try {
      await api.admin.deleteMedia('', id)
      await fetchMedia()
    } catch (error) {
      console.error('Failed to delete media:', error)
    }
    setDeleteModal(null)
  }

  const filteredMedia = mediaList.filter(m => {
    if (selectedTab === 'all') return true
    return m.type === selectedTab
  })

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-neutral-900 dark:text-white font-mono">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6 font-sans">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Digital Asset Library</h1>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-0.5 font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
              {mediaList.length} Total Assets
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/50">
            Secure cloud CDN asset storage and high-resolution banner orchestration
          </p>
        </div>

        <button
          onClick={handleSimulateUpload}
          disabled={uploading}
          className="flex items-center gap-2.5 rounded-lg bg-gold px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-gold-light hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] disabled:opacity-50 self-start sm:self-auto"
        >
          {uploading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-black" />
              <span>Transmitting ({uploadProgress}%)</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Upload Production Asset</span>
            </>
          )}
        </button>
      </div>

      {/* Upload Zone & Storage Status */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-dashed border-neutral-300 dark:border-white/20 bg-neutral-50 dark:bg-white/5 p-8 text-center transition-all hover:border-gold/50 dark:hover:border-gold/50 flex flex-col items-center justify-center min-h-[180px]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-gold mb-3">
            <Upload className="h-6 w-6" />
          </div>
          <h3 className="font-sans text-sm font-bold text-neutral-900 dark:text-white">Drag &amp; Drop High-Res Production Files</h3>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">Supports RAW, WebP, PNG, MP4 up to 50MB per asset packet</p>
          <button onClick={handleSimulateUpload} className="mt-4 rounded-lg bg-neutral-200 dark:bg-white/10 px-4 py-2 text-xs font-semibold text-neutral-800 dark:text-white hover:bg-gold hover:text-white dark:hover:bg-gold dark:hover:text-white transition-all">
            Browse System Directory
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#0D0D0D] p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-sans text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Film className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <span>Cloud Storage Telemetry</span>
            </h3>
            <p className="mt-1 text-xs text-neutral-500 dark:text-white/40">Supabase Secure Bucket Storage</p>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-neutral-600 dark:text-white/70">
              <span>Bandwidth &amp; Space</span>
              <span className="text-gold font-bold">18.4 GB / 100 GB</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full w-[18.4%]" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-white/40 pt-1">
              <span>CDN Edge Caching: 99.8%</span>
              <span>Global Region: Frankfurt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto bg-neutral-50 dark:bg-white/5 p-3 rounded-xl border border-neutral-200 dark:border-white/10 scrollbar-hide font-mono">
        {(['all', 'new_arrival', 'offer', 'banner'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`rounded-lg px-4 py-2 text-xs tracking-wider uppercase whitespace-nowrap transition-all font-semibold ${
              selectedTab === tab ? 'bg-gold text-white shadow-md font-bold' : 'text-neutral-500 hover:bg-neutral-200 hover:text-neutral-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'
            }`}
          >
            {tab === 'all' ? 'All Assets' : tab.replace('_', ' ')} ({mediaList.filter(m => tab === 'all' || m.type === tab).length})
          </button>
        ))}
      </div>

      {/* Media Assets Bento Box Grid */}
      {loading ? (
        <div className="py-20 flex justify-center"><RefreshCw className="w-8 h-8 text-gold animate-spin" /></div>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 font-sans">
        <AnimatePresence>
          {filteredMedia.map((item, idx) => (
              <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 shadow-xl transition-all duration-500 hover:border-gold/50 hover:shadow-2xl flex flex-col justify-between"
            >
              {/* Image Preview Box */}
              <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-black">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 font-mono text-xs">
                  <span className="text-white font-bold">{item.dimensions}</span>
                  <span className="text-gold font-bold">{item.size}</span>
                </div>
                <div className="absolute top-3 left-3">
                  <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-md border ${
                    item.type === 'offer' ? 'bg-amber-500/80 text-black border-amber-300' :
                    item.type === 'banner' ? 'bg-purple-500/80 text-white border-purple-300' :
                    'bg-emerald-500/80 text-black border-emerald-300'
                  }`}>
                    {(item.type || 'banner').replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Asset Metadata Bar */}
              <div className="p-5 space-y-3 font-mono">
                <div>
                  <span className="text-[10px] text-neutral-500 dark:text-white/40 font-bold block">{item.id.slice(0, 8)}... • Synced {item.uploadedAt}</span>
                  <p className="font-display text-sm font-bold text-neutral-900 dark:text-white group-hover:text-gold transition-colors pt-0.5 line-clamp-1 font-sans">{item.title}</p>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-neutral-200 dark:border-white/10 pt-3 text-xs">
                  <button
                    onClick={() => handleCopyLink(item.image, item.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-neutral-100 dark:bg-white/10 py-2.5 text-neutral-600 dark:text-white/80 font-semibold hover:bg-gold hover:text-white dark:hover:bg-gold dark:hover:text-white transition-all"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400 font-bold" />
                        <span className="text-emerald-500 dark:text-emerald-400 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-gold" />
                        <span>Copy CDN Link</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setDeleteModal(item.id)}
                    className="rounded-lg border border-red-500/20 bg-red-500/10 p-2.5 text-red-500 dark:text-red-400 hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-300 transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      )}

      {filteredMedia.length === 0 && (
        <div className="p-16 text-center font-mono space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5">
          <ImageIcon className="h-8 w-8 text-neutral-400 dark:text-white/30 mx-auto" />
          <p className="text-sm text-neutral-500 dark:text-white/60 font-semibold">No digital assets found under this filtering taxonomy.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#0D0D0D] p-8 shadow-2xl text-center space-y-6"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mx-auto text-red-500 dark:text-red-400">
                <Trash2 className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-neutral-900 dark:text-white font-sans">Decommission CDN Asset</h3>
                <p className="mt-2 text-xs text-neutral-600 dark:text-white/60 leading-relaxed font-sans">
                  Are you sure you want to permanently purge this asset packet from the cloud CDN bucket? Banners linking here will instantly failover.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={() => setDeleteModal(null)}
                  className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 py-3 text-xs font-semibold dark:text-white/70 dark:hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal)}
                  className="flex-1 rounded-lg bg-red-500 py-3 text-xs font-bold text-white dark:text-black hover:bg-red-600 dark:hover:bg-red-400 transition-all shadow-lg shadow-red-500/20"
                >
                  Purge Asset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
