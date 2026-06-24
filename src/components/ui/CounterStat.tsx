'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

interface CounterStatProps {
  end: number
  suffix?: string
  prefix?: string
  label: string
  duration?: number
  className?: string
}

export function CounterStat({
  end,
  suffix = '',
  prefix = '',
  label,
  duration = 2000,
  className = 'text-left',
}: CounterStatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(startValue + (end - startValue) * eased)

      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, end, duration])

  return (
    <div ref={ref} className={className}>
      {/* Clean Premium Editorial Display Number */}
      <div className="font-display text-4xl font-bold tracking-tight text-[var(--text)] md:text-5xl lg:text-6xl">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      {/* Premium Mono Uppercase Gold Label */}
      <div className="mt-2 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
        {label}
      </div>
    </div>
  )
}
