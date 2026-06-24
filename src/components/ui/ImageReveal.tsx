'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'

interface ImageRevealProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  delay?: number
  priority?: boolean
}

export function ImageReveal({
  src,
  alt,
  width,
  height,
  className = '',
  delay = 0,
  priority = false,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 z-10 origin-left bg-gold"
        initial={{ scaleX: 1 }}
        animate={isInView ? { scaleX: 0 } : { scaleX: 1 }}
        transition={{
          duration: 0.8,
          delay: delay + 0.3,
          ease: [0.76, 0, 0.24, 1],
        }}
      />
      <motion.div
        initial={{ scale: 1.3, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 1.3, opacity: 0 }}
        transition={{
          duration: 1,
          delay: delay + 0.5,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full object-cover"
          priority={priority}
        />
      </motion.div>
    </div>
  )
}
