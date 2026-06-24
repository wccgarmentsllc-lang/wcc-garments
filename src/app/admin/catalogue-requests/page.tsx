'use client'

import { useState, useEffect } from 'react'
import { Search, BookOpen, AlertCircle, CheckCircle2, Clock, Mail, Building2, Send, Check, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '@/lib/api'

interface CatalogueRequestItem {
  id: string
  name: string
  email: string
  company: string | null
  brand_slug: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

export default function AdminCatalogueRequestsPage() {
  const [requests, setRequests] = useState<CatalogueRequestItem[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const res: any = await api.admin.getCatalogueRequests()
      if (res.success && res.data) {
        setRequests(res.data)
      } else {
        setErrorMessage(res.error || 'Failed to fetch catalogue requests')
      }
    } catch (error: any) {
      console.error('Failed to fetch catalogue requests:', error)
      setErrorMessage(error.message || 'Failed to connect to backend')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
    setProcessingId(id)
    try {
      const res = await api.admin.updateCatalogueRequest(undefined, id, { status: newStatus })
      if (res.success) {
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r))
        setSuccessToast(`Catalogue request successfully ${newStatus}!`)
        setTimeout(() => setSuccessToast(null), 3000)
      } else {
        alert(res.error || 'Failed to update request status')
      }
    } catch (error: any) {
      console.error('Failed to update status:', error)
      alert(error.message || 'Failed to update request status')
    } finally {
      setProcessingId(null)
    }
  }

  const filteredRequests = requests.filter(req => {
    const brandName = req.brand_slug === 'horeca24h' ? 'horeca24h' : 'aanya homecraft'
    const matchSearch = req.name.toLowerCase().includes(search.toLowerCase()) ||
                        req.email.toLowerCase().includes(search.toLowerCase()) ||
                        (req.company && req.company.toLowerCase().includes(search.toLowerCase())) ||
                        brandName.includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || req.status === statusFilter
    return matchSearch && matchStatus
  })

  // SQL code to show if DB table is missing
  const showSqlWarning = errorMessage && (
    errorMessage.includes('does not exist') || 
    errorMessage.includes('relation') ||
    errorMessage.includes('404')
  )

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-neutral-900 dark:text-white">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6 font-sans">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Catalogue Approvals</h1>
            <span className="rounded-full bg-gold/10 border border-gold/30 px-3 py-0.5 font-mono text-xs font-bold text-gold">
              {requests.length} Requests
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/50">
            Verify and approve enterprise catalogue requests and trigger automated secure email delivery.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 sm:pb-0 font-mono text-xs">
          {(['all', 'pending', 'approved', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`rounded-lg px-4 py-2.5 font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                statusFilter === tab
                  ? 'bg-gold text-white shadow-lg font-bold'
                  : 'bg-neutral-50 text-neutral-600 border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-900 dark:bg-white/5 dark:text-white/60 dark:border-white/10 dark:hover:bg-white/10 dark:hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All Requests' : tab} ({requests.filter(r => tab === 'all' || r.status === tab).length})
            </button>
          ))}
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-6 z-50 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 shadow-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-3 bg-white dark:bg-[#0D0D0D]"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {showSqlWarning ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-8 space-y-6 max-w-4xl mx-auto font-mono">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-8 w-8 text-red-500 shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-red-500 uppercase">Database Table Missing</h3>
              <p className="text-xs text-neutral-600 dark:text-white/70 mt-2 leading-relaxed">
                The database table <strong>catalogue_requests</strong> was not found in Supabase. Please open your Supabase SQL Editor and run the following migration script to create it:
              </p>
            </div>
          </div>

          <div className="relative">
            <pre className="p-5 bg-neutral-900 text-neutral-200 rounded-lg text-[11px] overflow-x-auto leading-relaxed border border-neutral-800">
{`-- Create catalogue_requests table
CREATE TABLE IF NOT EXISTS public.catalogue_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    brand_slug TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.catalogue_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public insert access to catalogue_requests" 
    ON public.catalogue_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin access to catalogue_requests" 
    ON public.catalogue_requests FOR ALL USING (auth.role() = 'service_role');

-- Trigger
CREATE TRIGGER update_catalogue_requests_modtime
    BEFORE UPDATE ON public.catalogue_requests FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();`}
            </pre>
          </div>

          <div className="flex gap-4">
            <button
              onClick={fetchRequests}
              className="rounded-lg bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider px-6 py-3 hover:bg-red-600 transition-all cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Search Input Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-white/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client name, email, company, or brand..."
              className="w-full rounded-xl border border-neutral-200 bg-white py-3.5 pl-12 pr-4 font-mono text-xs text-neutral-900 placeholder-neutral-400 focus:border-gold focus:outline-none focus:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder-white/30 dark:focus:bg-black transition-all shadow-lg"
            />
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 shadow-2xl font-mono">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-black/40 text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-white/40">
              <tr>
                <th className="px-6 py-4">Client Detail</th>
                <th className="px-6 py-4">Company Entity</th>
                <th className="px-6 py-4">Target Catalogue</th>
                <th className="px-6 py-4">Date Requested</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-white/10 text-xs text-neutral-700 dark:text-white/80">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 font-sans text-neutral-500 dark:text-white/50">
                    Loading request logs...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 font-sans text-neutral-500 dark:text-white/50">
                    No catalogue requests found matching filters.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredRequests.map((req) => {
                    const isHoreca = req.brand_slug === 'horeca24h'
                    return (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group hover:bg-neutral-50/50 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-5">
                          <div className="space-y-0.5">
                            <p className="font-display text-sm font-bold text-neutral-900 dark:text-white group-hover:text-gold transition-colors">{req.name}</p>
                            <a href={`mailto:${req.email}`} className="text-neutral-500 dark:text-white/40 hover:underline flex items-center gap-1.5 text-[11px]">
                              <Mail className="h-3 w-3" />
                              <span>{req.email}</span>
                            </a>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {req.company ? (
                            <div className="flex items-center gap-2 text-neutral-800 dark:text-white/90">
                              <Building2 className="h-3.5 w-3.5 text-neutral-400" />
                              <span>{req.company}</span>
                            </div>
                          ) : (
                            <span className="text-neutral-400 dark:text-white/30 italic">Not Provided</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border ${
                            isHoreca 
                              ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400' 
                              : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400'
                          }`}>
                            <BookOpen className="h-3 w-3" />
                            <span>{isHoreca ? 'Horeca (Hospitality)' : 'Aanya (Household)'}</span>
                          </span>
                        </td>
                        <td className="px-6 py-5 text-neutral-500 dark:text-white/40">
                          {new Date(req.created_at).toLocaleDateString()} at {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                            req.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                            req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                            'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                          }`}>
                            {req.status === 'pending' && <Clock className="h-3 w-3 animate-pulse" />}
                            {req.status === 'approved' && <Check className="h-3 w-3" />}
                            {req.status === 'rejected' && <XCircle className="h-3 w-3" />}
                            <span>{req.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {req.status === 'pending' ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleUpdateStatus(req.id, 'approved')}
                                disabled={processingId !== null}
                                className="inline-flex items-center gap-1.5 rounded bg-gold hover:bg-gold-light text-white px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                              >
                                <Send className="h-3 w-3" />
                                <span>Approve &amp; Send</span>
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(req.id, 'rejected')}
                                disabled={processingId !== null}
                                className="inline-flex items-center gap-1.5 rounded border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 text-neutral-600 dark:text-white/60 px-3 py-2 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50 cursor-pointer"
                              >
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-neutral-400 dark:text-white/30 uppercase font-bold tracking-widest">
                              Processed
                            </span>
                          )}
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Stacked Card View */}
        <div className="block md:hidden p-4 space-y-4">
          {loading ? (
            <div className="text-center py-10 font-sans text-neutral-500 dark:text-white/50">Loading request logs...</div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-10 font-sans text-neutral-500 dark:text-white/50">No catalogue requests found matching filters.</div>
          ) : (
            <AnimatePresence>
              {filteredRequests.map((req) => {
                const isHoreca = req.brand_slug === 'horeca24h'
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 border border-neutral-200 dark:border-white/10 bg-white dark:bg-white/5 space-y-3 font-mono shadow-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="font-display text-sm font-bold text-neutral-900 dark:text-white">{req.name}</h4>
                        <a href={`mailto:${req.email}`} className="text-neutral-500 dark:text-white/40 hover:underline flex items-center gap-1.5 text-[10px]">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate max-w-[180px]">{req.email}</span>
                        </a>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                        isHoreca 
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400' 
                          : 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400'
                      }`}>
                        <span>{isHoreca ? 'Horeca' : 'Aanya'}</span>
                      </span>
                    </div>

                    <div className="text-[11px] space-y-1">
                      <div className="flex items-center gap-2 text-neutral-800 dark:text-white/80">
                        <Building2 className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                        <span>{req.company || <span className="italic text-neutral-400 dark:text-white/30">Not Provided</span>}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400 dark:text-white/40 font-mono">
                        Requested: {new Date(req.created_at).toLocaleDateString()} at {new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-100 dark:border-white/5 pt-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        req.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
                        req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                      }`}>
                        {req.status === 'pending' && <Clock className="h-3 w-3 animate-pulse" />}
                        {req.status === 'approved' && <Check className="h-3 w-3" />}
                        {req.status === 'rejected' && <XCircle className="h-3 w-3" />}
                        <span>{req.status}</span>
                      </span>

                      {req.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'approved')}
                            disabled={processingId !== null}
                            className="inline-flex items-center gap-1.5 rounded bg-gold hover:bg-gold-light text-white px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                          >
                            <Send className="h-3 w-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.id, 'rejected')}
                            disabled={processingId !== null}
                            className="inline-flex items-center gap-1.5 rounded border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-white/5 text-neutral-600 dark:text-white/60 px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-wider hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400 dark:text-white/30 uppercase font-bold tracking-widest">
                          Processed
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          )}
        </div>
          </div>
        </>
      )}
    </div>
  )
}
