import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [label, setLabel] = useState('View')

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor]')) {
        setHovered(true)
        const el = target.closest('[data-cursor-label]') as HTMLElement
        if (el) setLabel(el.dataset.cursorLabel || 'View')
        else setLabel('View')
      }
    }

    const out = () => setHovered(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mouseout', out)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
      window.removeEventListener('mouseout', out)
    }
  }, [])

  // Only show on non-touch devices
  if (hidden) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-white mix-blend-difference flex items-center justify-center"
        animate={{
          x: pos.x - (hovered ? 32 : 20),
          y: pos.y - (hovered ? 32 : 20),
          width: hovered ? 64 : 40,
          height: hovered ? 64 : 40,
          opacity: hidden ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 180,
          damping: 18,
          mass: 0.5,
        }}
      >
        {hovered && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-[8px] tracking-widest text-white uppercase select-none"
            style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 400 }}
          >
            {label}
          </motion.span>
        )}
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
        animate={{
          x: pos.x - 3,
          y: pos.y - 3,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      />
    </>
  )
}
