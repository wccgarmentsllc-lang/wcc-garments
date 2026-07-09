'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Phone, Mail, MessageCircle, MapPin } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'
import { EnquiryConsole } from '@/components/home/EnquiryConsole'

export default function ContactClient() {
  const searchParams = useSearchParams()

  const prefill = useMemo(() => {
    const division = searchParams.get('division')?.toLowerCase() || ''
    const category = searchParams.get('category') || ''
    const source = searchParams.get('source') || 'contact_page'
    const intent = searchParams.get('intent') || 'general_enquiry'
    const businessType = searchParams.get('businessType') || ''

    const divisionToInterest: Record<string, string> = {
      garments: 'Garments & Fashion',
      uniforms: 'Uniforms & Workwear',
      hospitality: 'Hospitality Textiles',
      home: 'Home Furnishings',
      fragrance: 'Fragrance & Raw Materials',
      households: 'Household Products',
    }

    const interestFromDivision = division ? divisionToInterest[division] : undefined
    const interests = interestFromDivision ? [interestFromDivision] : []

    const contextBits = [
      category ? `Category: ${category}` : '',
      division ? `Division: ${division}` : '',
      intent ? `Intent: ${intent}` : '',
      source ? `Source: ${source}` : '',
    ].filter(Boolean)

    const message = contextBits.length
      ? `I would like a B2B quotation.\n${contextBits.join('\n')}\nPlease share MOQ, lead time, and customization options.`
      : ''

    return {
      source,
      initialBusinessType: businessType,
      initialInterests: interests,
      initialMessage: message,
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Hero */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-surface)] pt-32 pb-16">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">Contact Us</span>
            <h1 className="mt-3 font-display text-display-md font-semibold text-[var(--text)]">
              Let&apos;s Build Something <span className="font-light italic">Together</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm text-[var(--text-muted)]">
              Ready to source premium garments, textiles, or uniforms? Our team is here to help with your wholesale and bulk manufacturing needs.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <motion.a
              href={`tel:${SITE_CONFIG.phone}`}
              className="group border border-[var(--border)] p-6 transition-all hover:border-gold/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Phone className="h-5 w-5 text-gold" />
              <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">Phone</h3>
              <p className="mt-1 text-sm text-gold">{SITE_CONFIG.phone}</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">UAE Direct Line</p>
            </motion.a>
            <motion.a
              href={`mailto:${SITE_CONFIG.email}`}
              className="group border border-[var(--border)] p-6 transition-all hover:border-gold/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Mail className="h-5 w-5 text-gold" />
              <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">Sales Email</h3>
              <p className="mt-1 text-sm text-gold">{SITE_CONFIG.email}</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">Wholesale Enquiries</p>
            </motion.a>
            <motion.a
              href={`https://wa.me/${SITE_CONFIG.whatsapp.replace(/[^0-9]/g, '')}?text=Hello WCC Fashions, I'd like to enquire about your products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="group border border-[var(--border)] p-6 transition-all hover:border-gold/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MessageCircle className="h-5 w-5 text-gold" />
              <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">WhatsApp</h3>
              <p className="mt-1 text-sm text-gold">Click to Chat</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">Quick Response</p>
            </motion.a>
            <motion.div
              className="border border-[var(--border)] p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <MapPin className="h-5 w-5 text-gold" />
              <h3 className="mt-4 text-sm font-semibold text-[var(--text)]">Location</h3>
              <p className="mt-1 text-sm text-gold">Dubai, UAE</p>
              <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">United Arab Emirates</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enquiry Form */}
      <EnquiryConsole
        source={prefill.source}
        initialBusinessType={prefill.initialBusinessType}
        initialInterests={prefill.initialInterests}
        initialMessage={prefill.initialMessage}
      />
    </div>
  )
}
