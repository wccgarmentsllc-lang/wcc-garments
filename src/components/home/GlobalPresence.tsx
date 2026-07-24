'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

const HQ = { x: 640, y: 310 }

/* Label offsets (lx, ly) position text away from node to avoid overlap.
   anchor: 'start' | 'middle' | 'end' controls SVG text-anchor. */
const HUBS = [
  { id: 'ahm', city: 'Ahmedabad', country: 'India', role: 'Textile Weaving', x: 680, y: 312, lx: -45, ly: 6, anchor: 'end' as const },
  { id: 'lud', city: 'Ludhiana', country: 'India', role: 'Knitwear & Hosiery', x: 692, y: 285, lx: -40, ly: -8, anchor: 'end' as const },
  { id: 'del', city: 'New Delhi', country: 'India', role: 'Fashion & Uniforms', x: 698, y: 297, lx: 20, ly: -18, anchor: 'start' as const },
  { id: 'ban', city: 'Bangalore', country: 'India', role: 'Origin R&D Centre', x: 699, y: 335, lx: -45, ly: 10, anchor: 'end' as const },
  { id: 'tir', city: 'Tirupur', country: 'India', role: 'Bulk Garment Export', x: 700, y: 349, lx: 20, ly: 18, anchor: 'start' as const },
  { id: 'dha', city: 'Dhaka', country: 'Bangladesh', role: 'Volume Production', x: 723, y: 318, lx: 18, ly: -14, anchor: 'start' as const },
  { id: 'gua', city: 'Guangzhou', country: 'China', role: 'Specialised Manufacturing', x: 792, y: 308, lx: 18, ly: -12, anchor: 'start' as const },
]

const EXPORTS = [
  { id: 'lon', label: 'London', x: 475, y: 180, lx: 14, ly: -10, anchor: 'start' as const },
  { id: 'cai', label: 'Cairo', x: 565, y: 285, lx: 14, ly: -10, anchor: 'start' as const },
  { id: 'nai', label: 'Nairobi', x: 595, y: 414, lx: 14, ly: 6, anchor: 'start' as const },
  { id: 'lag', label: 'Lagos', x: 500, y: 389, lx: -12, ly: 10, anchor: 'end' as const },
  { id: 'nya', label: 'New York', x: 280, y: 230, lx: -14, ly: -10, anchor: 'end' as const },
  { id: 'riy', label: 'Riyadh', x: 615, y: 320, lx: -14, ly: 12, anchor: 'end' as const },
  { id: 'sin', label: 'Singapore', x: 763, y: 421, lx: 14, ly: 12, anchor: 'start' as const },
]

function arc(x1: number, y1: number, x2: number, y2: number, lift = 0.38) {
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
  const dist = Math.hypot(x2 - x1, y2 - y1)
  return `M${x1},${y1} Q${mx},${my - dist * lift} ${x2},${y2}`
}

const ZONES = [
  { name: 'GCC & Middle East', pct: 40, cities: 'UAE · KSA · Qatar · Oman · Kuwait' },
  { name: 'Africa', pct: 30, cities: 'Egypt · Kenya · Morocco · Nigeria' },
  { name: 'Europe & UK', pct: 20, cities: 'UK · France · Germany · Italy' },
  { name: 'Asia & Americas', pct: 10, cities: 'Singapore · Japan · USA · Canada' },
]

function Counter({ value, inView }: { value: string; inView: boolean }) {
  const [count, setCount] = useState(0)
  const numericPart = value.replace(/[^0-9]/g, '')
  const suffix = value.replace(/[0-9]/g, '')
  const target = parseInt(numericPart, 10)

  useEffect(() => {
    if (!inView || isNaN(target)) return

    let start = 0
    if (target > 1000) {
      start = target - 50
    }

    const duration = 1200
    const startTime = performance.now()

    const animate = (time: number) => {
      const elapsed = time - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(start + ease * (target - start))
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [inView, target])

  if (isNaN(target)) {
    return <span>{value}</span>
  }

  return (
    <span>
      {count}
      {suffix}
    </span>
  )
}

export function GlobalPresence() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [active, setActive] = useState<string | null>(null)

  const activeHub = HUBS.find(h => h.id === active)

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[var(--bg)] py-16 sm:py-20 lg:py-28"
      data-cursor="view"
    >
      <div className="mx-auto max-w-[1440px] px-3 lg:px-10">

        {/* ── Section label ── */}
        <motion.div
          className="mb-4 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--gold)]"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span>Global Presence</span>
        </motion.div>

        {/* ── Section header ── */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text)] leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            Seven hubs,{' '}
            <span className="font-bold text-shine-blue">three nations infinite reach</span>
          </motion.h2>

        </div>

        {/* ══════════════════════════════════════════════════
            SIDE-BY-SIDE: Map (left) + Content (right)
        ══════════════════════════════════════════════════ */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch">

          {/* ── LEFT: World Map ── */}
          <motion.div
            className="relative lg:col-span-7 overflow-hidden rounded-none border-x-0 border-y border-[var(--border)] -mx-6 w-[calc(100%+3rem)] max-w-none lg:mx-0 lg:w-auto lg:rounded-2xl lg:border flex flex-col"
            style={{ background: 'var(--bg-subtle)' }}
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Map image */}
            <div className="relative w-full flex-1 aspect-[1.8] lg:aspect-auto min-h-[300px]">
              <Image
                src="/world-map-bg.png"
                alt="WCC Garments global operations map"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
              {/* Overlay to blend with theme */}
              <div className="absolute inset-0 bg-[var(--bg)]/30 dark:bg-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-subtle)]/80 via-transparent to-[var(--bg-subtle)]/30" />

              {/* Ambient glow at Dubai */}
              <div
                className="pointer-events-none absolute"
                style={{
                  left: `${(HQ.x / 1000) * 100}%`,
                  top: `${(HQ.y / 600) * 100}%`,
                  transform: 'translate(-50%,-50%)',
                  width: '28%',
                  maxWidth: '200px',
                  aspectRatio: '1',
                  background: 'radial-gradient(circle, var(--gold-muted) 0%, transparent 70%)',
                }}
              />

              {/* SVG arcs + nodes */}
              <svg viewBox="0 0 1000 600" className="absolute inset-0 h-full w-full">
                <defs>
                  <filter id="gl" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="bgl" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="5" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Export arcs */}
                {EXPORTS.map((e, i) => (
                  <motion.path
                    key={'ea' + i}
                    d={arc(HQ.x, HQ.y, e.x, e.y, 0.4)}
                    fill="none"
                    stroke="var(--gold-light)"
                    strokeWidth="0.8"
                    strokeOpacity={0.3}
                    filter="url(#gl)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 2.2, delay: 0.4 + i * 0.12, ease: 'easeInOut' }}
                  />
                ))}

                {/* Hub arcs — gold/blue depending on state */}
                {HUBS.map((h, i) => (
                  <motion.path
                    key={'ha' + i}
                    d={arc(HQ.x, HQ.y, h.x, h.y, 0.3)}
                    fill="none"
                    stroke="var(--gold)"
                    strokeWidth={active === h.id ? 2 : 1.2}
                    strokeOpacity={active === h.id ? 0.9 : 0.45}
                    filter="url(#gl)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                    transition={{ duration: 1.6, delay: 0.2 + i * 0.08, ease: 'easeInOut' }}
                  />
                ))}

                {/* ── Export nodes with labels ── */}
                {EXPORTS.map((e) => {
                  const labelX = e.x + e.lx
                  const labelY = e.y + e.ly
                  return (
                    <g key={'en' + e.id}>
                      {/* Leader line */}
                      <line
                        x1={e.x} y1={e.y} x2={labelX} y2={labelY}
                        stroke="var(--gold-light)" strokeWidth="0.5" strokeOpacity={0.35}
                      />
                      {/* Dot */}
                      <circle cx={e.x} cy={e.y} r="3" fill="var(--gold-light)" opacity={0.6} filter="url(#gl)" />
                      {/* Label */}
                      <text
                        x={labelX} y={labelY}
                        textAnchor={e.anchor}
                        dominantBaseline="middle"
                        fill="var(--gold-light)"
                        fontSize="6" fontFamily="monospace" fontWeight="600" letterSpacing="0.8"
                        opacity={0.7}
                      >
                        {e.label.toUpperCase()}
                      </text>
                    </g>
                  )
                })}

                {/* ── Hub nodes with labels ── */}
                {HUBS.map((h) => {
                  const labelX = h.x + h.lx
                  const labelY = h.y + h.ly
                  const isActive = active === h.id
                  return (
                    <g
                      key={'hn' + h.id}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setActive(h.id)}
                      onMouseLeave={() => setActive(null)}
                    >
                      {/* Leader line */}
                      <motion.line
                        x1={h.x} y1={h.y} x2={labelX} y2={labelY}
                        stroke="var(--gold)"
                        strokeWidth={isActive ? 0.8 : 0.5}
                        strokeOpacity={isActive ? 0.7 : 0.3}
                        initial={{ pathLength: 0 }}
                        animate={inView ? { pathLength: 1 } : {}}
                        transition={{ duration: 0.6, delay: 0.8 }}
                      />
                      {/* Glow ring */}
                      <motion.circle
                        cx={h.x} cy={h.y} r="14"
                        fill="var(--gold)"
                        opacity={isActive ? 0.15 : 0.05}
                        filter="url(#bgl)"
                        animate={isActive ? { r: [14, 20, 14] } : {}}
                        transition={{ duration: 1.4, repeat: Infinity }}
                      />
                      {/* Node dot */}
                      <circle
                        cx={h.x} cy={h.y}
                        r={isActive ? 5 : 3.5}
                        fill="var(--gold)"
                        opacity={isActive ? 1 : 0.7}
                        filter="url(#gl)"
                      />
                      {/* City label */}
                      <text
                        x={labelX} y={labelY}
                        textAnchor={h.anchor}
                        dominantBaseline="middle"
                        fill="var(--gold)"
                        fontSize={isActive ? 7 : 6}
                        fontFamily="monospace"
                        fontWeight={isActive ? 800 : 600}
                        letterSpacing="0.8"
                        opacity={isActive ? 1 : 0.65}
                      >
                        {h.city.toUpperCase()}
                      </text>
                    </g>
                  )
                })}

                {/* Dubai HQ — pulsing beacon */}
                <motion.circle
                  cx={HQ.x}
                  cy={HQ.y}
                  r="26"
                  fill="var(--gold)"
                  opacity={0.1}
                  animate={{ r: [26, 38, 26], opacity: [0.1, 0.03, 0.1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  filter="url(#bgl)"
                />
                <circle cx={HQ.x} cy={HQ.y} r="6" fill="var(--gold)" filter="url(#bgl)" opacity={0.6} />
                <circle cx={HQ.x} cy={HQ.y} r="3.5" fill="var(--gold)" />
                <text
                  x={HQ.x}
                  y={HQ.y - 13}
                  textAnchor="middle"
                  fill="var(--gold)"
                  fontSize="7.5"
                  fontFamily="monospace"
                  fontWeight="700"
                  letterSpacing="2"
                >
                  DUBAI HQ
                </text>
              </svg>
            </div>

            {/* Map bottom stat strip */}
            <div className="hidden lg:grid grid-cols-4 border-t border-[var(--border)] bg-[var(--bg-surface)]/75 backdrop-blur-md">
              {[
                {
                  v: '7',
                  l: 'Hubs',
                  desc: 'Regional manufacturing centres',
                  icon: (
                    <svg className="w-5 h-5 text-[var(--gold)] group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity={0.2} />
                      <circle cx="12" cy="4" r="2" />
                      <circle cx="4" cy="12" r="2" />
                      <circle cx="20" cy="12" r="2" />
                      <circle cx="12" cy="20" r="2" />
                      <path d="M12 6v3M12 15v3M6 12h3M15 12h3" />
                    </svg>
                  )
                },
                {
                  v: '3',
                  l: 'Countries',
                  desc: 'Sourcing & production bases',
                  icon: (
                    <svg className="w-5 h-5 text-[var(--gold)] group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3.6 9h16.8M3.6 15h16.8" />
                      <path d="M11.5 3a17 17 0 000 18M12.5 3a17 17 0 010 18" />
                    </svg>
                  )
                },
                {
                  v: '50+',
                  l: 'Nations',
                  desc: 'Global B2B cargo distribution',
                  icon: (
                    <svg className="w-5 h-5 text-[var(--gold)] group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  )
                },
                {
                  v: '2001',
                  l: 'Founded',
                  desc: 'Over two decades of heritage',
                  icon: (
                    <svg className="w-5 h-5 text-[var(--gold)] group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
              ].map(({ v, l, desc, icon }, idx) => (
                <div
                  key={l}
                  className={`group relative flex flex-col items-start py-6 lg:py-8 px-6 lg:px-8 transition-colors duration-300 hover:bg-[var(--bg-surface)]/50 ${
                    idx % 2 === 0 ? 'border-r border-[var(--border)]' : ''
                  } ${idx >= 2 ? 'border-t border-[var(--border)] lg:border-t-0' : ''} lg:border-r lg:last:border-r-0`}
                >
                  {/* Icon */}
                  <div className="mb-4 flex items-center justify-center text-[var(--gold)]/80 transition-colors duration-300 group-hover:text-[var(--gold)]">
                    {icon}
                  </div>

                  {/* Stat Number */}
                  <h3 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text)]">
                    <Counter value={v} inView={inView} />
                  </h3>

                  {/* Label & Description */}
                  <div className="mt-3">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--gold)] mb-1.5">
                      {l}
                    </p>
                    <p className="text-[11px] sm:text-xs text-[var(--text-muted)] leading-relaxed max-w-[160px]">
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Content Panel ── */}
          <motion.div
            className="flex flex-col gap-5 lg:col-span-5"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Dubai HQ card */}
            <div className="rounded-xl border border-[var(--gold)]/25 bg-[var(--gold-muted)] p-4 flex items-center gap-4">
              <div className="relative h-3 w-3 shrink-0">
                <span className="absolute inset-0 animate-ping rounded-full bg-[var(--gold)] opacity-60" />
                <span className="relative block h-3 w-3 rounded-full bg-[var(--gold)]" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-[var(--text)] leading-none">
                  Dubai, UAE
                </p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Corporate HQ · Jebel Ali Export
                </p>
              </div>
            </div>

            {/* Hub list */}
            <div className="flex flex-col gap-1.5 flex-1">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)] mb-1">
                Production Centres
              </p>
              <div className="grid grid-cols-2 gap-2.5 lg:flex lg:flex-col lg:gap-1.5 flex-1 lg:justify-between">
                {HUBS.map((hub, i) => (
                  <motion.div
                    key={hub.id}
                    className={`group relative flex flex-col justify-between items-start gap-2 rounded-xl border p-3.5 cursor-default transition-all duration-500 overflow-hidden lg:flex-row lg:items-center lg:gap-3 lg:px-4 lg:py-3 ${active === hub.id
                      ? 'border-[var(--gold)]/40 bg-[var(--gold-muted)] shadow-[0_4px_20px_rgba(212,175,55,0.08)]'
                      : 'border-[var(--border)] bg-[var(--bg-surface)]/60 hover:border-[var(--gold)]/20 hover:bg-[var(--bg-surface)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.03)]'
                      }`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                    onMouseEnter={() => setActive(hub.id)}
                    onMouseLeave={() => setActive(null)}
                  >
                    {/* Ambient card hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--gold-muted)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Index and Status indicator */}
                    <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto lg:shrink-0">
                      <span className="hidden lg:inline-block w-5 shrink-0 font-mono text-[10px] font-bold text-[var(--text-muted)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      <span
                        className={`h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${active === hub.id
                          ? 'bg-[var(--gold)] shadow-[0_0_8px_var(--gold)] scale-110'
                          : 'bg-[var(--text-muted)]/30'
                          }`}
                      />

                      {/* City (on mobile, we group the city inside this top header) */}
                      <div className="min-w-0 flex-1 lg:hidden">
                        <p
                          className={`font-display text-sm sm:text-base font-bold leading-none transition-colors duration-300 truncate ${active === hub.id ? 'text-[var(--gold)]' : 'text-[var(--text)]'
                            }`}
                        >
                          {hub.city}
                        </p>
                      </div>
                    </div>

                    {/* City and Role (Desktop layout, or mobile layout wrapped nicely) */}
                    <div className="min-w-0 flex-1 hidden lg:block">
                      <p
                        className={`font-display text-base font-bold leading-none transition-colors duration-300 ${active === hub.id ? 'text-[var(--gold)] font-bold' : 'text-[var(--text)]'
                          }`}
                      >
                        {hub.city}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] truncate">
                        {hub.role}
                      </p>
                    </div>

                    {/* Role for mobile layout (below the header) */}
                    <div className="w-full min-w-0 lg:hidden mt-0.5">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] truncate">
                        {hub.role}
                      </p>
                    </div>

                    {/* Country tag */}
                    <span className="shrink-0 rounded-full border border-[var(--border)] bg-[var(--bg-subtle)]/40 px-2 py-0.5 font-mono text-[8px] uppercase tracking-wider text-[var(--text-muted)] group-hover:border-[var(--gold)]/30 group-hover:text-[var(--text)] transition-all duration-300">
                      {hub.country}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════════════
            EXPORT DISTRIBUTION — below the map panel
        ══════════════════════════════════════════════════ */}
        <motion.div
          className="mt-16 border-t border-[var(--border)] pt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Left heading */}
            <div>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--gold)]">
                Export Distribution
              </span>
              <h3 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-[var(--text)] sm:text-4xl">
                Four Continents One Supply Chain.

              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
                Containerised B2B wholesale cargo dispatched via Jebel Ali Port to distributors, hospitality groups, and institutional buyers in 50+ nations.
              </p>
            </div>

            {/* Right — zone bars */}
            <div className="space-y-5 ">
              {ZONES.map((z, i) => (
                <motion.div
                  key={z.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
                >
                  <div className="mb-1.5 flex items-baseline justify-between">
                    <span className="font-display text-lg font-bold text-[var(--text)]">
                      {z.name}
                    </span>
                    <span className="font-display text-3xl font-bold text-[var(--gold)]">
                      {z.pct}%
                    </span>
                  </div>
                  <div className="h-[5px] w-full overflow-hidden rounded-full bg-[var(--border)]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'var(--gold)' }}
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${z.pct}%` } : {}}
                      transition={{ duration: 1.4, delay: 0.6 + i * 0.12, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                    {z.cities}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
