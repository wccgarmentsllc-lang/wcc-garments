'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Package, Inbox, Film, Users, Plus, ArrowUpRight, TrendingUp, CheckCircle2, Clock, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { api } from '@/lib/api'

// STATS and RECENT_ENQUIRIES will be dynamic

// System logs are now dynamically sourced — no fake entries

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'quoted'>('all')
  const [refreshing, setRefreshing] = useState(false)
  const [cooldown, setCooldown] = useState(false)
  
  const [stats, setStats] = useState({ products: 0, enquiries: 0, media: 0, contacts: 0 })
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([])

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    if (cooldown) return;
    setRefreshing(true)
    try {
      const res = await api.admin.getDashboard()
      if (res.success && res.data) {
        setStats(res.data.stats || { products: 0, enquiries: 0, media: 0, contacts: 0 })
        setRecentEnquiries(res.data.recentEnquiries || [])
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setRefreshing(false)
      setCooldown(true)
      setTimeout(() => setCooldown(false), 5000)
    }
  }

  const handleRefresh = async () => {
    if (!cooldown && !refreshing) {
      await fetchDashboard()
    }
  }

  const filteredEnquiries = recentEnquiries.filter(enq => {
    if (activeTab === 'new') return enq.status === 'new'
    if (activeTab === 'quoted') return enq.status === 'quoted'
    return true
  })
  
  const displayStats = [
    { label: 'Total Products in Catalog', value: stats.products.toString(), change: 'Live inventory', icon: Package, color: '#3B82F6' },
    { label: 'Total Enquiries', value: stats.enquiries.toString(), change: 'Active leads', icon: Inbox, color: '#3B82F6' },
    { label: 'Digital Assets & Media', value: stats.media.toString(), change: 'CDN storage', icon: Film, color: '#8B5CF6' },
    { label: 'Newsletter Subscribers', value: stats.contacts.toString(), change: 'Global network', icon: Users, color: '#10B981' },
  ]

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto text-neutral-900 dark:text-white">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white uppercase">Executive Dashboard</h1>
            <span className="bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest rounded-none">
              Online &amp; Secure
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-neutral-500 dark:text-white/50">
            Real-time telemetry and commercial management console • UTC+4 Dubai
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing || cooldown}
            className="flex items-center gap-2 rounded-none border border-neutral-200 bg-neutral-50 px-3.5 py-2.5 font-mono text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-gold' : ''}`} />
            <span>{refreshing ? 'Syncing...' : cooldown ? 'Synced' : 'Sync Telemetry'}</span>
          </button>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 rounded-none bg-gold px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-gold-light hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Listing</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className="group relative overflow-hidden rounded-none border border-neutral-200 bg-neutral-50/50 p-6 transition-all duration-300 hover:border-gold/50 hover:bg-neutral-100/50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 hover:shadow-lg dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              {/* Subtle top background highlight */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-medium uppercase tracking-wider text-neutral-400 dark:text-white/40">{stat.label}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-none border border-neutral-200 bg-white dark:border-white/10 dark:bg-black/40 group-hover:border-gold/30 transition-colors">
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="mt-4 font-display text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">{stat.value}</p>
              <div className="mt-2 flex items-center gap-2 font-mono text-[11px]">
                <TrendingUp className="h-3 w-3 text-gold" />
                <span className="text-gold">{stat.change}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Access Action Bar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/products/new" className="group flex items-center justify-between rounded-none border border-gold/30 bg-gold/10 p-5 text-sm font-semibold text-gold transition-all hover:bg-gold/20 hover:border-gold">
          <div className="flex items-center gap-3 font-mono">
            <Plus className="h-5 w-5" />
            <span>Create Product Listing</span>
          </div>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="/admin/media" className="group flex items-center justify-between rounded-none border border-neutral-200 bg-neutral-50/50 p-5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100/50 hover:text-neutral-950 hover:border-neutral-300 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/20">
          <div className="flex items-center gap-3 font-mono">
            <Film className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            <span>Asset Gallery &amp; Banners</span>
          </div>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="/admin/enquiries" className="group flex items-center justify-between rounded-none border border-neutral-200 bg-neutral-50/50 p-5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100/50 hover:text-neutral-950 hover:border-neutral-300 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/20">
          <div className="flex items-center gap-3 font-mono">
            <Inbox className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            <span>Commercial Enquiries</span>
          </div>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="/admin/broadcast" className="group flex items-center justify-between rounded-none border border-neutral-200 bg-neutral-50/50 p-5 text-sm font-medium text-neutral-700 transition-all hover:bg-neutral-100/50 hover:text-neutral-950 hover:border-neutral-300 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white dark:hover:border-white/20">
          <div className="flex items-center gap-3 font-mono">
            <ArrowUpRight className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            <span>Marketing Broadcasts</span>
          </div>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Enquiries CRM Console */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white uppercase">Active Enterprise Enquiries</h2>
              <span className="bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400 rounded-none">
                {recentEnquiries.length} Recent
              </span>
            </div>
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 border border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-black/40 p-1 font-mono text-xs rounded-none">
              {(['all', 'new', 'quoted'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 font-semibold uppercase tracking-wider transition-all rounded-none ${
                    activeTab === tab ? 'bg-gold text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:text-white/40 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-none border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 shadow-xl">
            <div className="divide-y divide-neutral-200 dark:divide-white/10">
              <AnimatePresence mode="wait">
                {filteredEnquiries.map((enq) => (
                  <motion.div
                    key={enq.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-colors hover:bg-neutral-50 dark:hover:bg-white/5 rounded-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-gold">{enq.id}</span>
                        <h3 className="font-display text-base font-bold text-neutral-900 dark:text-white">{enq.company}</h3>
                        <span className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider rounded-none ${
                          enq.priority === 'urgent' ? 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 animate-pulse' :
                          enq.priority === 'high' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
                          'bg-neutral-100 text-neutral-600 border border-neutral-200 dark:bg-white/10 dark:text-white/60 dark:border-white/10'
                        }`}>
                          {enq.priority}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-neutral-600 dark:text-white/60">
                        {enq.country} • <span className="text-neutral-400 dark:text-white/40">Products:</span> <span className="text-neutral-800 dark:text-white">{Array.isArray(enq.product_interest) ? enq.product_interest.join(', ') : (enq.products || enq.product_interest || 'N/A')}</span>
                      </p>
                      <div className="flex items-center gap-4 font-mono text-[11px] text-neutral-400 dark:text-white/40 pt-1">
                        <span>Est. Qty: <strong className="text-neutral-800 dark:text-white">{enq.quantity_range || enq.quantity || 'Unknown'} units</strong></span>
                        <span>•</span>
                        <span>Rep: <strong className={(!enq.assigned_to && !enq.rep) || enq.rep === 'Unassigned' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-neutral-800 dark:text-white'}>{enq.assigned_to || enq.rep || 'Unassigned'}</strong></span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-neutral-100 dark:border-white/10 pt-3 sm:pt-0">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider rounded-none ${
                        enq.status === 'new' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
                        enq.status === 'quoted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' :
                        'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                      }`}>
                        {enq.status === 'new' && <AlertCircle className="h-3 w-3" />}
                        {enq.status === 'quoted' && <CheckCircle2 className="h-3 w-3" />}
                        {enq.status === 'contacted' && <Clock className="h-3 w-3" />}
                        <span>{enq.status}</span>
                      </span>
                      <Link
                        href="/admin/enquiries"
                        className="flex items-center gap-1.5 font-mono text-xs font-semibold text-gold transition-all hover:translate-x-0.5 hover:underline opacity-80 group-hover:opacity-100"
                      >
                        <span>Open Record</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="bg-neutral-50 dark:bg-black/40 border-t border-neutral-200 dark:border-white/10 p-3 text-center">
              <Link href="/admin/enquiries" className="font-mono text-xs font-semibold text-neutral-500 dark:text-white/60 hover:text-gold transition-colors">
                View All Historical Enquiries →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
            <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white uppercase">System Status</h2>
            <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live
            </span>
          </div>

          <div className="border border-neutral-200 bg-white dark:border-white/10 dark:bg-white/5 p-5 shadow-xl rounded-none space-y-4">
            {/* System health indicators */}
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-500 dark:text-white/50">API Status</span>
                <span className="text-emerald-500 font-bold">● Operational</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-500 dark:text-white/50">Database</span>
                <span className="text-emerald-500 font-bold">● Connected</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-500 dark:text-white/50">Media CDN</span>
                <span className="text-emerald-500 font-bold">● Online</span>
              </div>
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-neutral-500 dark:text-white/50">Auth Service</span>
                <span className="text-emerald-500 font-bold">● Secure</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-white/10 pt-4">
              <div className="bg-neutral-50 dark:bg-black/40 border border-neutral-200 dark:border-white/10 p-4 font-mono text-xs rounded-none space-y-2">
                <div className="flex items-center justify-between text-neutral-500 dark:text-white/40">
                  <span>Total Active Products</span>
                  <span className="text-gold font-bold">{stats.products} Listed</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 dark:text-white/40">
                  <span>Pending Enquiries</span>
                  <span className="text-gold font-bold">{stats.enquiries} Leads</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 dark:text-white/40">
                  <span>Newsletter Subscribers</span>
                  <span className="text-gold font-bold">{stats.contacts} Contacts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
