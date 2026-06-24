'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mail, Trash2, Send, Users, CheckSquare, Square, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react'
import { api } from '@/lib/api'

interface Subscriber {
  id: string
  email: string
  subscribedAt: string
  status: 'active' | 'unsubscribed'
}

type SendStatus = 'idle' | 'sending' | 'success' | 'error'

const TEMPLATES = [
  {
    name: 'Wholesale Offer',
    subject: 'Exclusive B2B Sourcing: Premium Egyptian Cotton Collection Offer',
    body: `Dear Valued Partner,\n\nWe are pleased to extend an exclusive high-volume offer on our flagship 100% Egyptian Cotton Shirts.\n\nAs we optimize our production schedules this quarter, we are offering an additional 15% discount for bulk orders starting from 500 units.\n\nCustom private labeling and brand embroidery options are fully supported. Reply directly to this email or contact your executive account manager on WhatsApp to request custom samples and secure this production slot.\n\nBest regards,\nB2B Procurement Team\nWCC Fashions LLC — Dubai, UAE`
  },
  {
    name: 'New Catalog',
    subject: 'WCC Fashions: New B2B Apparel & Household Catalog 2026',
    body: `Dear Partner,\n\nWe are thrilled to present our newly released 2026 Collection catalog, crafted with precision at our Dubai manufacturing facility.\n\nFeatured highlights:\n- Premium Executive Velvet Blazers (Italian weave)\n- Commercial Microfiber Towels (engineered for 90°C wash cycles)\n- Hospitality Combed Cotton Linens (300TC - 600TC)\n\nView the complete range directly on our online catalog: http://localhost:3000/products\n\nTo request specifications, custom fabric samples, or bulk MOQ pricing sheets, simply let us know by replying to this email.\n\nSincerely,\nSales & Operations Group\nWCC Fashions LLC`
  },
  {
    name: 'Welcome Email',
    subject: 'Welcome to the WCC Fashions Elite B2B Network',
    body: `Hello,\n\nThank you for subscribing to the WCC Fashions B2B update feed. You are now officially connected to the UAE's premier manufacturing center.\n\nYou will be the first to receive:\n- Advanced private-label catalog releases\n- VIP priority wholesale discount announcements\n- Open production slot alerts to speed up your lead times\n\nIf you have an active sourcing project or require an immediate commercial quote, please reach out to us at: wccgarmentsllc@gmail.com or tap the WhatsApp Executive Line on our website.\n\nWarm regards,\nFounder & Executive Board\nWCC Fashions LLC`
  }
]

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showCompose, setShowCompose] = useState(false)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sendStatus, setSendStatus] = useState<SendStatus>('idle')
  const [statusMsg, setStatusMsg] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.admin.getNewsletterSubscribers('')
      if (res.success && res.data) {
        setSubscribers(res.data.map((s: any) => ({
          ...s,
          subscribedAt: s.subscribed_at || s.subscribedAt
        })))
      }
    } catch {
      console.error('Failed to fetch subscribers')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSubscribers() }, [fetchSubscribers])

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selected.size === subscribers.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(subscribers.map(s => s.id)))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return
    setDeletingId(id)
    try {
      await api.admin.deleteNewsletterSubscriber('', id)
      setSubscribers(prev => prev.filter(s => s.id !== id))
      setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
    } finally {
      setDeletingId(null)
    }
  }

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      setSendStatus('error')
      setStatusMsg('Subject and body cannot be empty.')
      return
    }
    setSendStatus('sending')
    setStatusMsg('')
    try {
      const recipientIds = selected.size === subscribers.length ? 'all' : Array.from(selected)
      const data = await api.admin.broadcast('', { subject, body, recipientIds })
      
      if (data.success) {
        setSendStatus('success')
        setStatusMsg(data.message)
        setTimeout(() => {
          setShowCompose(false)
          setSendStatus('idle')
          setStatusMsg('')
          setSubject('')
          setBody('')
        }, 3000)
      } else {
        setSendStatus('error')
        setStatusMsg(data.message)
      }
    } catch {
      setSendStatus('error')
      setStatusMsg('Network error. Please try again.')
    }
  }

  const activeCount = subscribers.filter(s => s.status === 'active').length

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-neutral-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-neutral-900 dark:text-white">Newsletter</h1>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/40 uppercase tracking-widest">
            Subscriber Management &amp; Broadcast
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubscribers}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 px-4 py-2 font-mono text-xs dark:text-white/60 transition dark:hover:border-white/20 dark:hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          <button
            onClick={() => {
              if (selected.size === 0 && subscribers.length > 0) {
                setSelected(new Set(subscribers.map(s => s.id)))
              }
              setShowCompose(true)
            }}
            disabled={subscribers.length === 0}
            className="flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 font-mono text-xs font-bold text-white uppercase tracking-wider transition hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-3.5 w-3.5" /> Compose Broadcast
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { label: 'Total Subscribers', value: subscribers.length, icon: Users, color: 'text-gold' },
          { label: 'Active', value: activeCount, icon: CheckCircle, color: 'text-emerald-500 dark:text-emerald-400' },
          { label: 'Selected', value: selected.size, icon: CheckSquare, color: 'text-blue-500 dark:text-blue-400' },
        ].map(stat => (
          <div key={stat.label} className="rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/[0.03] p-5 shadow-sm dark:shadow-none">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-white/40">{stat.label}</span>
            </div>
            <p className={`font-display text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Subscriber Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.02] overflow-hidden">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 px-6 py-4 bg-neutral-50 dark:bg-transparent">
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-600 dark:text-white/60">Subscriber List</h2>
          {subscribers.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-white/40 transition hover:text-gold"
            >
              {selected.size === subscribers.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
              {selected.size === subscribers.length ? 'Deselect All' : 'Select All'}
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-neutral-500 dark:text-white/30">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="font-mono text-sm">Loading subscribers...</span>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Mail className="h-10 w-10 text-neutral-300 dark:text-white/10" />
            <p className="font-mono text-sm text-neutral-500 dark:text-white/30">No subscribers yet.</p>
            <p className="font-mono text-xs text-neutral-400 dark:text-white/20">Subscribers from the website footer will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-white/5">
            {subscribers.map(sub => (
              <div
                key={sub.id}
                className={`flex items-center gap-4 px-6 py-4 transition-colors ${selected.has(sub.id) ? 'bg-gold/5' : 'hover:bg-neutral-50 dark:hover:bg-white/[0.02]'}`}
              >
                <button onClick={() => toggleSelect(sub.id)} className="shrink-0 text-neutral-400 dark:text-white/30 hover:text-gold dark:hover:text-gold transition-colors">
                  {selected.has(sub.id) ? <CheckSquare className="h-4 w-4 text-gold" /> : <Square className="h-4 w-4" />}
                </button>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/10 border border-gold/20">
                  <Mail className="h-4 w-4 text-gold" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-neutral-900 dark:text-white truncate">{sub.email}</p>
                  <p className="font-mono text-[10px] text-neutral-500 dark:text-white/30 mt-0.5">
                    Subscribed {new Date(sub.subscribedAt).toLocaleDateString('en-GB', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                <span className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${
                  sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-neutral-100 text-neutral-500 dark:bg-white/5 dark:text-white/30'
                }`}>
                  {sub.status}
                </span>

                <button
                  onClick={() => handleDelete(sub.id)}
                  disabled={deletingId === sub.id}
                  className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#111] shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 px-6 py-5">
              <div>
                <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white">Compose Broadcast</h2>
                <p className="mt-0.5 font-mono text-[10px] text-neutral-500 dark:text-white/40 uppercase tracking-widest">
                  Sending to {selected.size} subscriber{selected.size !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={() => { setShowCompose(false); setSendStatus('idle'); setStatusMsg('') }}
                className="rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:border-white/10 dark:bg-transparent dark:text-white/40 dark:hover:text-white p-2 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Preset Templates */}
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-widest text-neutral-500 dark:text-white/40 mb-2">Preset B2B Templates</span>
                <div className="flex flex-wrap gap-2">
                  {TEMPLATES.map(tpl => (
                    <button
                      key={tpl.name}
                      onClick={() => {
                        setSubject(tpl.subject)
                        setBody(tpl.body)
                      }}
                      className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono text-[10px] text-neutral-600 hover:border-gold hover:text-gold dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:border-gold dark:hover:text-gold transition uppercase tracking-wider"
                    >
                      ✨ {tpl.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-white/40 mb-2">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Exclusive Offer: 20% Off Bulk Orders This Week"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 outline-none focus:border-gold transition"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-neutral-500 dark:text-white/40 mb-2">Email Body</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Dear Valued Partner,&#10;&#10;We are excited to announce..."
                  rows={10}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/20 outline-none focus:border-gold transition resize-none"
                />
              </div>

              {/* Status Message */}
              {statusMsg && (
                <div className={`flex items-start gap-3 rounded-lg px-4 py-3 text-sm font-mono ${
                  sendStatus === 'error' ? 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {sendStatus === 'error' ? <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> : <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />}
                  {statusMsg}
                </div>
              )}

              {/* Env Tip */}
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 dark:border-white/5 dark:bg-white/[0.02] px-4 py-3">
                <p className="font-mono text-[10px] text-neutral-600 dark:text-white/30 leading-relaxed">
                  💡 <strong className="text-neutral-900 dark:text-white/50">To send real emails:</strong> Add <code className="bg-neutral-200 text-neutral-800 dark:bg-white/10 px-1 rounded dark:text-white/60">EMAIL_USER</code> and <code className="bg-neutral-200 text-neutral-800 dark:bg-white/10 px-1 rounded dark:text-white/60">EMAIL_APP_PASSWORD</code> to your <code className="bg-neutral-200 text-neutral-800 dark:bg-white/10 px-1 rounded dark:text-white/60">.env.local</code>. Without them, emails are logged to the console (dev mode).
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setShowCompose(false); setSendStatus('idle'); setStatusMsg('') }}
                  className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:border-white/10 dark:bg-transparent dark:text-white/50 py-3 font-mono text-xs uppercase tracking-wider transition dark:hover:border-white/20 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={sendStatus === 'sending' || sendStatus === 'success'}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gold py-3 font-mono text-xs font-bold text-white uppercase tracking-wider transition hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sendStatus === 'sending' ? (
                    <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Sending...</>
                  ) : sendStatus === 'success' ? (
                    <><CheckCircle className="h-3.5 w-3.5" /> Sent!</>
                  ) : (
                    <><Send className="h-3.5 w-3.5" /> Send Now</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
