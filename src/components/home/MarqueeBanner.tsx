'use client'

import { motion } from 'framer-motion'

const MARQUEE_ROW_1 = [
  'GARMENTS', 'UNIFORMS', 'HOSPITALITY', 'HOME FURNISHINGS',
  'FRAGRANCE', 'HOUSEHOLDS', 'INDUSTRIAL TEXTILES',
  'PRIVATE LABEL', 'BULK PRODUCTION', 'UAE EXPORT',
  'WHOLESALE MANUFACTURING', 'GLOBAL DISTRIBUTION',
  'GCC SUPPLY', 'AFRICA EXPORT', 'OEM SERVICES',
  'ISO CERTIFIED', 'B2B FOCUSED', 'DUBAI BASED'
]

const BOLD_ITEMS = [
  'GARMENTS', 'UNIFORMS', 'HOSPITALITY', 'HOME FURNISHINGS',
  'FRAGRANCE', 'HOUSEHOLDS', 'INDUSTRIAL TEXTILES'
]

export function MarqueeBanner() {
  return (
    <motion.div
      className="border-y border-[var(--border)] bg-[#1e68f1] py-3.5 my-10 overflow-hidden font-body text-[10px] font-bold uppercase tracking-[0.25em] text-white"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Row 1 — Moving Left */}
      <div className="marquee-container">
        <motion.div
          className="marquee-track flex items-center gap-12"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        >
          {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((item, index) => (
            <div key={index} className="flex items-center gap-12 flex-shrink-0">
              <span>{item}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
