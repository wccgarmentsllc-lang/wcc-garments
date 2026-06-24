import { motion } from 'framer-motion'

interface MarqueeBannerProps {
  dark?: boolean
  speed?: number
}

const items = [
  'NEW COLLECTION 2026',
  'WCC GARMENTS',
  'PREMIUM QUALITY',
  'UAE',
  'CRAFTED WITH EXCELLENCE',
  'FREE SHIPPING UAE',
  'GARMENTS · HOME LINEN · HOUSEHOLD',
  'FABRIC OF EXCELLENCE',
]

export function MarqueeBanner({ dark = true, speed = 25 }: MarqueeBannerProps) {
  const doubled = [...items, ...items, ...items]

  return (
    <div
      className="overflow-hidden py-3 border-y"
      style={{
        background: dark ? 'rgba(0,0,0,0.95)' : 'rgba(250,248,245,1)',
        borderColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
      }}
    >
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{
          duration: speed,
          ease: 'linear',
          repeat: Infinity,
        }}
        className="flex whitespace-nowrap will-change-transform"
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-6 mx-6"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: '10px',
              letterSpacing: '0.5em',
              color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
            }}
          >
            {item}
            <span
              className="inline-block w-1 h-1 rounded-full flex-shrink-0"
              style={{ background: dark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  )
}
