'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react'
import { SITE_CONFIG, DIVISIONS, NAV_LINKS } from '@/lib/constants'
import NewsletterSubscribe from '../home/NewsletterSubscribe'

import { useState, useEffect } from 'react'
import { contentStore } from '@/lib/content-store'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

export function Footer() {
  const pathname = usePathname()
  const { data: config } = useWebsiteContent('site_config', SITE_CONFIG)
  const [divisions, setDivisions] = useState(DIVISIONS)
  const isAdmin = pathname.startsWith('/admin')

  useEffect(() => {
    setDivisions(contentStore.getDivisions())
  }, [])

  const getDivisionLabel = (name: string) =>
    name.replace(/^div[-\s]*\d+\s*[:.-]?\s*/i, '').trim()

  if (isAdmin) return null

  return (
    <footer className="relative z-20 border-t border-white/10 bg-[#0A0A0A]">
      <NewsletterSubscribe/>
      {/* Main Footer */}
      <div className="mx-auto max-w-[1440px] px-2 py-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/images/wcc-logo.png"
                  alt="WCC Garments Logo"
                  fill
                  className="object-contain"
                  sizes="48px"
                />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-white uppercase">
                  {config.name}
                </h3>
                <p className="mt-0.5 text-[8px] font-medium uppercase tracking-[0.35em] text-neutral-400">
                  {config.fullName}
                </p>
              </div>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-neutral-400">
              {config.description}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a href={`tel:${config.phone}`} className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-gold">
                <Phone className="h-3.5 w-3.5" />
                {config.phone}
              </a>
              <a href={`mailto:${config.email}`} className="flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-gold">
                <Mail className="h-3.5 w-3.5" />
                {config.email}
              </a>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <MapPin className="h-3.5 w-3.5" />
                {config.address}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Quick Links
            </h4>
            <ul className="mt-6 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1 text-sm text-white transition-colors hover:text-gold"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Our Divisions
            </h4>
            <ul className="mt-6 space-y-3">
              {divisions.map((div) => (
                <li key={div.slug}>
                  <Link
                    href={`/products/${div.slug}`}
                    className="group flex items-center gap-2 text-sm text-white transition-colors hover:text-gold"
                  >
                    {getDivisionLabel(div.name)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Executive Direct Contacts */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-neutral-400">
              Executive Direct
            </h4>
            <p className="mt-6 text-sm leading-relaxed text-neutral-400">
              Looking for wholesale garments, uniforms, or hospitality textiles? Get in touch with our team.
            </p>
            <a
              href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex h-12 items-center justify-center gap-2 rounded border border-white/10 bg-black text-white font-mono text-xs uppercase tracking-wider transition-colors hover:border-gold hover:text-gold"
            >
              ✦ WhatsApp Executive Line
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-6 px-6 py-8 md:flex-row lg:px-12">
          <p className="text-xs text-neutral-400">
            © {new Date().getFullYear()} {config.fullName}. All rights reserved.
          </p>
          <p className="text-[10px] font-mono tracking-widest text-gold text-center">
            MANUFACTURED AT INDUSTRIAL SCALE. DELIVERED WITH PRECISION.
          </p>
          <p className="text-xs text-neutral-400">
            Crafted by{' '}
            <a
              href="https://ekodrix.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white transition-colors hover:text-gold underline underline-offset-4"
            >
              Ekodrix
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
