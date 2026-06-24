'use client'

import { useEffect, useRef, ReactNode } from 'react'
import { motion, useInView, useAnimation } from 'framer-motion'

interface RevealTextProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

export function RevealText({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const controls = useAnimation()

  const directionMap = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 },
  }

  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{
          opacity: 0,
          ...directionMap[direction],
        }}
        animate={controls}
        variants={{
          visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
              duration: 0.8,
              delay,
              ease: [0.76, 0, 0.24, 1],
            },
          },
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}
