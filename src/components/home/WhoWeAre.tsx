"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CounterStat } from "@/components/ui/CounterStat";
import { ShieldCheck, ArrowUpRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";

const DEFAULT_WHO_WE_ARE = {
  heritageLabel: "Corporate Heritage",
  heading: "WCC FASHIONS",
  subHeading: "Established 2001",
  paragraphs: [
    "Western Clothing Company (WCC Fashions LLC) is a premier UAE-based industrial fashion manufacturing group.",
    "Operating out of our advanced Dubai manufacturing infrastructure, we deliver end-to-end commercial solutions—from precision pattern CAD and fabric sourcing to full-scale container export across 50+ nations worldwide.",
    "Our multi-division capabilities bridge high-end fashion garments, heavy-duty industrial workwear, luxury hotel linens, and authentic Arabian fragrances under strict ISO quality benchmarks.",
  ],
  mainImage: "/images/about wcc.png",
  floatingBadgeTitle: "Certified Standards",
  floatingBadgeDesc: "ISO 9001:2015 / OEM Export Grade",
  stats: [
    {
      value: 25,
      suffix: "+",
      label: "Years Expertise",
      desc: "Unrivaled manufacturing history and procurement experience since our Dubai inception.",
    },
    {
      value: 50,
      suffix: "+",
      label: "Export Nations",
      desc: "Active global distribution networks spanning GCC, Africa, Europe, and the Americas.",
    },
    {
      value: 10,
      suffix: "K+",
      label: "Monthly Capacity",
      desc: "Industrial-scale output supporting massive tenders and commercial supply chains.",
    },
  ],
};

export function WhoWeAre() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data } = useWebsiteContent("who-we-are", DEFAULT_WHO_WE_ARE);

  return (
    <section
      className="relative overflow-hidden bg-[var(--bg)] py-20 md:py-28 border-t border-[var(--border)]"
      ref={ref}
      data-cursor="view"
    >
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Section Header Indicator */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.45em] text-gold">
            {data.heritageLabel}
          </span>
        </div>

        <div className="grid gap-12 lg:gap-20 lg:grid-cols-12 lg:items-start">
          {/* Mobile heading */}
          <div className="lg:hidden">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            >
              <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-tight tracking-tight text-[var(--text)] uppercase">
                {data.heading.split(" ").map((word: string, i: number, arr: string[]) => (
                  <span key={i} className={i === arr.length - 1 ? "text-gold font-light" : ""}>
                    {word}
                    {i < arr.length - 1 ? " " : ""}
                  </span>
                ))}
              </h2>
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[var(--text-muted)] block mt-2">
                {data.subHeading}
              </span>
            </motion.div>
          </div>

          {/* Left Side — Editorial Image */}
          <motion.div
            className="relative lg:col-span-5 order-1 lg:order-1"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="relative aspect-[4/3] sm:aspect-[3/4] w-full overflow-hidden rounded-none border border-[var(--border)] shadow-2xl">
              <ResponsivePicture
                src={data.mainImage}
                alt="WCC Industrial Garment Floor"
                fill
                className="object-cover contrast-110 filter rounded-none"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-none" />

              {/* Overlay Copy */}
              <div className="absolute bottom-4 left-4 top-auto right-auto sm:bottom-auto sm:right-auto sm:top-4 sm:left-4 z-10 max-w-[50%] rounded-none border border-white/10 bg-black/60 px-2 pb-2 backdrop-blur-md text-white">
                <span className="font-mono text-[8px] font-bold uppercase tracking-[0.25em] text-gold leading-none">
                  Dubai Operations Hub
                </span>
                <h3 className="font-display text-xs sm:text-sm font-semibold tracking-wide text-white uppercase leading-snug">
                  Industrial Precision at Scale
                </h3>
              </div>
            </div>

            {/* Floating Glass Badge */}
            <motion.div
              className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-4 rounded-none border border-white/10 bg-[#0A0A0A]/95 p-6 shadow-2xl backdrop-blur-xl lg:-right-10"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-none border border-gold/40 bg-gold/10">
                <ShieldCheck className="h-6 w-6 text-gold" />
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-gold block font-bold">
                  {data.floatingBadgeTitle}
                </span>
                <p className="font-sans text-xs font-semibold text-white tracking-wide mt-1 animate-pulse">
                  {data.floatingBadgeDesc}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side — Editorial Copy & Stats */}
          <div className="lg:col-span-7 lg:pl-8 xl:pl-16 order-2 lg:order-2">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
            >
              <h2 className="hidden lg:block font-display text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-[var(--text)] uppercase">
                {data.heading.split(" ").map((word: string, i: number, arr: string[]) => (
                  <span key={i} className={i === arr.length - 1 ? "text-gold font-light" : ""}>
                    {word}
                    {i < arr.length - 1 ? " " : ""}
                  </span>
                ))}
              </h2>
              <span className="hidden lg:block font-mono text-[9px] uppercase tracking-[0.35em] text-[var(--text-muted)] mt-2">
                {data.subHeading}
              </span>

              <div className="mt-8 space-y-6 text-[15px] font-light leading-relaxed text-neutral-600 dark:text-neutral-300 font-sans tracking-wide">
                <p className="text-lg font-medium text-[var(--text)] leading-snug">
                  {data.paragraphs[0]}
                </p>
                <p className="text-sm sm:text-base">{data.paragraphs[1]}</p>
                <p className="text-sm sm:text-base">{data.paragraphs[2]}</p>
              </div>

              <div className="mt-10 flex items-center gap-6">
                <Link
                  href="/about"
                  className="group btn-gold font-mono text-xs font-bold tracking-[0.2em] rounded-none flex items-center justify-center gap-2 w-full lg:w-auto"
                >
                  Explore Corporate Heritage
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <ArrowUpRight className="absolute h-4 w-4 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                    <ArrowRight className="absolute h-4 w-4 text-white opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* 3 Authority Stats Grid */}
            <motion.div
              className="mt-12 grid grid-cols-1 gap-8 border-t border-[var(--border)] pt-12 sm:grid-cols-3"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {data.stats.map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="border-l-2 border-gold pl-6 transition-colors hover:border-[var(--text)]"
                >
                  <CounterStat end={s.value} suffix={s.suffix} label={s.label} />
                  <p className="mt-2.5 font-sans text-xs font-light text-[var(--text-muted)] leading-relaxed tracking-wide">
                    {s.desc}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}