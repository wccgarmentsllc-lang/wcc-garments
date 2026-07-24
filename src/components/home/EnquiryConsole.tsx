'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Phone, Mail, MessageCircle, ArrowRight, Check } from 'lucide-react'
import { EnquirySchema, type EnquiryFormData } from '@/lib/validations'
import { BUSINESS_TYPES, PRODUCT_INTERESTS, COUNTRIES, SITE_CONFIG } from '@/lib/constants'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'
import { SplitSubmitButton } from '@/components/ui/SplitSubmitButton'
import { TypewriterEffect } from '@/components/ui/typewriter-effect'

type EnquiryConsoleProps = {
  source?: string
  initialBusinessType?: string
  initialInterests?: string[]
  initialMessage?: string
}

export function EnquiryConsole({
  source = 'homepage_enquiry',
  initialBusinessType,
  initialInterests,
  initialMessage,
}: EnquiryConsoleProps = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const initialBusiness = useMemo(
    () => (initialBusinessType && BUSINESS_TYPES.includes(initialBusinessType) ? initialBusinessType : ''),
    [initialBusinessType]
  )
  const sanitizedInterests = useMemo(
    () => (initialInterests || []).filter((interest) => PRODUCT_INTERESTS.includes(interest)),
    [initialInterests]
  )
  const startingStep = sanitizedInterests.length > 0 ? 3 : initialBusiness ? 2 : 1
  const [step, setStep] = useState(startingStep)
  const [selectedBusinessType, setSelectedBusinessType] = useState(initialBusiness)
  const [selectedInterests, setSelectedInterests] = useState<string[]>(sanitizedInterests)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const { data: config } = useWebsiteContent('site_config', SITE_CONFIG)

  const words = [
    { text: 'Secure' },
    { text: 'Your' },
    { text: 'Custom' },
    { text: 'Garment' },
    { text: 'Supply Chain', className: 'text-gold font-bold' },
  ]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(EnquirySchema),
    defaultValues: {
      message: initialMessage || '',
    },
  })

  useEffect(() => {
    if (initialMessage) {
      setValue('message', initialMessage)
    }
  }, [initialMessage, setValue])

  useEffect(() => {
    setSelectedBusinessType(initialBusiness)
    setSelectedInterests(sanitizedInterests)
    setStep(sanitizedInterests.length > 0 ? 3 : initialBusiness ? 2 : 1)
  }, [initialBusiness, sanitizedInterests])

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    )
  }

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          business_type: selectedBusinessType,
          product_interest: selectedInterests,
          source,
        }),
      })
      const json = await res.json()
      if (json.success) {
        setIsSuccess(true)
      } else {
        setSubmitError(json.error || 'Failed to submit. Please try again.')
      }
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-[var(--bg-surface)] py-16 md:py-20" ref={ref} id="enquiry" data-cursor="view">
      {/* Background architectural grid line pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]">
        <div className="h-full w-full bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-3 lg:px-10">
        <div className=" flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
          <span> Wholesale &amp; Enterprise Portal</span>
        </div>

        <div className="grid gap-10 md:gap-16 lg:grid-cols-5">
          {/* Left — Contact Info (Sticky) */}
          <motion.div
            className="lg:col-span-2 lg:sticky lg:top-32 lg:self-start"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="mt-2 uppercase">
              <TypewriterEffect words={words} />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[var(--text-muted)]">
              Whether you need bulk garments, hospitality uniforms, or custom OEM manufacturing — our executive team responds within 24 hours.
            </p>

            <div className="mt-10 space-y-5">
              <a
                href={`tel:${config.phone}`}
                className="flex items-center gap-4 text-sm text-[var(--text)] transition-colors hover:text-gold relative z-20"
              >
                <div className="flex h-10 w-10 items-center justify-center border border-[var(--border)]">
                  <Phone className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="font-medium">{config.phone}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">UAE Direct Line</p>
                </div>
              </a>
              <a
                href={`mailto:${config.email}`}
                className="flex items-center gap-4 text-sm text-[var(--text)] transition-colors hover:text-gold relative z-20"
              >
                <div className="flex h-10 w-10 items-center justify-center border border-[var(--border)]">
                  <Mail className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="font-medium">{config.email}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Sales &amp; Enquiries</p>
                </div>
              </a>
              <a
                href={`https://wa.me/${config.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-sm text-[var(--text)] transition-colors hover:text-gold relative z-20"
              >
                <div className="flex h-10 w-10 items-center justify-center border border-[var(--border)]">
                  <MessageCircle className="h-4 w-4 text-gold" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp Business</p>
                  <p className="text-[11px] text-[var(--text-muted)]">Quick Response</p>
                </div>
              </a>
            </div>
          </motion.div>

          {/* Right — Multi-Step Form */}
          <motion.div
            className="lg:col-span-3 relative z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Progress */}
            <div className="mb-8 flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (s < step || (s === 2 && selectedBusinessType) || (s === 3 && selectedInterests.length > 0)) {
                        setStep(s)
                      }
                    }}
                    className={`flex h-8 w-8 items-center justify-center text-xs font-medium transition-all cursor-pointer relative z-30 ${step >= s
                      ? 'bg-gold text-white font-bold'
                      : 'border border-[var(--border)] text-[var(--text-muted)] hover:border-gold'
                      }`}
                  >
                    {step > s ? <Check className="h-3.5 w-3.5 text-white font-bold" /> : s}
                  </button>
                  {s < 3 && (
                    <div
                      className={`h-[1px] w-8 transition-colors ${step > s ? 'bg-gold' : 'bg-[var(--border)]'
                        }`}
                    />
                  )}
                </div>
              ))}
              <span className="ml-3 font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                {step === 1 ? 'Business Type' : step === 2 ? 'Interests' : 'Details'}
              </span>
            </div>

            {isSuccess ? (
              <motion.div
                className="flex flex-col items-center justify-center border border-emerald-500/30 bg-emerald-500/10 p-16 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
                  <Check className="h-8 w-8 text-black" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold text-[var(--text)]">
                  Enquiry Successfully Deployed
                </h3>
                <p className="mt-2 max-w-sm text-sm text-[var(--text-muted)]">
                  Your commercial requirements have been logged. An executive account manager will contact you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {/* Step 1 — Business Type */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display text-xl font-semibold text-[var(--text)]">
                      What type of business are you?
                    </h3>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {BUSINESS_TYPES.map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => {
                            setSelectedBusinessType(type)
                            setStep(2)
                          }}
                          className={`relative z-30 cursor-pointer border p-4 text-left font-mono text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:border-gold ${selectedBusinessType === type
                            ? 'border-gold bg-gold/5 text-gold'
                            : 'border-[var(--border)] text-[var(--text)]'
                            }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 2 — Product Interest */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display text-xl font-semibold text-[var(--text)]">
                      What products interest you?
                    </h3>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">Select one or more</p>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      {PRODUCT_INTERESTS.map((interest) => (
                        <button
                          type="button"
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`relative z-30 cursor-pointer border p-4 text-left font-mono text-xs uppercase tracking-wider transition-all duration-300 hover:border-gold ${selectedInterests.includes(interest)
                            ? 'border-gold bg-gold/5 text-gold font-bold'
                            : 'border-[var(--border)] text-[var(--text)]'
                            }`}
                        >
                          <span className="mr-2">
                            {selectedInterests.includes(interest) ? '✓' : '○'}
                          </span>
                          {interest}
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <button type="button" onClick={() => setStep(1)} className="relative z-30 cursor-pointer text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text)]">
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="relative z-30 cursor-pointer btn-gold font-mono text-xs"
                      >
                        Continue <ArrowRight className="h-3 w-3 inline ml-1" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 — Contact Details */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-display text-xl font-semibold text-[var(--text)]">
                      Your Contact Details
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 relative z-30">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <input
                            {...register('name')}
                            placeholder="Full Name *"
                            className={`w-full relative z-30 border bg-transparent px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] transition-colors focus:border-gold ${errors.name ? 'border-red-500' : 'border-[var(--border)]'
                              }`}
                          />
                          {errors.name && <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>}
                        </div>
                        <div>
                          <input
                            {...register('company')}
                            placeholder="Company Name *"
                            className={`w-full relative z-30 border bg-transparent px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] transition-colors focus:border-gold ${errors.company ? 'border-red-500' : 'border-[var(--border)]'
                              }`}
                          />
                          {errors.company && <p className="mt-1 text-[10px] text-red-500">{errors.company.message}</p>}
                        </div>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <select
                            {...register('country')}
                            className={`w-full relative z-30 border bg-transparent px-4 py-3 text-sm text-[var(--text)] transition-colors focus:border-gold ${errors.country ? 'border-red-500' : 'border-[var(--border)]'
                              }`}
                          >
                            <option value="">Select Country *</option>
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          {errors.country && <p className="mt-1 text-[10px] text-red-500">{errors.country.message}</p>}
                        </div>
                        <div>
                          <input
                            {...register('phone')}
                            placeholder="Phone Number *"
                            className={`w-full relative z-30 border bg-transparent px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] transition-colors focus:border-gold ${errors.phone ? 'border-red-500' : 'border-[var(--border)]'
                              }`}
                          />
                          {errors.phone && <p className="mt-1 text-[10px] text-red-500">{errors.phone.message}</p>}
                        </div>
                      </div>
                      <div>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="Email Address *"
                          className={`w-full relative z-30 border bg-transparent px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] transition-colors focus:border-gold ${errors.email ? 'border-red-500' : 'border-[var(--border)]'
                            }`}
                        />
                        {errors.email && <p className="mt-1 text-[10px] text-red-500">{errors.email.message}</p>}
                      </div>
                      <div>
                        <input
                          {...register('quantity_range')}
                          placeholder="Estimated Order Quantity (optional)"
                          className="w-full relative z-30 border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] transition-colors focus:border-gold"
                        />
                      </div>
                      <div>
                        <textarea
                          {...register('message')}
                          placeholder="Tell us about your requirements (optional)"
                          rows={4}
                          className="w-full relative z-30 border border-[var(--border)] bg-transparent px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] transition-colors focus:border-gold"
                        />
                      </div>

                      {submitError && (
                        <p className="text-sm text-red-500">{submitError}</p>
                      )}

                      <div className="flex items-center gap-6 pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="relative z-30 cursor-pointer text-xs text-[var(--text-muted)] hover:text-[var(--text)]"
                        >
                          ← Back
                        </button>
                        <div className="flex-1">
                          <SplitSubmitButton
                            loading={isSubmitting}
                            success={isSuccess}
                            label="Submit Enquiry"
                          />
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
