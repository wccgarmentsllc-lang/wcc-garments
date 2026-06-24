import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'

interface NavbarProps {
  transparent?: boolean
}

const navLinks = [
  { label: 'Garments', href: '#garments' },
  { label: 'Home Linen', href: '#linen' },
  { label: 'Household', href: '#household' },
  { label: 'New Arrivals', href: '#arrivals' },
  { label: 'About', href: '#about' },
]

export function Navbar({ transparent = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="fixed top-0 left-0 right-0 z-[100]"
        style={{
          background: scrolled
            ? 'rgba(10,10,10,0.96)'
            : transparent
            ? 'transparent'
            : 'rgba(10,10,10,0.95)',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
          transition: 'all 0.5s ease',
        }}
      >
        <div className="flex items-center justify-between px-8 py-5">
          {/* Logo */}
          <a
            href="#"
            className="flex flex-col"
            style={{ textDecoration: 'none', cursor: 'none' }}
          >
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 400,
                fontSize: '22px',
                letterSpacing: '0.25em',
                color: '#ffffff',
                lineHeight: 1,
              }}
            >
              WCC
            </span>
            <span
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 300,
                fontSize: '7px',
                letterSpacing: '0.5em',
                color: 'rgba(255,255,255,0.45)',
                marginTop: '2px',
              }}
            >
              GARMENTS
            </span>
          </a>

          {/* Center nav links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: '10px',
                  letterSpacing: '0.3em',
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  cursor: 'none',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
              >
                {link.label.toUpperCase()}
              </a>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-6">
            <button
              style={{ background: 'none', border: 'none', cursor: 'none', padding: '4px' }}
              aria-label="Search"
            >
              <Search size={16} color="rgba(255,255,255,0.65)" strokeWidth={1.5} />
            </button>

            <button
              style={{ background: 'none', border: 'none', cursor: 'none', padding: '4px', position: 'relative' }}
              aria-label="Cart"
            >
              <ShoppingBag size={16} color="rgba(255,255,255,0.65)" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    background: '#ffffff',
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: '8px',
                    color: '#000',
                    fontWeight: 500,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'none', padding: '4px' }}
              aria-label="Menu"
            >
              {menuOpen ? (
                <X size={18} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
              ) : (
                <Menu size={18} color="rgba(255,255,255,0.8)" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: '0%' }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[200] flex flex-col justify-center px-12"
            style={{ background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(20px)' }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-8"
              style={{ background: 'none', border: 'none', cursor: 'none' }}
            >
              <X size={22} color="rgba(255,255,255,0.6)" strokeWidth={1} />
            </button>

            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 300,
                    fontSize: '42px',
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.85)',
                    textDecoration: 'none',
                    cursor: 'none',
                  }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-12 left-12"
            >
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                WCC GARMENTS · UAE · 2026
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
