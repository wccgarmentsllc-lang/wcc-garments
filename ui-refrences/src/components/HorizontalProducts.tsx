import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ProductCard, Product } from './ProductCard'

interface HorizontalProductsProps {
  products: Product[]
  title?: string
  subtitle?: string
}

export function HorizontalProducts({ products, title = 'Latest', subtitle = 'New Arrivals' }: HorizontalProductsProps) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['5%', `-${Math.max(0, (products.length - 2.5) * 22)}%`])

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${Math.max(250, products.length * 60)}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden flex items-center">
        {/* Section title — fixed left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="absolute top-0 left-0 bottom-0 flex flex-col justify-center z-10 pl-12"
          style={{ width: '200px' }}
        >
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: '10px',
              letterSpacing: '0.5em',
              color: 'rgba(0,0,0,0.4)',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            {subtitle}
          </span>
          <div>
            {title.split('\n').map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: 'clamp(36px, 4vw, 56px)',
                  letterSpacing: '0.12em',
                  lineHeight: 1,
                  color: '#0a0a0a',
                  textTransform: 'uppercase',
                }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Thin line decoration */}
          <div
            className="mt-8"
            style={{ width: '1px', height: '60px', background: 'rgba(0,0,0,0.15)' }}
          />
        </motion.div>

        {/* Horizontal scrolling track */}
        <motion.div
          style={{ x }}
          className="flex gap-5 will-change-transform"
          transition={{ type: 'tween' }}
        >
          {/* Spacer for left panel */}
          <div style={{ width: '240px', flexShrink: 0 }} />

          {products.map((product, i) => (
            <div
              key={product.id}
              className="flex-shrink-0"
              style={{
                width: 'clamp(240px, 22vw, 320px)',
                position: 'relative',
              }}
            >
              {/* Item number */}
              <div
                className="absolute z-10"
                style={{
                  top: '-20px',
                  left: '4px',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: '13px',
                  letterSpacing: '0.3em',
                  color: 'rgba(0,0,0,0.25)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </div>
              <ProductCard product={product} index={i} coverColor="#f0ede8" />
            </div>
          ))}

          {/* Right padding */}
          <div style={{ width: '80px', flexShrink: 0 }} />
        </motion.div>

        {/* Bottom progress line */}
        <motion.div
          className="absolute bottom-8 left-12 right-12"
          style={{ height: '1px', background: 'rgba(0,0,0,0.08)' }}
        >
          <motion.div
            style={{
              height: '100%',
              background: '#0a0a0a',
              scaleX: scrollYProgress,
              transformOrigin: 'left',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}
