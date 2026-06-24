import { motion } from 'framer-motion'
import { SplitText } from './SplitText'

const stats = [
  { number: '25+', label: 'Years of Excellence' },
  { number: '12', label: 'Countries Served' },
  { number: '500K+', label: 'Products Delivered' },
  { number: 'UAE', label: 'Headquarters' },
]

export function AboutSection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: '#0a0a0a', padding: '120px 0' }}
    >
      {/* Fabric grain texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left — Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: '10px',
                letterSpacing: '0.5em',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: '24px',
              }}
            >
              WHO WE ARE
            </motion.p>

            <SplitText
              text="Crafted For Excellence"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 'clamp(38px, 5vw, 64px)',
                letterSpacing: '0.06em',
                lineHeight: 1.1,
                color: '#ffffff',
                marginBottom: '32px',
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '18px',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.55)',
                maxWidth: '480px',
              }}
            >
              WCC Garments is a premium manufacturer and distributor of garments, home linen, 
              and household products. With manufacturing excellence across Korea, China, and Africa, 
              we bring the world's finest fabrics to the UAE market.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-4 mt-10"
              style={{ cursor: 'none' }}
            >
              <div style={{ width: '48px', height: '1px', background: 'rgba(255,255,255,0.5)' }} />
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.55)',
                }}
              >
                OUR STORY
              </span>
            </motion.div>
          </div>

          {/* Right — Stats */}
          <div className="grid grid-cols-2 gap-px" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col justify-center"
                style={{
                  padding: '48px 36px',
                  borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: 'clamp(42px, 5vw, 64px)',
                    letterSpacing: '0.04em',
                    color: '#ffffff',
                    lineHeight: 1,
                  }}
                >
                  {stat.number}
                </div>
                <div
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: '10px',
                    letterSpacing: '0.3em',
                    color: 'rgba(255,255,255,0.35)',
                    marginTop: '10px',
                    textTransform: 'uppercase',
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
