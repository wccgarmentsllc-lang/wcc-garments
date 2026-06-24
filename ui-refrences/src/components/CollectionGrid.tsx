import { motion } from 'framer-motion'
import { RevealImage } from './RevealImage'
import { SplitText } from './SplitText'

const collections = [
  {
    id: 1,
    title: 'Garments',
    subtitle: 'Crafted for every occasion',
    image: '/hero-garments.jpg',
    tag: 'MEN & WOMEN',
    items: '200+ Styles',
    href: '#garments',
    large: true,
  },
  {
    id: 2,
    title: 'Home Linen',
    subtitle: 'Where comfort meets elegance',
    image: '/hero-linen.jpg',
    tag: 'BED & BATH',
    items: '150+ Products',
    href: '#linen',
    large: false,
  },
  {
    id: 3,
    title: 'Household',
    subtitle: 'Quality for every corner',
    image: '/hero-household.jpg',
    tag: 'HOME ESSENTIALS',
    items: '100+ Items',
    href: '#household',
    large: false,
  },
]

export function CollectionGrid() {
  return (
    <section
      id="garments"
      style={{ background: '#f7f4f0', padding: '100px 0' }}
    >
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: '10px',
                letterSpacing: '0.5em',
                color: 'rgba(0,0,0,0.35)',
                marginBottom: '14px',
              }}
            >
              OUR COLLECTIONS
            </motion.p>
            <SplitText
              text="Three Worlds of Quality"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: 'clamp(32px, 4.5vw, 58px)',
                letterSpacing: '0.06em',
                lineHeight: 1.1,
                color: '#0a0a0a',
              }}
            />
          </div>

          <motion.a
            href="#"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden md:flex items-center gap-3"
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: '10px',
              letterSpacing: '0.35em',
              color: 'rgba(0,0,0,0.5)',
              textDecoration: 'none',
              cursor: 'none',
            }}
          >
            <span style={{ width: '32px', height: '1px', background: 'rgba(0,0,0,0.3)' }} />
            VIEW ALL
          </motion.a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {collections.map((col, i) => (
            <motion.a
              key={col.id}
              href={col.href}
              className={`relative overflow-hidden group block ${col.large ? 'md:col-span-7' : 'md:col-span-5'}`}
              style={{
                aspectRatio: col.large ? '16/11' : '4/5',
                cursor: 'none',
                textDecoration: 'none',
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              // Second row for grid
            >
              <RevealImage
                src={col.image}
                alt={col.title}
                className="absolute inset-0"
                coverColor="#f7f4f0"
                delay={i * 0.1}
              />

              {/* Dark overlay */}
              <div
                className="absolute inset-0 z-20 transition-opacity duration-700"
                style={{
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
                }}
              />

              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 z-20"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                style={{ background: 'rgba(0,0,0,0.18)' }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 z-30 p-7">
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: '9px',
                    letterSpacing: '0.45em',
                    color: 'rgba(255,255,255,0.55)',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  {col.tag}
                </span>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: col.large ? 'clamp(36px, 4vw, 52px)' : 'clamp(28px, 3vw, 40px)',
                    letterSpacing: '0.1em',
                    color: '#ffffff',
                    lineHeight: 1,
                    marginBottom: '6px',
                  }}
                >
                  {col.title}
                </h3>
                <p
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: '15px',
                    color: 'rgba(255,255,255,0.55)',
                    marginBottom: '16px',
                  }}
                >
                  {col.subtitle}
                </p>

                <motion.span
                  className="inline-flex items-center gap-3"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 300,
                    fontSize: '9px',
                    letterSpacing: '0.35em',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <motion.span
                    style={{ display: 'inline-block', width: '32px', height: '1px', background: 'rgba(255,255,255,0.5)' }}
                    whileHover={{ width: '56px' } as any}
                    transition={{ duration: 0.4 }}
                  />
                  EXPLORE {col.items}
                </motion.span>
              </div>

              {/* Corner tag */}
              <div
                className="absolute top-5 right-5 z-30"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: '9px',
                  letterSpacing: '0.3em',
                  color: 'rgba(255,255,255,0.4)',
                }}
              >
                0{i + 1}
              </div>
            </motion.a>
          ))}
        </div>

        {/* Second row — also grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
          {/* This can hold additional category teasers */}
        </div>
      </div>
    </section>
  )
}
