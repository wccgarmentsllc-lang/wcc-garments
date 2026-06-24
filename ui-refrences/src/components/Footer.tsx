import { motion } from 'framer-motion'
import { Share2, Globe, Send } from 'lucide-react'
const Instagram = Share2
const Facebook = Globe
const Twitter = Send
import { MarqueeBanner } from './MarqueeBanner'

const footerLinks = {
  Collections: ['Garments', 'Home Linen', 'Household', 'New Arrivals', 'Best Sellers'],
  Company: ['About WCC', 'Our Story', 'Sustainability', 'Careers', 'Press'],
  Support: ['Contact Us', 'Track Order', 'Returns', 'Size Guide', 'FAQ'],
  Contact: ['info@wccgarments.ae', '+971 4 000 0000', 'Dubai, UAE', 'Mon-Sat 9AM-7PM'],
}

export function Footer() {
  return (
    <footer style={{ background: '#0a0a0a' }}>
      <MarqueeBanner dark speed={20} />

      <div className="max-w-7xl mx-auto px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 pb-16 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          {/* Brand column */}
          <div className="md:col-span-1">
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 400,
                  fontSize: '28px',
                  letterSpacing: '0.2em',
                  color: '#ffffff',
                }}
              >
                WCC
              </div>
              <div
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: '8px',
                  letterSpacing: '0.5em',
                  color: 'rgba(255,255,255,0.3)',
                  marginTop: '4px',
                }}
              >
                GARMENTS
              </div>
            </div>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontSize: '15px',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.4)',
                maxWidth: '200px',
              }}
            >
              Fabric of Excellence. Premium quality for every home and wardrobe.
            </p>

            {/* Social */}
            <div className="flex gap-4 mt-8">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -2 }}
                  style={{
                    color: 'rgba(255,255,255,0.3)',
                    cursor: 'none',
                    transition: 'color 0.3s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                >
                  <Icon size={16} strokeWidth={1.5} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 400,
                  fontSize: '9px',
                  letterSpacing: '0.4em',
                  color: 'rgba(255,255,255,0.45)',
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      style={{
                        fontFamily: category === 'Contact' ? "'Montserrat', sans-serif" : "'Cormorant Garamond', serif",
                        fontWeight: 300,
                        fontSize: category === 'Contact' ? '11px' : '15px',
                        letterSpacing: category === 'Contact' ? '0.05em' : '0.04em',
                        color: 'rgba(255,255,255,0.4)',
                        textDecoration: 'none',
                        cursor: 'none',
                        display: 'block',
                        lineHeight: 1.4,
                        transition: 'color 0.25s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 gap-4">
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 300,
              fontSize: '9px',
              letterSpacing: '0.3em',
              color: 'rgba(255,255,255,0.25)',
            }}
          >
            © 2026 WCC GARMENTS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a
                key={item}
                href="#"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 300,
                  fontSize: '9px',
                  letterSpacing: '0.25em',
                  color: 'rgba(255,255,255,0.25)',
                  textDecoration: 'none',
                  cursor: 'none',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
