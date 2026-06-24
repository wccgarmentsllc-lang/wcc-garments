'use client'

import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useThemeContext } from '@/context/ThemeContext'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggleTheme } = useThemeContext()

  return (
    <button
      onClick={toggleTheme}
      className={`relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] transition-colors duration-300 hover:border-gold ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-gold" />
        ) : (
          <Sun className="h-4 w-4 text-gold" />
        )}
      </motion.div>
    </button>
  )
}
