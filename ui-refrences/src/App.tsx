import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IntroAnimation } from './components/IntroAnimation'
import { FullPageScroll } from './components/FullPageScroll'
import { Navbar } from './components/Navbar'
import { MarqueeBanner } from './components/MarqueeBanner'
import { HorizontalProducts } from './components/HorizontalProducts'
import { CollectionGrid } from './components/CollectionGrid'
import { AboutSection } from './components/AboutSection'
import { Footer } from './components/Footer'
import { CustomCursor } from './components/CustomCursor'
import { SplitText } from './components/SplitText'
import { ProductCard, Product } from './components/ProductCard'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Oxford White Shirt',
    price: 185,
    originalPrice: 230,
    category: 'shirts',
    division: 'garments',
    image: '/product-1.jpg',
    colors: ['#ffffff', '#1a1a2e', '#2d4a1e'],
    isNew: true,
  },
  {
    id: '2',
    name: 'Premium Polo Navy',
    price: 145,
    category: 'polo',
    division: 'garments',
    image: '/product-2.jpg',
    colors: ['#1a2a4a', '#1a1a1a', '#8b1a1a'],
    isBestSeller: true,
  },
  {
    id: '3',
    name: 'Egyptian Bed Sheet Set',
    price: 320,
    originalPrice: 390,
    category: 'bedsheets',
    division: 'home-linen',
    image: '/product-3.jpg',
    colors: ['#f5f0e8', '#d4c5a9', '#b8a88a'],
    isNew: true,
    isBestSeller: true,
  },
  {
    id: '4',
    name: 'Luxury Bath Towel',
    price: 95,
    category: 'towels',
    division: 'household',
    image: '/product-4.jpg',
    colors: ['#ffffff', '#e8ddd0', '#c8bfb0'],
    lowStock: true,
  },
  {
    id: '5',
    name: 'Linen Dress Shirt',
    price: 210,
    category: 'shirts',
    division: 'garments',
    image: '/product-1.jpg',
    colors: ['#e8ddd0', '#c8bfb0', '#1a1a1a'],
    isNew: true,
  },
  {
    id: '6',
    name: 'King Size Duvet Cover',
    price: 280,
    originalPrice: 340,
    category: 'bedsheets',
    division: 'home-linen',
    image: '/product-3.jpg',
    colors: ['#ffffff', '#f0ebe0', '#d4c5a9'],
  },
]

export default function AddSubscribe() {
  const [introComplete, setIntroComplete] = useState(false)
  const [mainVisible, setMainVisible] = useState(false)
  const [fullPageDone, setFullPageDone] = useState(false)

  const handleIntroComplete = () => {
    setIntroComplete(true)
    setTimeout(() => setMainVisible(true), 100)
  }

  return (
    <div style={{ background: '#0a0a0a' }}>
      {/* Custom cursor — always on top */}
      <CustomCursor />

      {/* Intro animation */}
      <IntroAnimation onComplete={handleIntroComplete} />

      {/* Main site — slides up from bottom */}
      <AnimatePresence>
        {introComplete && (
          <motion.div
            initial={{ y: '100vh', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.0, ease: [0.76, 0, 0.24, 1] }}
            style={{ position: 'relative', zIndex: 10 }}
          >
            {/* Navbar — always visible after intro */}
            <Navbar transparent />

            {/* HERO — Full page scroll sections */}
            {!fullPageDone ? (
              <div style={{ height: '100vh', overflow: 'hidden' }}>
                <FullPageScroll
                  onExitBottom={() => {
                    setFullPageDone(true)
                    // Small delay so transition feels intentional
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'instant' })
                    }, 50)
                  }}
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                {/* ─── AFTER FULL PAGE SCROLL — Normal scrolling site ─── */}

                {/* Hero bridge section */}
                <div
                  className="relative flex items-center justify-center overflow-hidden"
                  style={{
                    height: '100vh',
                    background: '#080808',
                  }}
                >
                  <img
                    src="/hero-main.jpg"
                    alt="WCC Garments Hero"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.55,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)',
                    }}
                  />
                  <div className="relative z-10 text-center px-6">
                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 300,
                        fontSize: '10px',
                        letterSpacing: '0.6em',
                        color: 'rgba(255,255,255,0.45)',
                        marginBottom: '20px',
                      }}
                    >
                      FABRIC OF EXCELLENCE
                    </motion.p>
                    <div style={{ overflow: 'hidden' }}>
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 300,
                          fontSize: 'clamp(60px, 12vw, 140px)',
                          letterSpacing: '0.12em',
                          lineHeight: 1,
                          color: '#ffffff',
                        }}
                      >
                        WCC
                      </motion.div>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontWeight: 300,
                          fontSize: 'clamp(60px, 12vw, 140px)',
                          letterSpacing: '0.12em',
                          lineHeight: 1,
                          color: '#ffffff',
                        }}
                      >
                        GARMENTS
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.8 }}
                      className="flex items-center justify-center gap-6 mt-10"
                    >
                      <button
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 300,
                          fontSize: '10px',
                          letterSpacing: '0.4em',
                          color: '#0a0a0a',
                          background: '#ffffff',
                          border: 'none',
                          padding: '14px 36px',
                          cursor: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'transparent'
                          e.currentTarget.style.color = '#ffffff'
                          e.currentTarget.style.outline = '1px solid rgba(255,255,255,0.5)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = '#ffffff'
                          e.currentTarget.style.color = '#0a0a0a'
                          e.currentTarget.style.outline = 'none'
                        }}
                      >
                        SHOP NOW
                      </button>
                      <button
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 300,
                          fontSize: '10px',
                          letterSpacing: '0.4em',
                          color: '#ffffff',
                          background: 'transparent',
                          border: '1px solid rgba(255,255,255,0.3)',
                          padding: '14px 36px',
                          cursor: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
                        }}
                      >
                        OUR STORY
                      </button>
                    </motion.div>
                  </div>

                  {/* Scroll indicator */}
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
                  >
                    <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.2)' }} />
                    <span
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 300,
                        fontSize: '8px',
                        letterSpacing: '0.4em',
                        color: 'rgba(255,255,255,0.3)',
                      }}
                    >
                      SCROLL
                    </span>
                  </motion.div>
                </div>

                {/* MARQUEE TICKER */}
                <MarqueeBanner dark speed={22} />

                {/* HORIZONTAL SCROLL PRODUCTS */}
                <div style={{ background: '#f7f4f0' }}>
                  <HorizontalProducts
                    products={mockProducts}
                    title={'Latest\nCollection'}
                    subtitle="New Arrivals"
                  />
                </div>

                {/* MARQUEE — light variant */}
                <MarqueeBanner dark={false} speed={28} />

                {/* COLLECTION GRID */}
                <CollectionGrid />

                {/* PRODUCT GRID SECTION */}
                <section style={{ background: '#ffffff', padding: '100px 0' }}>
                  <div className="max-w-7xl mx-auto px-10">
                    <div className="flex justify-between items-end mb-16">
                      <div>
                        <motion.p
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 300,
                            fontSize: '10px',
                            letterSpacing: '0.5em',
                            color: 'rgba(0,0,0,0.35)',
                            marginBottom: '14px',
                          }}
                        >
                          HANDPICKED FOR YOU
                        </motion.p>
                        <SplitText
                          text="Featured Products"
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontWeight: 300,
                            fontSize: 'clamp(32px, 4vw, 54px)',
                            letterSpacing: '0.06em',
                            color: '#0a0a0a',
                          }}
                        />
                      </div>
                      <motion.button
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="hidden md:flex items-center gap-3"
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 300,
                          fontSize: '10px',
                          letterSpacing: '0.35em',
                          color: 'rgba(0,0,0,0.45)',
                          background: 'none',
                          border: 'none',
                          cursor: 'none',
                          padding: 0,
                        }}
                      >
                        <span style={{ width: '32px', height: '1px', background: 'rgba(0,0,0,0.25)', display: 'inline-block' }} />
                        VIEW ALL
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-14">
                      {mockProducts.map((product, i) => (
                        <ProductCard key={product.id} product={product} index={i} coverColor="#f5f2ee" />
                      ))}
                    </div>
                  </div>
                </section>

                {/* ABOUT / BRAND SECTION */}
                <AboutSection />

                {/* NEWSLETTER SECTION */}
                <section
                  style={{
                    background: '#f7f4f0',
                    padding: '80px 0',
                  }}
                >
                  <div className="max-w-2xl mx-auto px-8 text-center">
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 300,
                        fontSize: '10px',
                        letterSpacing: '0.5em',
                        color: 'rgba(0,0,0,0.35)',
                        marginBottom: '16px',
                      }}
                    >
                      STAY CONNECTED
                    </motion.p>
                    <SplitText
                      text="Be First to Know"
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300,
                        fontSize: 'clamp(32px, 4vw, 50px)',
                        letterSpacing: '0.08em',
                        color: '#0a0a0a',
                        justifyContent: 'center',
                        marginBottom: '10px',
                      }}
                    />
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 300,
                        fontSize: '17px',
                        color: 'rgba(0,0,0,0.5)',
                        marginBottom: '36px',
                        lineHeight: 1.7,
                      }}
                    >
                      New collections, exclusive offers, and premium lifestyle — delivered to your inbox.
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="flex"
                      style={{ border: '1px solid rgba(0,0,0,0.15)' }}
                    >
                      <input
                        type="email"
                        placeholder="Your email address"
                        style={{
                          flex: 1,
                          padding: '16px 20px',
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 300,
                          fontSize: '11px',
                          letterSpacing: '0.15em',
                          color: '#1a1a1a',
                          background: 'transparent',
                          border: 'none',
                          outline: 'none',
                        }}
                      />
                      <button
                        style={{
                          padding: '16px 28px',
                          fontFamily: "'Montserrat', sans-serif",
                          fontWeight: 300,
                          fontSize: '9px',
                          letterSpacing: '0.4em',
                          color: '#ffffff',
                          background: '#0a0a0a',
                          border: 'none',
                          cursor: 'none',
                          whiteSpace: 'nowrap',
                          transition: 'background 0.3s ease',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#2a2a2a')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#0a0a0a')}
                      >
                        SUBSCRIBE
                      </button>
                    </motion.div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                        fontWeight: 300,
                        fontSize: '9px',
                        letterSpacing: '0.3em',
                        color: 'rgba(0,0,0,0.3)',
                        marginTop: '14px',
                      }}
                    >
                      NO SPAM. UNSUBSCRIBE ANYTIME.
                    </motion.p>
                  </div>
                </section>

                {/* FOOTER */}
                <Footer />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show full page scroll hint when not yet done */}
      {mainVisible && !fullPageDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 200,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            fontSize: '8px',
            letterSpacing: '0.5em',
            color: 'rgba(255,255,255,0.3)',
            pointerEvents: 'none',
          }}
        >
          SCROLL TO EXPLORE
        </motion.div>
      )}
    </div>
  )
}
