'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react'

export interface CategoryBannerCarouselProps {
  divisionName: string
  categoryName: string
  description?: string
  images: string[]
  styleCount?: string
  moq?: string
  leadTime?: string
  className?: string
}

export function CategoryBannerCarousel({
  divisionName,
  categoryName,
  description,
  images = [],
  styleCount = '60+ Styles',
  moq = 'Varies',
  leadTime = '12-18 Days',
  className = '',
}: CategoryBannerCarouselProps) {
  // Ensure we have at least one fallback image if array is empty
  const bannerImages = images.length > 0 ? images : ['/images/hos-2.png']
  const isCarousel = bannerImages.length > 1

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  // Reset index if images or category changes
  useEffect(() => {
    setCurrentIndex(0)
  }, [categoryName, bannerImages.length])

  const nextSlide = useCallback(() => {
    if (!isCarousel) return
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % bannerImages.length)
  }, [isCarousel, bannerImages.length])

  const prevSlide = useCallback(() => {
    if (!isCarousel) return
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)
  }, [isCarousel, bannerImages.length])

  // Auto-play timer only when carousel is active (2+ images) and not paused
  useEffect(() => {
    if (!isCarousel || isPaused) return
    const timer = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(timer)
  }, [isCarousel, isPaused, nextSlide])

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: 1.04,
      x: dir > 0 ? 40 : -40,
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        opacity: { duration: 0.5, ease: 'easeOut' },
        scale: { duration: 0.7, ease: 'easeOut' },
        x: { duration: 0.5, ease: 'easeOut' },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      scale: 0.98,
      x: dir < 0 ? 40 : -40,
      transition: {
        opacity: { duration: 0.4 },
        x: { duration: 0.4 },
      },
    }),
  }

  const currentImage = bannerImages[currentIndex] || bannerImages[0]

  return (
    <div
      className={`relative h-[290px] md:h-[370px] w-full overflow-hidden border-b border-[var(--border)] bg-black select-none ${className}`}
      onMouseEnter={() => isCarousel && setIsPaused(true)}
      onMouseLeave={() => isCarousel && setIsPaused(false)}
    >
      {/* ── Background / Right Image Area ── */}
      <div className="absolute inset-0 w-full h-full">
        {isCarousel ? (
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentImage + '-' + currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={currentImage}
                alt={`${categoryName} banner image ${currentIndex + 1}`}
                fill
                className="object-cover object-center opacity-100"
                priority={currentIndex === 0}
                sizes="100vw"
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <Image
            src={currentImage}
            alt={categoryName}
            fill
            className="object-cover object-center opacity-100"
            priority
            sizes="100vw"
          />
        )}

        {/* Soft left gradient under text for readability without darkening the image */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent w-full md:w-1/2" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* ── Left Content (Current text content) ── */}
      <div className="relative z-10 mx-auto max-w-[1560px] h-full flex flex-col justify-end p-6 md:p-12 lg:p-14">
        <div className="max-w-xl md:max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-3.5 w-3.5 text-gold shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">
              {divisionName} · {categoryName}
            </span>
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-white tracking-tight">
            {categoryName}
          </h2>

          <p className="mt-3 text-xs md:text-sm text-white/70 max-w-lg font-light leading-relaxed">
            {description ||
              `Premium ${categoryName.toLowerCase()} crafted for global B2B wholesale. All styles available in custom colors, finishes, and branding.`}
          </p>

          <div className="mt-5 md:mt-6 flex flex-wrap items-center gap-3 font-mono text-[10px] text-white/50 uppercase tracking-wider">
            <span>{styleCount}</span>
            <span className="text-white/20">·</span>
            <span>MOQ {moq}</span>
            <span className="text-white/20">·</span>
            <span>Lead Time {leadTime}</span>
          </div>
        </div>
      </div>

      {/* ── Carousel Controls (Only active when images.length > 1) ── */}
      {isCarousel && (
        <>
          {/* Navigation Arrows */}
          <div className="absolute right-4 md:right-8 bottom-6 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex h-9 w-9 items-center justify-center border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:border-gold hover:bg-gold hover:text-white cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="font-mono text-[10px] text-white/80 px-2.5 bg-black/60 backdrop-blur-md py-2 border border-white/10">
              {currentIndex + 1} / {bannerImages.length}
            </span>

            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-9 w-9 items-center justify-center border border-white/20 bg-black/60 text-white backdrop-blur-md transition-all hover:border-gold hover:bg-gold hover:text-white cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Slide Indicator Dots (Top Right) */}
          <div className="absolute right-4 md:right-8 top-6 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 border border-white/10">
            {bannerImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1)
                  setCurrentIndex(idx)
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? 'w-6 bg-gold'
                    : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
