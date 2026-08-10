"use client";

import React, { useEffect, useState, JSX, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { resolveImageSrc } from "@/lib/image-utils";
import type { HeroSlide, HeroConfig } from "@/app/admin/sections/types";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export function HeroSection(): JSX.Element | null {
  const { data: heroData, loading } = useWebsiteContent("hero");

  // Parse slides strictly from Supabase DB (No mock/default fallback data)
  const getSlides = (): HeroSlide[] => {
    const raw: HeroConfig | null = heroData;
    if (raw?.slides && Array.isArray(raw.slides) && raw.slides.length > 0) {
      return raw.slides;
    }
    if (raw?.campaigns && Array.isArray(raw.campaigns) && raw.campaigns.length > 0) {
      return raw.campaigns.map((c: any, idx: number) => ({
        id: c.id || idx + 1,
        tag: c.tag || "",
        titleLine1: c.title || "",
        titleLine2: "",
        highlightWord: "",
        description: "",
        ctaText: c.title ? "EXPLORE" : "",
        ctaLink: "/products/garments",
        image: c.center || c.image || "",
        desktopImage: c.center || c.image || "",
        mobileImage: c.center || c.image || "",
      }));
    }
    return [];
  };

  const slides = getSlides();
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [isAutoplay, setIsAutoplay] = useState<boolean>(heroData?.autoPlay ?? true);

  const autoPlayInterval = heroData?.interval ?? 5000;

  // Sync autoplay state when DB loads
  useEffect(() => {
    if (heroData?.autoPlay !== undefined) {
      setIsAutoplay(heroData.autoPlay);
    }
  }, [heroData?.autoPlay]);

  const nextSlide = useCallback(() => {
    if (slides.length < 2) return;
    setCurrentIdx((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  // Autoplay timer works only when DB has 2 or more slides
  useEffect(() => {
    if (!isAutoplay || slides.length < 2) return;

    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isAutoplay, autoPlayInterval, slides.length]);

  if (loading || slides.length === 0) {
    return null;
  }

  const slide = slides[currentIdx] || slides[0];
  if (!slide) return null;

  const renderHighlightedTitle = (title: string, highlight: string) => {
    if (!highlight || !title.toLowerCase().includes(highlight.toLowerCase())) {
      return title;
    }
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = title.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={i} className="text-[#3b82f6]">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const desktopImgSrc = slide.desktopImage || slide.image;
  const mobileImgSrc = slide.mobileImage || slide.desktopImage || slide.image;

  return (
    <section className="relative w-full h-screen min-h-screen bg-[#08080a] text-white overflow-hidden flex items-center justify-center select-none pt-10">
      {/* Full Section Background Image Layer */}
      {(desktopImgSrc || mobileImgSrc) && (
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${slide.id}-${currentIdx}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative w-full h-full"
            >
              {/* Desktop Background Image */}
              {desktopImgSrc && (
                <Image
                  src={resolveImageSrc(desktopImgSrc)}
                  alt={slide.titleLine1 || "Hero background"}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center hidden md:block"
                />
              )}
              {/* Mobile Background Image */}
              {mobileImgSrc && (
                <Image
                  src={resolveImageSrc(mobileImgSrc)}
                  alt={slide.titleLine1 || "Hero background"}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center block md:hidden"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-6 sm:px-12 md:px-16 flex flex-col justify-end md:justify-center h-full pb-5 sm:pb-24 md:py-0">
        {/* Left Side: Content Text */}
        <div className="max-w-2xl flex flex-col justify-end md:justify-center items-start text-left">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slide.id}-${currentIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-6 w-full"
            >
              {/* Category Tag Line */}
              {slide.tag && (
                <div className="flex flex-col items-start gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.45em] text-gold">
                    {slide.tag}
                  </span>
                </div>
              )}

              {/* Main Headline */}
              {(slide.titleLine1 || slide.titleLine2) && (
                <h1 className="font-sans font-medium text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight text-white">
                  {slide.titleLine1 && <span className="block">{slide.titleLine1}</span>}
                  {slide.titleLine2 && (
                    <span className="block mt-1">
                      {renderHighlightedTitle(slide.titleLine2, slide.highlightWord || "")}
                    </span>
                  )}
                </h1>
              )}

              {/* Description */}
              {slide.description && (
                <p className="font-sans text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  {slide.description}
                </p>
              )}

              {/* Action CTA Button */}
              {slide.ctaText && (
                <div className="pt-2">
                  <Link
                    href={slide.ctaLink || "#"}
                    className="inline-flex items-center gap-3 px-7 py-3.5 border border-[#3b82f6]/60 hover:border-gold bg-black/40 text-white hover:bg-blue-600 font-mono text-xs font-bold tracking-[0.18em] uppercase transition-all duration-300 group rounded-none"
                  >
                    <span>{slide.ctaText}</span>
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      <ArrowUpRight className="absolute h-4 w-4 text-[#3b82f6] group-hover:text-gold transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                      <ArrowRight className="absolute h-4 w-4 text-[#3b82f6] group-hover:text-white opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                    </span>
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Centered Small Dot Indicators (Hidden on mobile, active on desktop) */}
      {slides.length >= 2 && (
        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-30 items-center gap-2.5">
          {slides.map((s, idx) => (
            <button
              key={s.id || idx}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all duration-300 cursor-pointer rounded-full ${
                idx === currentIdx
                  ? "w-5 h-2 bg-[#3b82f6] shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                  : "w-2 h-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
