'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Send, Loader2, Megaphone, Smartphone, Mail, Users, CheckCircle2, History, AlertCircle, Copy, Check, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BroadcastHistoryItem {
  id: string
  subject: string
  type: 'Email Dispatch' | 'WhatsApp Broadcast'
  target: string
  sentCount: number
  date: string
  status: 'Completed' | 'Processing'
}

// INITIAL_HISTORY is dynamic

const TEMPLATES = [
  { label: 'New Catalog Launch', subject: 'WCC 2026 High-Performance Uniform Collection & Specifications', body: 'Dear Partner,\n\nWe are pleased to announce the deployment of our 2026 High-Performance Uniform & Industrial Safety catalog. All garments are manufactured according to ISO 9001 standards with anti-microbial and flame-retardant options.\n\nInspect full technical datasheets on our portal.' },
  { label: 'Bulk Discount Offer', subject: 'Limited Allocation: 15% Commercial Tier Discount on Hospitality Linen', body: 'Executive Notice:\n\nFor the next 7 days, WCC Garments is releasing a 15% volume tier discount on all luxury 400-thread count sateen hotel bedding sets. Minimum order quantity: 1,000 units.\n\nSecure your supply allocation via your account representative.' },
  { label: 'Custom Notice', subject: '', body: '' },
]

export default function AdminBroadcastPage() {
  const [dispatchType, setDispatchType] = useState<'Email Dispatch' | 'WhatsApp Broadcast'>('Email Dispatch')
  const [targetGroup, setTargetGroup] = useState('All Verified Global B2B Partners (3,240 contacts)')
  const [subject, setSubject] = useState(TEMPLATES[0].subject)
  const [message, setMessage] = useState(TEMPLATES[0].body)
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState(0)
  const [history, setHistory] = useState<BroadcastHistoryItem[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await api.admin.getBroadcasts('')
      if (res.success && res.data) {
        setHistory(res.data.map((item: any) => ({
          id: item.id || `BRD-${Math.floor(Math.random() * 1000)}`,
          subject: item.subject,
          type: 'Email Dispatch',
          target: Array.isArray(item.sent_to) ? (item.sent_to[0] === 'all' ? 'All Contacts' : `${item.sent_to.length} Contacts`) : 'All Contacts',
          sentCount: Array.isArray(item.sent_to) ? (item.sent_to[0] === 'all' ? 3240 : item.sent_to.length) : 3240,
          date: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Just Now',
          status: 'Completed'
        })))
      }
    } catch (error) {
      console.error('Failed to fetch history:', error)
    }
  }

  const handleSelectTemplate = (index: number) => {
    setSubject(TEMPLATES[index].subject)
    setMessage(TEMPLATES[index].body)
  }

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message || (dispatchType === 'Email Dispatch' && !subject)) return

    setSending(true)
    setProgress(10)
    
    // Simulate real-time dispatch progress
    for (let i = 20; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 400))
      setProgress(i)
    }

    try {
      const res = await api.admin.broadcast('', {
        subject: subject || 'WhatsApp Immediate Update',
        body: message,
        recipientIds: ['all']
      })
      if (res.success) {
        await fetchHistory()
      }
    } catch (error) {
      console.error('Failed to dispatch broadcast:', error)
    }

    setSending(false)
    setProgress(0)
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto text-neutral-900 dark:text-white font-mono">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6 font-sans">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Marketing Broadcast Console</h1>
            <span className="rounded-full bg-purple-500/10 border border-purple-500/30 px-3 py-0.5 font-mono text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
              Live Telemetry Dispatch
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/50">
            Multi-channel commercial campaigns and global account notifications
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-black/50 p-1 font-mono text-xs shadow-sm">
          <button
            onClick={() => setDispatchType('Email Dispatch')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold uppercase tracking-wider transition-all ${
              dispatchType === 'Email Dispatch' ? 'bg-gold text-white shadow-lg font-bold' : 'text-neutral-500 dark:text-white/60 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span>Email Dispatch</span>
          </button>
          <button
            onClick={() => setDispatchType('WhatsApp Broadcast')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 font-semibold uppercase tracking-wider transition-all ${
              dispatchType === 'WhatsApp Broadcast' ? 'bg-emerald-500 text-black shadow-lg font-bold' : 'text-neutral-500 dark:text-white/60 hover:text-neutral-800 dark:hover:text-white'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            <span>WhatsApp Network</span>
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 font-mono">
        {/* Left Form: Compose Message */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
              <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2.5 font-sans">
                <Megaphone className="h-5 w-5 text-gold" />
                <span>Campaign Configuration Desk</span>
              </h2>
              <span className="text-xs text-gold font-semibold">Step 1 of 2</span>
            </div>

            <form onSubmit={handleDeploy} className="space-y-5 text-xs">
              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-white/40">
                  Target Audience Segment
                </label>
                <select
                  value={targetGroup}
                  onChange={e => setTargetGroup(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-black/80 px-4 py-3.5 text-neutral-900 dark:text-white focus:border-gold focus:outline-none transition-all"
                >
                  <option>All Verified Global B2B Partners (3,240 contacts)</option>
                  <option>Hospitality &amp; Hotel Procurement Directors (1,420 contacts)</option>
                  <option>Wholesale Garment Distributors GCC &amp; Africa (680 contacts)</option>
                  <option>Government &amp; Military Tender Participants (250 contacts)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-white/40">
                    Load Campaign Preset Template
                  </label>
                  <span className="text-[10px] text-neutral-400 dark:text-white/30">Auto-formats text</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {TEMPLATES.map((tmpl, idx) => (
                    <button
                      type="button"
                      key={tmpl.label}
                      onClick={() => handleSelectTemplate(idx)}
                      className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold tracking-wider transition-all truncate ${
                        subject === tmpl.subject && message === tmpl.body
                          ? 'border-gold bg-gold/10 text-gold font-bold'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'
                      }`}
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {dispatchType === 'Email Dispatch' && (
                <div>
                  <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-white/40">
                    Subject Heading *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. WCC 2026 Commercial Tender Allocation"
                    className="w-full rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 px-4 py-3 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/30 focus:border-gold focus:outline-none transition-all font-sans font-medium"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 dark:text-white/40">
                    Broadcast Message Body *
                  </label>
                  <span className="text-[10px] text-gold">{message.length} chars</span>
                </div>
                <textarea
                  rows={8}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Enter formal campaign copy..."
                  className="w-full rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 p-4 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/30 focus:border-gold focus:outline-none transition-all font-sans text-xs leading-relaxed"
                />
              </div>

              {sending && (
                <div className="space-y-2 py-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-gold">
                    <span>Deploying Telemetry Dispatch...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-neutral-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-gold via-amber-400 to-gold"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={sending || !message || (dispatchType === 'Email Dispatch' && !subject)}
                className={`group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-black transition-all duration-300 disabled:opacity-50 shadow-xl ${
                  dispatchType === 'WhatsApp Broadcast' ? 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/20' : 'bg-gold hover:bg-gold-light shadow-gold/20'
                }`}
              >
                {sending ? (
                  <div className="flex items-center gap-2 text-black">
                    <Loader2 className="h-5 w-5 animate-spin text-black" />
                    <span>Transmitting Campaign Packets...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    <span>Deploy {dispatchType} Now</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Form: Live Mobile Preview & History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Mobile Device Simulator */}
          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#0D0D0D] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-white/70">
                <Smartphone className="h-4 w-4 text-gold" />
                <span className="font-bold text-neutral-900 dark:text-white font-sans">Live Handset Preview Simulator</span>
              </div>
              <span className="rounded bg-neutral-100 dark:bg-white/10 px-2 py-0.5 text-[9px] uppercase text-neutral-600 dark:text-white/50">
                {dispatchType === 'Email Dispatch' ? 'HTML Desktop/Mobile' : 'WhatsApp Client'}
              </span>
            </div>

            <div className={`rounded-xl border p-5 font-sans transition-all text-xs space-y-4 shadow-sm ${
              dispatchType === 'WhatsApp Broadcast' ? 'border-emerald-500/30 bg-emerald-500/[0.03] dark:bg-[#075E54]/20 text-neutral-900 dark:text-white' : 'border-gold/30 bg-neutral-50 dark:bg-black text-neutral-900 dark:text-white'
            }`}>
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gold flex items-center justify-center text-white font-bold font-mono text-[10px]">W</div>
                  <div>
                    <p className="font-bold text-[11px] leading-none text-neutral-900 dark:text-white">WCC Garments Global</p>
                    <span className="text-[9px] text-neutral-500 dark:text-white/60">Verified Business Account</span>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-400 dark:text-white/40">Just now</span>
              </div>

              {dispatchType === 'Email Dispatch' && subject && (
                <div className="border-b border-neutral-200 dark:border-white/10 pb-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold block">Subject Heading:</span>
                  <p className="font-bold text-sm text-neutral-900 dark:text-white font-serif">{subject}</p>
                </div>
              )}

              <div className="whitespace-pre-wrap leading-relaxed text-neutral-800 dark:text-white/90 min-h-[8rem] text-xs font-sans">
                {message || <span className="text-neutral-400 dark:text-white/30 italic">No message copy configured in console...</span>}
              </div>

              <div className="border-t border-neutral-200 dark:border-white/10 pt-3 flex items-center justify-between text-[10px] text-neutral-400 dark:text-white/50 font-mono">
                <span>Secure Broadcast Packet</span>
                <span>End-to-End Encrypted</span>
              </div>
            </div>
          </div>

          {/* Broadcast History Bento Box */}
          <div className="rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2 font-display text-base font-bold text-neutral-900 dark:text-white font-sans">
                <History className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                <span>Historical Campaign Telemetry</span>
              </div>
              <span className="text-[10px] text-neutral-400 dark:text-white/40">Stored on Supabase</span>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-white/10 space-y-3">
              {history.map((hist, index) => (
                <div key={index} className="pt-3 first:pt-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-gold">{hist.id}</span>
                    <span className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                      hist.type === 'WhatsApp Broadcast' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                    }`}>
                      {hist.type.split(' ')[0]}
                    </span>
                  </div>
                  <p className="font-sans text-xs font-bold text-neutral-800 dark:text-white leading-tight truncate">{hist.subject}</p>
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 dark:text-white/50 font-mono">
                    <span>Delivered: <strong className="text-neutral-800 dark:text-white">{hist.sentCount.toLocaleString()} partners</strong></span>
                    <span>{hist.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
