'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Loader2 } from 'lucide-react'

interface SplitSubmitButtonProps {
  loading?: boolean
  success?: boolean
  label?: string
  loadingLabel?: string
  successLabel?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function SplitSubmitButton({
  loading = false,
  success = false,
  label = 'Submit Enquiry',
  loadingLabel = 'Processing...',
  successLabel = 'Enquiry Sent',
  onClick,
  disabled = false,
  className = '',
}: SplitSubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      onClick={onClick}
      disabled={disabled || loading || success}
      className={`group relative z-30 cursor-pointer flex h-14 w-full items-center overflow-hidden border border-gold font-mono text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-500 disabled:opacity-60 disabled:cursor-not-allowed ${
        success
          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
          : 'bg-gold text-white hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)]'
      } ${className}`}
      whileHover={{ scale: disabled || loading || success ? 1 : 1.01 }}
      whileTap={{ scale: disabled || loading || success ? 1 : 0.98 }}
      data-cursor="button"
    >
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full items-center justify-center gap-3 font-display text-sm text-emerald-400"
          >
            <Check className="h-5 w-5 text-emerald-400" />
            <span>✓ {successLabel}</span>
          </motion.div>
        ) : loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative flex w-full flex-col items-center justify-center text-white"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{loadingLabel}</span>
            </div>
            {/* Animated Loading Line */}
            <div className="absolute bottom-1 left-0 right-0 h-[2px] overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-white"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex w-full h-full items-center justify-between"
          >
            {/* Left Fill */}
            <div className="flex h-full flex-1 items-center justify-center bg-gold px-6 text-white transition-colors group-hover:bg-gold-light">
              <span>{label}</span>
            </div>
            {/* Right Split Strip */}
            <div className="flex h-full w-16 items-center justify-center bg-gold-dark text-white transition-colors group-hover:bg-gold">
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
