import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MarqueeBanner } from './MarqueeBanner'

const sections = [
  {
    id: 0,
    bg: '#080808',
    image: '/hero-main.jpg',
    label: 'Collection 2026',
    title: 'WCC\nGARMENTS',
    subtitle: 'LUXURY · QUALITY · EXCELLENCE',
    cta: 'Explore Collection',
    accent: 'white',
  },
  {
    id: 1,
    bg: '#0e0c09',
    image: '/hero-garments.jpg',
    label: 'Division One',
    title: 'GARMENTS',
    subtitle: 'CRAFTED FOR EVERY OCCASION',
    cta: 'Shop Garments',
    accent: 'white',
  },
  {
    id: 2,
    bg: '#f7f4f0',
    image: '/hero-linen.jpg',
    label: 'Division Two',
    title: 'HOME\nLINEN',
    subtitle: 'WHERE COMFORT MEETS ELEGANCE',
    cta: 'Shop Linen',
    accent: 'dark',
  },
  {
    id: 3,
    bg: '#111010',
    image: '/hero-household.jpg',
    label: 'Division Three',
    title: 'HOUSE\nHOLD',
    subtitle: 'QUALITY FOR EVERY CORNER',
    cta: 'Shop Household',
    accent: 'white',
  },
]

interface FullPageScrollProps {
  onSectionChange?: (index: number) => void
  onExitBottom?: () => void
}

export function FullPageScroll({ onSectionChange, onExitBottom }: FullPageScrollProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const touchStart = useRef<number | null>(null)
  const lastWheelTime = useRef(0)

  const goToNext = useCallback(() => {
    if (animating) return
    if (current >= sections.length - 1) {
      onExitBottom?.()
      return
    }
    setAnimating(true)
    setCurrent(prev => prev + 1)
    setTimeout(() => setAnimating(false), 1100)
  }, [animating, current, onExitBottom])

  const goToPrev = useCallback(() => {
    if (animating || current <= 0) return
    setAnimating(true)
    setCurrent(prev => prev - 1)
    setTimeout(() => setAnimating(false), 1100)
  }, [animating, current])

  useEffect(() => {
    onSectionChange?.(current)
  }, [current, onSectionChange])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheelTime.current < 200) return
      lastWheelTime.current = now
      if (Math.abs(e.deltaY) < 10) return
      if (e.deltaY > 0) goToNext()
      else goToPrev()
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [goToNext, goToPrev])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStart.current = e.touches[0].clientY
    }
    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStart.current === null) return
      const diff = touchStart.current - e.changedTouches[0].clientY
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToNext()
        else goToPrev()
      }
      touchStart.current = null
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [goToNext, goToPrev])

  const isDark = (accent: string) => accent === 'white'

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ cursor: 'none' }}>
      <AnimatePresence initial={false} mode="wait">
        {sections.map((section, i) =>
          i === current ? (
            <motion.div
              key={section.id}
              initial={{ y: '100%' }}
              animate={{ y: '0%' }}
              exit={{ y: '-100%' }}
              transition={{
                duration: 1.0,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="absolute inset-0"
              style={{ background: section.bg }}
            >
              {/* Background image with parallax scale */}
              <motion.div
                initial={{ scale: 1.08 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="absolute inset-0"
              >
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover"
                  style={{ opacity: section.accent === 'dark' ? 0.5 : 0.55 }}
                />
              </motion.div>

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    section.accent === 'dark'
                      ? 'linear-gradient(to top, rgba(247,244,240,0.95) 0%, rgba(247,244,240,0.3) 60%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                }}
              />

              {/* Fabric weave texture overlay */}
              <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    0deg, transparent, transparent 3px,
                    ${isDark(section.accent) ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 3px,
                    ${isDark(section.accent) ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 4px
                  )`,
                }}
              />

              {/* Top bar */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="absolute top-0 left-0 right-0 flex justify-between items-center px-10 pt-8"
              >
                <span
                  className="text-[10px] tracking-[0.5em] uppercase"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    color: isDark(section.accent) ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)',
                  }}
                >
                  {section.label}
                </span>
                <span
                  className="text-[10px] tracking-[0.3em] uppercase"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    color: isDark(section.accent) ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.4)',
                  }}
                >
                  WCC Group
                </span>
              </motion.div>

              {/* Main content — bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-10 pb-16">
                {/* Section number */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-4"
                >
                  <span
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 200,
                      fontSize: '11px',
                      letterSpacing: '0.4em',
                      color: isDark(section.accent) ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                    }}
                  >
                    0{i + 1} / 0{sections.length}
                  </span>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: '10px',
                    letterSpacing: '0.5em',
                    color: isDark(section.accent) ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
                    marginBottom: '16px',
                  }}
                >
                  {section.subtitle}
                </motion.p>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ marginBottom: '36px' }}
                >
                  {section.title.split('\n').map((line, li) => (
                    <div
                      key={li}
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300,
                        fontSize: 'clamp(56px, 10vw, 120px)',
                        letterSpacing: '0.12em',
                        lineHeight: 0.95,
                        color: isDark(section.accent) ? '#ffffff' : '#0a0a0a',
                        display: 'block',
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </motion.div>

                {/* CTA */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  className="group inline-flex items-center gap-4"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: '11px',
                    letterSpacing: '0.4em',
                    color: isDark(section.accent) ? '#ffffff' : '#0a0a0a',
                    background: 'none',
                    border: 'none',
                    cursor: 'none',
                    padding: 0,
                  }}
                >
                  <motion.span
                    className="inline-block"
                    style={{
                      width: '48px',
                      height: '1px',
                      background: isDark(section.accent) ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                      transition: 'width 0.5s ease',
                    }}
                    whileHover={{ width: '80px' } as any}
                  />
                  {section.cta}
                </motion.button>
              </div>

              {/* Scroll indicator */}
              {i < sections.length - 1 && (
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="absolute bottom-10 right-10"
                >
                  <div
                    style={{
                      width: '1px',
                      height: '48px',
                      background: isDark(section.accent) ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)',
                    }}
                  />
                </motion.div>
              )}
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Side navigation dots */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (!animating) {
                setAnimating(true)
                setCurrent(i)
                setTimeout(() => setAnimating(false), 1100)
              }
            }}
            style={{
              cursor: 'none',
              border: 'none',
              padding: '4px',
              background: 'none',
            }}
            aria-label={`Go to section ${i + 1}`}
          >
            <motion.div
              animate={{
                height: i === current ? 24 : 10,
                opacity: i === current ? 1 : 0.35,
              }}
              transition={{ duration: 0.4 }}
              style={{
                width: '1px',
                background: sections[current].accent === 'dark' ? '#0a0a0a' : '#ffffff',
                borderRadius: '2px',
              }}
            />
          </button>
        ))}
      </div>

      {/* Bottom marquee on last section */}
      {current === sections.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-0 left-0 right-0 z-20"
        >
          <MarqueeBanner dark speed={30} />
        </motion.div>
      )}
    </div>
  )
}
