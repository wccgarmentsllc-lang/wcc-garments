import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  division: string
  image: string
  colors: string[]
  isNew?: boolean
  isBestSeller?: boolean
  lowStock?: boolean
}

interface ProductCardProps {
  product: Product
  index?: number
  coverColor?: string
}

export function ProductCard({ product, index = 0, coverColor = '#f0ede8' }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [added, setAdded] = useState(false)
  const [revealed, setRevealed] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'none' }}
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '3/4', background: coverColor }}
        ref={el => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => { if (entry.isIntersecting) setRevealed(true) },
              { threshold: 0.2 }
            )
            observer.observe(el)
          }
        }}
      >
        {/* Product image */}
        <motion.img
          src={product.image}
          alt={product.name}
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full h-full object-cover"
        />

        {/* Reveal cover */}
        <motion.div
          initial={{ y: '0%' }}
          animate={{ y: revealed ? '-102%' : '0%' }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1], delay: index * 0.05 }}
          className="absolute inset-0 z-10"
          style={{ background: coverColor }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
          {product.isNew && (
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: '9px',
                letterSpacing: '0.35em',
                background: '#0a0a0a',
                color: '#ffffff',
                padding: '4px 8px',
              }}
            >
              NEW
            </span>
          )}
          {product.lowStock && (
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: '9px',
                letterSpacing: '0.3em',
                background: '#8B1A1A',
                color: '#ffffff',
                padding: '4px 8px',
              }}
            >
              LOW STOCK
            </span>
          )}
          {product.isBestSeller && (
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontSize: '9px',
                letterSpacing: '0.3em',
                background: '#4a3520',
                color: '#e8d5b0',
                padding: '4px 8px',
              }}
            >
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={e => {
            e.stopPropagation()
            setWishlisted(!wishlisted)
          }}
          className="absolute top-3 right-3 z-20 p-2 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            border: 'none',
            cursor: 'none',
          }}
        >
          <Heart
            size={14}
            strokeWidth={1.5}
            style={{
              fill: wishlisted ? '#c0392b' : 'transparent',
              color: wishlisted ? '#c0392b' : '#333',
            }}
          />
        </button>

        {/* Quick Add */}
        <AnimatePresence>
          {hovered && (
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={handleAdd}
              className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-2"
              style={{
                background: added ? '#1a3a1a' : '#0a0a0a',
                color: added ? '#a8d8a8' : '#ffffff',
                border: 'none',
                cursor: 'none',
                padding: '14px 0',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: '9px',
                letterSpacing: '0.4em',
                transition: 'background 0.3s ease',
              }}
            >
              <ShoppingBag size={12} strokeWidth={1.5} />
              {added ? 'ADDED ✓' : 'QUICK ADD'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Product info */}
      <div className="mt-4 px-0.5">
        <div className="flex justify-between items-start">
          <div>
            <h3
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#1a1a1a',
                lineHeight: 1.5,
                textTransform: 'uppercase',
              }}
            >
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: '15px',
                  color: '#1a1a1a',
                }}
              >
                AED {product.price}
              </span>
              {product.originalPrice && (
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: '13px',
                    color: '#999',
                    textDecoration: 'line-through',
                  }}
                >
                  AED {product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Color dots */}
        <div className="flex gap-1.5 mt-2.5">
          {product.colors.map((color, ci) => (
            <div
              key={ci}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: color,
                border: '1px solid rgba(0,0,0,0.1)',
                cursor: 'none',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.4)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}
