'use client'

import { useState } from 'react'
import { Search, Inbox, AlertCircle, CheckCircle2, Clock, ArrowRight, Eye, Phone, Mail, Globe, MapPin, Building2, PackageCheck, Send, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface EnquiryItem {
  id: string
  company: string
  country: string
  email: string
  phone: string
  products: string
  status: 'new' | 'contacted' | 'quoted' | 'converted'
  priority: 'urgent' | 'high' | 'normal'
  date: string
  quantity: string
  message: string
  rep: string
}

import { api } from '@/lib/api'
import { useEffect } from 'react'

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [activeModal, setActiveModal] = useState<EnquiryItem | null>(null)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEnquiries()
  }, [])
  
  const fetchEnquiries = async () => {
    setLoading(true)
    try {
      const res: any = await api.admin.getEnquiries('')
      if (res.success && res.data) {
        // map db response if needed, for now we assume they match
        setEnquiries(res.data.map((e: any) => ({
          ...e,
          products: Array.isArray(e.product_interest) ? e.product_interest.join(', ') : (e.products || e.product_interest),
          date: e.created_at ? new Date(e.created_at).toLocaleDateString() : e.date,
          quantity: e.quantity_range || e.quantity,
          rep: e.assigned_to || e.rep || 'Unassigned'
        })))
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: EnquiryItem['status']) => {
    try {
      await api.admin.updateEnquiry('', id, { status: newStatus })
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e))
      if (activeModal && activeModal.id === id) {
        setActiveModal(prev => prev ? { ...prev, status: newStatus } : null)
      }
      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 2000)
    } catch (error) {
      console.error('Failed to update enquiry status:', error)
    }
  }

  const filteredEnquiries = enquiries.filter(enq => {
    const matchSearch = enq.company.toLowerCase().includes(search.toLowerCase()) || 
                        enq.email.toLowerCase().includes(search.toLowerCase()) || 
                        enq.id.toLowerCase().includes(search.toLowerCase()) ||
                        enq.country.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || enq.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-neutral-900 dark:text-white">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6 font-sans">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Commercial CRM</h1>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-0.5 font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
              {enquiries.length} Active Leads
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/50">
            Enterprise procurement inquiries, RFQs, and government tenders
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 font-mono text-xs">
          {(['all', 'new', 'contacted', 'quoted', 'converted'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-lg px-4 py-2.5 font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-gold text-white shadow-lg font-bold'
                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 dark:bg-white/5 dark:text-white/60 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Records' : tab} ({enquiries.filter(e => tab === 'all' || e.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by company name, email, record ID, or country..."
          className="w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-12 pr-4 font-mono text-xs text-neutral-900 placeholder-neutral-400 focus:border-gold focus:outline-none focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/30 dark:focus:bg-black transition-all shadow-lg"
        />
      </div>

      {/* Enquiries CRM List Grid */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 shadow-2xl font-mono">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-black/40 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">
              <tr>
                <th className="px-6 py-4">Commercial Entity</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Product Category</th>
                <th className="px-6 py-4">Est. Quantity</th>
                <th className="px-6 py-4">Status &amp; Priority</th>
                <th className="px-6 py-4 text-right">Action Desk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-white/10 text-xs text-neutral-700 dark:text-white/80">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 font-sans text-neutral-500 dark:text-white/50">Loading records...</td></tr>
              ) : (
              <AnimatePresence>
                {filteredEnquiries.map((enq) => (
                  <motion.tr
                    key={enq.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => setActiveModal(enq)}
                  >
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-gold">{enq.id}</span>
                          <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-white/30" />
                          <span className="text-[11px] text-neutral-400 dark:text-white/40">{enq.date}</span>
                        </div>
                        <p className="font-display text-base font-bold text-neutral-900 dark:text-white group-hover:text-gold transition-colors">{enq.company}</p>
                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 dark:text-white/50 pt-0.5 font-mono">
                          <Globe className="h-3 w-3 text-gold" />
                          <span>{enq.country}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 space-y-1">
                      <p className="font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-neutral-400 dark:text-white/40" />
                        <span>{enq.email}</span>
                      </p>
                      <p className="text-[11px] text-neutral-500 dark:text-white/50 flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-neutral-400 dark:text-white/40" />
                        <span>{enq.phone}</span>
                      </p>
                    </td>
                    <td className="px-6 py-5 font-semibold text-neutral-800 dark:text-white/90">
                      {enq.products}
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded bg-neutral-50 border border-neutral-200 dark:bg-white/5 dark:border-white/10 px-2.5 py-1 text-[11px] font-bold text-gold">
                        {enq.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-5 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                          enq.status === 'new' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
                          enq.status === 'quoted' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                          enq.status === 'converted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                          'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                        }`}>
                          {enq.status === 'new' && <AlertCircle className="h-3 w-3 animate-bounce" />}
                          {enq.status === 'quoted' && <CheckCircle2 className="h-3 w-3" />}
                          {enq.status === 'contacted' && <Clock className="h-3 w-3" />}
                          {enq.status === 'converted' && <Check className="h-3 w-3" />}
                          <span>{enq.status}</span>
                        </span>
                        
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                          enq.priority === 'urgent' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30' :
                          enq.priority === 'high' ? 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/30' :
                          'bg-neutral-100 text-neutral-500 border border-neutral-200 dark:bg-white/5 dark:text-white/40 dark:border-white/10'
                        }`}>
                          {enq.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveModal(enq) }}
                        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 px-3 py-2 text-neutral-600 dark:text-white/70 transition-all hover:bg-gold hover:text-white hover:border-gold dark:hover:bg-gold dark:hover:text-white dark:hover:border-gold font-semibold"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {filteredEnquiries.length === 0 && (
          <div className="p-16 text-center font-mono space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-50 border border-neutral-200 dark:bg-white/5 dark:border-white/10 mx-auto">
              <Inbox className="h-6 w-6 text-neutral-400 dark:text-white/30" />
            </div>
            <p className="text-sm text-neutral-500 dark:text-white/60 font-semibold">No commercial records found matching your active CRM filters.</p>
          </div>
        )}
      </div>

      {/* Enquiry Detail Inspector Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-md font-mono">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl rounded-2xl border border-gold/30 bg-white dark:bg-[#0D0D0D] p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded bg-gold/10 border border-gold/30 px-2 py-0.5 text-[10px] font-bold text-gold uppercase tracking-wider">{activeModal.id}</span>
                    <span className="text-xs text-neutral-400 dark:text-white/40">{activeModal.date}</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-neutral-900 dark:text-white">{activeModal.company}</h2>
                  <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-white/60 pt-1">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-gold" /> {activeModal.country}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="h-3 w-3 text-blue-500 dark:text-blue-400" /> Rep: {activeModal.rep}</span>
                  </div>
                </div>

                <button onClick={() => setActiveModal(null)} className="rounded-lg p-1 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/10">
                  ✕
                </button>
              </div>

              {updateSuccess && (
                <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Commercial status successfully synchronized.
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 p-4 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 dark:text-white/40 block">Contact Protocols</span>
                  <a href={`mailto:${activeModal.email}`} className="flex items-center gap-3 text-xs text-neutral-900 dark:text-white hover:text-gold dark:hover:text-gold transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-100 border border-neutral-200 dark:bg-black dark:border-white/10"><Mail className="h-3.5 w-3.5 text-gold" /></div>
                    <span className="truncate">{activeModal.email}</span>
                  </a>
                  <a href={`tel:${activeModal.phone}`} className="flex items-center gap-3 text-xs text-neutral-900 dark:text-white hover:text-gold dark:hover:text-gold transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-neutral-100 border border-neutral-200 dark:bg-black dark:border-white/10"><Phone className="h-3.5 w-3.5 text-gold" /></div>
                    <span>{activeModal.phone}</span>
                  </a>
                </div>

                <div className="rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 p-4 space-y-3">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 dark:text-white/40 block">Commercial Scope</span>
                  <div className="text-xs space-y-1">
                    <p className="text-neutral-600 dark:text-white/60">Target Divisions: <strong className="text-neutral-900 dark:text-white">{activeModal.products}</strong></p>
                    <p className="text-neutral-600 dark:text-white/60">Est. Quantity: <strong className="text-gold">{activeModal.quantity}</strong></p>
                    <p className="text-neutral-600 dark:text-white/60">Urgency Level: <strong className="text-red-500 dark:text-red-400 uppercase">{activeModal.priority}</strong></p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 dark:text-white/40 block">Client Specification Message</span>
                <p className="text-xs text-neutral-800 dark:text-white/80 leading-relaxed font-sans italic bg-neutral-100 dark:bg-black/40 p-4 rounded-lg border border-neutral-200 dark:border-white/5">
                  &ldquo;{activeModal.message}&rdquo;
                </p>
              </div>

              <div className="border-t border-neutral-200 dark:border-white/10 pt-4 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-white/60">Update Lead Workflow Status</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['new', 'contacted', 'quoted', 'converted'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(activeModal.id, st)}
                      className={`rounded-lg border p-3 text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                        activeModal.status === st
                          ? 'bg-gold text-white border-gold font-bold shadow-lg shadow-gold/20'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 hover:border-neutral-300 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/30'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-white/10">
                <a
                  href={`mailto:${activeModal.email}?subject=Re: Commercial Enquiry (${activeModal.id}) - WCC Garments`}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gold py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-gold-light transition-all shadow-lg"
                >
                  <Send className="h-4 w-4" />
                  <span>Reply via Email Dispatch</span>
                </a>
                <button
                  onClick={() => setActiveModal(null)}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-3 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 transition-all"
                >
                  Close Console
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
