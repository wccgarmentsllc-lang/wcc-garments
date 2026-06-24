'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface QuoteButtonProps {
  onClick?: () => void
  href?: string
  className?: string
}

export function QuoteButton({ onClick, href, className = '' }: QuoteButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const content = (
    <motion.div
      className={`group relative flex h-[56px] items-center justify-between gap-6 overflow-hidden rounded-full border border-gold px-8 transition-all duration-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      data-cursor="button"
    >
      {/* Animated Center Fill */}
      <motion.div
        className="absolute inset-0 z-0 bg-gradient-to-r from-gold to-gold-light"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: isHovered ? 1.5 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      />

      <div className="relative z-10 flex flex-col items-start justify-center">
        <span
          className={`font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
            isHovered ? 'text-black' : 'text-gold'
          }`}
        >
          Request a Quotation
        </span>
        <span
          className={`text-[9px] uppercase tracking-wider transition-colors duration-300 ${
            isHovered ? 'text-black/70' : 'text-[var(--text-muted)]'
          }`}
        >
          Bulk Orders & OEM Available
        </span>
      </div>

      <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gold/10 transition-colors duration-300 group-hover:bg-black/10">
        <ArrowUpRight
          className={`h-4 w-4 transition-transform duration-500 ease-premium ${
            isHovered ? 'rotate-45 text-black' : 'text-gold'
          }`}
        />
      </div>
    </motion.div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return <button type="button" onClick={onClick} className="p-0 border-none bg-transparent cursor-pointer">{content}</button>
}
