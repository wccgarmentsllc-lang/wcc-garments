"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import {
  Award,
  ShieldCheck,
  Truck,
  Users,
  Globe,
  Headphones,
  Shirt,
  Bed,
  Home,
  ChevronRight,
} from "lucide-react";

/**
 * WHY CHOOSE US SECTION
 * 
 * DESIGN & TEXT SIZE REFERENCE GUIDE:
 * - Section Tag:      font-mono text-xs font-bold uppercase tracking-[0.35em] text-[#3b82f6]
 * - Main Title:       font-display text-3xl sm:text-4xl lg:text-5xl font-bold uppercase tracking-tight text-[var(--text)]
 * - Subtitle:         font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]
 * - Intro Body:       font-sans text-xs sm:text-sm leading-relaxed text-[var(--text-muted)]
 * - Feature Title:    font-display text-xs sm:text-base font-bold text-[var(--text)]
 * - Feature Body:     font-sans text-[11px] sm:text-xs text-[var(--text-muted)] leading-normal
 * 
 * DARK & LIGHT MODE CSS REFERENCE:
 * - Background:       bg-[var(--bg)] (White #FFFFFF in light mode, Black #000000 in dark mode)
 * - Text Primary:     text-[var(--text)] (#000000 in light mode, #FFFFFF in dark mode)
 * - Text Muted:       text-[var(--text-muted)] (rgba(10,10,10,0.6) in light mode, rgba(255,255,255,0.6) in dark mode)
 * - Accent Blue:      text-[#3b82f6] / bg-[#3b82f6]
 * - Feature Cards:    bg-white dark:bg-[#111114] border-gray-200 dark:border-white/10
 */

const FEATURES = [
  {
    id: "diverse-range",
    icon: Award,
    title: "Diverse Product Range",
    description:
      "From uniforms and workwear to hotel linens and household essentials — all under one roof.",
  },
  {
    id: "quality-trust",
    icon: ShieldCheck,
    title: "Quality You Can Trust",
    description:
      "Premium materials and rigorous quality checks ensure products that last and perform.",
  },
  {
    id: "timely-delivery",
    icon: Truck,
    title: "Timely & Reliable Delivery",
    description:
      "Strong logistics and production capabilities to meet your deadlines, every time.",
  },
  {
    id: "customized-solutions",
    icon: Users,
    title: "Customized Solutions",
    description:
      "Tailored products and bulk manufacturing to fit your specific requirements.",
  },
  {
    id: "global-experience",
    icon: Globe,
    title: "Global Experience",
    description:
      "Serving clients across 50+ countries with international standards and compliance.",
  },
  {
    id: "dedicated-support",
    icon: Headphones,
    title: "Dedicated Customer Support",
    description:
      "A responsive team committed to your success before, during, and after every order.",
  },
];

const CUTOUT_CARDS = [
  {
    id: "apparel",
    title: "APPAREL & UNIFORMS",
    description: "High-quality garments and uniforms for every industry need.",
    icon: Shirt,
    image: "/images/formal-shirts.png",
  },
  {
    id: "hospitality",
    title: "HOSPITALITY SOLUTIONS",
    description: "Premium linens, amenities, and essentials for hotels and resorts.",
    icon: Bed,
    image: "/images/products/hotel_bed_linen.png",
  },
  {
    id: "household",
    title: "HOUSEHOLD ESSENTIALS",
    description: "Durable and stylish household products for modern living.",
    icon: Home,
    image: "/images/hh-1.png",
  },
];

const BLUE_BANNER_STATS = [
  {
    icon: Award,
    title: "PREMIUM QUALITY",
    desc: "Sourced materials and strict quality control.",
  },
  {
    icon: Truck,
    title: "RELIABLE SUPPLY",
    desc: "On-time delivery and consistent availability.",
  },
  {
    icon: Globe,
    title: "GLOBAL STANDARDS",
    desc: "International quality & compliance.",
  },
  {
    icon: Headphones,
    title: "DEDICATED SUPPORT",
    desc: "Responsive service and long-term partnerships.",
  },
];

export function WhyChooseUs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--bg)] text-[var(--text)] py-12 sm:py-20 md:py-28 overflow-hidden transition-colors duration-300"
    >
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* ── HEADER BLOCK (Mobile ONLY: Displays at top) ── */}
          <div className="lg:hidden flex flex-col space-y-3">
            <div className="flex flex-col items-start gap-1">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#3b82f6]">
                WHY CHOOSE US
              </span>
              {/* <div className="w-8 h-[2px] bg-[#3b82f6]" /> */}
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)] uppercase leading-none">
              WHY <span className="text-[#3b82f6]">CHOOSE US?</span>
            </h2>

            <div className="flex items-center gap-2 pt-0.5">
              {/* <div className="w-4 h-[2px] bg-[#3b82f6]" /> */}
              <span className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                ONE PARTNER. COMPLETE SOLUTIONS.
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed pt-1">
              WCC Fashions is your trusted partner for apparel, hospitality, and household solutions.
              We deliver exceptional quality, dependable service, and customized solutions to
              businesses across diverse industries.
            </p>
          </div>

          {/* ── VISUAL CARD CONTAINER (Middle on Mobile / Left Column on Desktop) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-6 w-full flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0c0c0e] shadow-xl"
          >
            {/* Top Slanted Image Cutouts (Horizontal 3-column row on ALL devices) */}
            <div className="relative flex flex-row w-full h-[260px] sm:h-[460px] bg-white dark:bg-white overflow-hidden select-none border-b border-gray-200 dark:border-white/10">
              {CUTOUT_CARDS.map((card, idx) => {
                const IconComponent = card.icon;

                // Slanted Polygon Cutouts
                const clipPaths = [
                  "polygon(0 0, 100% 0, 83% 100%, 0 100%)",
                  "polygon(17% 0, 100% 0, 83% 100%, 0 100%)",
                  "polygon(17% 0, 100% 0, 100% 100%, 0 100%)",
                ];

                return (
                  <div
                    key={card.id}
                    className="relative w-[37%] h-full overflow-hidden group flex flex-col justify-end p-3.5 sm:p-7"
                    style={{
                      clipPath: clipPaths[idx],
                      marginLeft: idx > 0 ? "-5%" : "0px",
                    }}
                  >
                    {/* Background Image */}
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 33vw, 33vw"
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                    {/* Content Overlay */}
                    <div className="relative z-10 flex flex-col items-start text-left space-y-1 sm:space-y-2">
                      <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#0b388b] border border-white/30 flex items-center justify-center text-white shadow-xl mb-0.5 sm:mb-1">
                        <IconComponent className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                      </div>
                      <h4 className="font-display text-[9px] sm:text-sm font-bold text-white tracking-wider uppercase leading-tight">
                        {card.title}
                      </h4>
                      <p className="font-sans text-[7.5px] sm:text-[11px] text-gray-300 leading-tight max-w-[180px] line-clamp-2 sm:line-clamp-none">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Royal Blue Banner */}
            <div className="bg-[#0b388b] text-white p-3 sm:p-8 grid grid-cols-4 gap-1.5 sm:gap-6 divide-x divide-white/10">
              {BLUE_BANNER_STATS.map((stat, idx) => {
                const StatIcon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-start text-left space-y-1 ${
                      idx > 0 ? "pl-1.5 sm:pl-4" : ""
                    }`}
                  >
                    <StatIcon className="w-4 h-4 sm:w-6 sm:h-6 text-[#60a5fa] mb-0.5 sm:mb-1" />
                    <h5 className="font-display text-[8px] sm:text-xs font-bold uppercase tracking-wider text-white leading-tight">
                      {stat.title}
                    </h5>
                    <p className="font-sans text-[7px] sm:text-[10px] text-blue-100 leading-tight">
                      {stat.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ── FEATURE CARDS (Bottom on Mobile / Right Column on Desktop) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-6 w-full flex flex-col space-y-3 sm:space-y-4"
          >
            {/* Header Block (Desktop ONLY) */}
            <div className="hidden lg:flex flex-col space-y-2 mb-2">
              <div className="flex flex-col items-start gap-1">
                <span className="font-mono text-xs font-bold uppercase tracking-[0.3em] text-[#3b82f6]">
                  WHY CHOOSE US
                </span>
                {/* <div className="w-8 h-[2px] bg-[#3b82f6]" /> */}
              </div>

              <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-[var(--text)] uppercase leading-none">
                WHY <span className="text-[#3b82f6]">CHOOSE US?</span>
              </h2>

              <div className="flex items-center gap-2 pt-0.5">
                {/* <div className="w-4 h-[2px] bg-[#3b82f6]" /> */}
                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
                  ONE PARTNER. COMPLETE SOLUTIONS.
                </span>
              </div>

              <p className="font-sans text-sm text-[var(--text-muted)] leading-relaxed pt-1">
                WCC Fashions is your trusted partner for apparel, hospitality, and household solutions.
                We deliver exceptional quality, dependable service, and customized solutions to
                businesses across diverse industries.
              </p>
            </div>

            {/* 6 Feature Card Boxes with Chevron Arrows */}
            <div className="space-y-2.5 sm:space-y-3">
              {FEATURES.map((item) => {
                const RowIcon = item.icon;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111114] shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      {/* Left Icon Badge */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 flex items-center justify-center text-[#3b82f6] shrink-0 group-hover:scale-105 transition-transform">
                        <RowIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>

                      {/* Vertical Accent Line + Copy */}
                      <div className="border-l-2 border-[#3b82f6] pl-3 space-y-0.5">
                        <h3 className="font-display text-xs sm:text-base font-bold text-[var(--text)] tracking-tight">
                          {item.title}
                        </h3>
                        <p className="font-sans text-[11px] sm:text-xs text-[var(--text-muted)] leading-normal">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Chevron Arrow */}
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#3b82f6] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
