'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ShieldCheck, MessageSquare, LayoutGrid, Check, Lock, ArrowUpRight } from 'lucide-react'

const PILLARS = [
  {
    id: 'telemetry',
    title: 'Real-time freight telemetry',
    desc: 'Direct API integration with Jebel Ali terminal networks providing live container tracking and instant customs clearance updates.',
  },
  {
    id: 'vault',
    title: 'Secure pattern encryption',
    desc: 'End-to-end proprietary CAD encryption guaranteeing absolute confidentiality for your custom fashion and uniform specifications.',
  },
  {
    id: 'portals',
    title: 'Dedicated B2B workspaces',
    desc: 'Collaborative procurement portals allowing distributor teams to manage repeat orders, MOQs, and pro-forma invoices instantly.',
  },
]

export function WhyWCC() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <section className="bg-[var(--bg)] py-20" ref={ref} data-cursor="view">
      <div className="mx-auto max-w-[1440px] px-3 lg:px-10">
        {/* Margined Section Number */}
        <div className=" flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
          <span>Sovereign Infrastructure</span>
        </div>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--text)]">
              Engineered for sovereign <span className='text-gold'>scale</span>
            </h2>
          </motion.div>
          {/* <motion.p
            className="max-w-md text-sm text-[var(--text-muted)] leading-relaxed"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          >
            Our digital infrastructure perfectly mirrors our industrial floor — secure, instantaneous, and architected for high-volume commercial execution.
          </motion.p> */}
        </div>

        {/* Premium Bento Frame (Dark Glass Enclosure) */}
        <motion.div
          className="rounded-[32px] bg-[#0A0A0A] p-4 sm:p-6 lg:p-8 border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">

            {/* Card 1: Real-Time Telemetry */}
            <motion.div
              className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#121212] border border-white/5 p-8 lg:p-10 transition-all duration-500 hover:border-gold/40 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
              onHoverStart={() => setHoveredCard('telemetry')}
              onHoverEnd={() => setHoveredCard(null)}
            >
              {/* Top Interactive Graphic Container */}
              <div className="relative h-56 w-full flex items-center justify-center bg-[#181818] rounded-2xl border border-white/5 overflow-hidden mb-8 group-hover:border-gold/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] z-10" />

                {/* Simulated Floating Chat Bubbles */}
                <div className="relative z-20 flex flex-col gap-3 w-full max-w-[240px]">
                  <motion.div
                    className="flex items-center gap-2 rounded-full bg-[#222] px-4 py-2 border border-white/10 text-white text-[11px] shadow-lg"
                    animate={hoveredCard === 'telemetry' ? { y: [0, -4, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Container #8942 Deployed</span>
                  </motion.div>

                  <motion.div
                    className="self-end flex items-center gap-2 rounded-full bg-gold/20 text-gold px-4 py-2 border border-gold/30 text-[11px] font-mono shadow-lg"
                    animate={hoveredCard === 'telemetry' ? { y: [0, 4, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  >
                    <span>ETA Dubai Port: 4h</span>
                    <Check className="h-3 w-3" />
                  </motion.div>
                </div>
              </div>

              {/* Bottom Copy */}
              <div className="relative z-20">
                <h3 className="font-body text-xl font-bold tracking-tight text-white transition-colors group-hover:text-gold">
                  {PILLARS[0].title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-white/60">
                  {PILLARS[0].desc}
                </p>
              </div>
            </motion.div>

            {/* Card 2: Secure Pattern Encryption */}
            <motion.div
              className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#121212] border border-white/5 p-8 lg:p-10 transition-all duration-500 hover:border-gold/40 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
              onHoverStart={() => setHoveredCard('vault')}
              onHoverEnd={() => setHoveredCard(null)}
            >
              {/* Top Interactive Graphic Container */}
              <div className="relative h-56 w-full flex items-center justify-center bg-[#181818] rounded-2xl border border-white/5 overflow-hidden mb-8 group-hover:border-gold/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] z-10" />
                <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-60 transition-opacity">
                  <div className="h-32 w-32 rounded-full bg-gold/20 blur-2xl" />
                </div>

                {/* Simulated Vault Graphic */}
                <div className="relative z-20 flex flex-col items-center">
                  <motion.div
                    className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500/20 to-gold bg-[#222] border border-gold/40 shadow-2xl"
                    animate={hoveredCard === 'vault' ? { rotate: [0, 10, -10, 0], scale: 1.1 } : {}}
                    transition={{ duration: 0.6 }}
                  >
                    <Lock className="h-8 w-8 text-gold" />
                  </motion.div>
                  <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-white/50 bg-black/80 px-3 py-1 rounded-full border border-white/10">
                    AES-256 Pattern Vault
                  </span>
                </div>
              </div>

              {/* Bottom Copy */}
              <div className="relative z-20">
                <h3 className="font-body text-xl font-bold tracking-tight text-white transition-colors group-hover:text-gold">
                  {PILLARS[1].title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-white/60">
                  {PILLARS[1].desc}
                </p>
              </div>
            </motion.div>

            {/* Card 3: Dedicated B2B Workspaces */}
            <motion.div
              className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-[#121212] border border-white/5 p-8 lg:p-10 transition-all duration-500 hover:border-gold/40 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)]"
              onHoverStart={() => setHoveredCard('portals')}
              onHoverEnd={() => setHoveredCard(null)}
            >
              {/* Top Interactive Graphic Container */}
              <div className="relative h-56 w-full flex items-center justify-center bg-[#181818] rounded-2xl border border-white/5 overflow-hidden mb-8 group-hover:border-gold/30 transition-colors">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212] z-10" />

                {/* Simulated Procurement Portal UI */}
                <div className="relative z-20 w-full max-w-[240px] rounded-xl bg-[#222] border border-white/10 p-4 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-400" />
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </div>
                    <span className="font-mono text-[9px] text-white/40">wcc-portal.ae</span>
                  </div>
                  <div className="mt-3 space-y-2 font-mono text-[10px]">
                    <div className="flex items-center justify-between text-white/80">
                      <span>Bulk PO #4092</span>
                      <span className="text-gold">Verified</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        className="h-full bg-gold"
                        initial={{ width: '60%' }}
                        animate={hoveredCard === 'portals' ? { width: '100%' } : {}}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>

                  {/* Simulated Hover Cursor Tag */}
                  <motion.div
                    className="absolute -right-2 -bottom-2 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-black shadow-lg"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={hoveredCard === 'portals' ? { scale: 1, opacity: 1, x: -10, y: -5 } : {}}
                  >
                    <span>Account Exec #4</span>
                  </motion.div>
                </div>
              </div>

              {/* Bottom Copy */}
              <div className="relative z-20">
                <h3 className="font-body text-xl font-bold tracking-tight text-white transition-colors group-hover:text-gold">
                  {PILLARS[2].title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-white/60">
                  {PILLARS[2].desc}
                </p>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}
