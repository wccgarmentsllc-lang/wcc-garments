import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface RevealImageProps {
  src: string
  alt: string
  className?: string
  coverColor?: string
  delay?: number
}

export function RevealImage({ src, alt, className = '', coverColor = '#f5f2ee', delay = 0 }: RevealImageProps) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        animate={{ scale: inView ? 1 : 1.08 }}
        transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94], delay }}
        className="w-full h-full object-cover"
      />
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: inView ? '-102%' : '0%' }}
        transition={{
          duration: 0.9,
          ease: [0.76, 0, 0.24, 1],
          delay,
        }}
        className="absolute inset-0 z-10"
        style={{ background: coverColor }}
      />
    </div>
  )
}
