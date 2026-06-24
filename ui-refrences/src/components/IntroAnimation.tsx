import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface IntroAnimationProps {
  onComplete: () => void
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const seen = sessionStorage.getItem('wcc-intro')
    if (seen) {
      onComplete()
      return
    }

    const timers = [
      setTimeout(() => setStage(1), 400),
      setTimeout(() => setStage(2), 1400),
      setTimeout(() => setStage(3), 2600),
      setTimeout(() => setStage(4), 3800),
    ]

    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (stage === 4) {
      sessionStorage.setItem('wcc-intro', 'seen')
      setTimeout(onComplete, 700)
    }
  }, [stage, onComplete])

  return (
    <AnimatePresence>
      {stage < 4 && (
        <motion.div
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[999] bg-black flex items-center justify-center overflow-hidden"
        >
          {/* Fabric texture overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.03) 2px,
                rgba(255,255,255,0.03) 4px
              ), repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.03) 2px,
                rgba(255,255,255,0.03) 4px
              )`,
            }}
          />

          {/* Stage 1 — Thread Line horizontal */}
          {stage >= 1 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-1/2 left-0 right-0 origin-left"
              style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(255,255,255,0.7), rgba(255,255,255,0.4), transparent)' }}
            />
          )}

          {/* Thread glow effect */}
          {stage >= 1 && (
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="absolute top-1/2 left-0 right-0 origin-left"
              style={{
                height: '6px',
                marginTop: '-3px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05), transparent)',
                filter: 'blur(2px)',
              }}
            />
          )}

          {/* Stage 2 — WCC Letters */}
          {stage >= 2 && (
            <div className="flex gap-2 z-10 items-center">
              {'WCC'.split('').map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    delay: i * 0.2,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="text-white select-none"
                  style={{
                    fontSize: 'clamp(80px, 15vw, 160px)',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    letterSpacing: '0.15em',
                    lineHeight: 1,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          )}

          {/* Stage 2 — Tagline */}
          {stage >= 2 && (
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, letterSpacing: '0.8em' }}
              transition={{ delay: 0.7, duration: 1.2, ease: 'easeOut' }}
              className="absolute text-white/40 text-xs uppercase tracking-[0.8em]"
              style={{
                bottom: '38%',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
              }}
            >
              Fabric of Excellence
            </motion.p>
          )}

          {/* Stage 3 — Fabric reveal panels */}
          {stage >= 3 && (
            <>
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 origin-top"
                style={{ background: 'linear-gradient(180deg, #1a1209 0%, #0d0d0d 100%)' }}
              />
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
                className="absolute inset-0 origin-bottom"
                style={{ background: 'linear-gradient(0deg, #0a0a0a 0%, #111109 100%)' }}
              />
              {/* Shimmer line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute inset-x-0 z-10"
                style={{
                  top: '50%',
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,220,130,0.6), transparent)',
                }}
              />
            </>
          )}

          {/* Needle dot traveling */}
          {stage >= 1 && stage < 2 && (
            <motion.div
              initial={{ left: '-2%' }}
              animate={{ left: '102%' }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white"
              style={{ position: 'absolute' }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
