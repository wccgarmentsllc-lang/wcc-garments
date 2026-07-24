"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import treasurelogo from "../../../public/images/tresurelogo.png";
import vandegrafflogo from "../../../public/images/vadegrafflogo.png";
import tomjacklogo from "../../../public/images/tomjacklogo.png";
import treasureimg from "../../../public/images/treaureimg.png";
import vandegraffimg from "../../../public/images/vendegraddimg.png";
import tomjackimg from "../../../public/images/tomkackimg.png";
import shirtlogo from "../../../public/images/shirt.png";

import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

const BRAND_PANELS = [
  {
    id: "treasure",
    bg: "bg-[#1a1a1a]",
    accentColor: "#c9a84c",
    logo: treasurelogo,
    tagline: "Premium",
    description:
      "Sophisticated formalwear and refined essentials designed for the modern gentleman.",
    specializing: "Formal Shirts, Premium Collections & Tailored Essentials",
    href: "/products/garments?brand=treasure",
    segment: "Premium Line",
    image: treasureimg,
    icon: shirtlogo,
    iconBg: "bg-[#1a1a1a]",
  },
  {
    id: "vandegraff",
    bg: "bg-[#7a1515]",
    accentColor: "#f0c4c4",
    logo: vandegrafflogo,
    tagline: "Smart Casual",
    description:
      "Contemporary shirts and trousers blending comfort, style and uncompromised quality.",
    specializing: "Shirts, Trousers, Smart Casuals & Everyday Classics",
    href: "/products/garments?brand=vandegraff",
    segment: "Value Line",
    image: vandegraffimg,
    icon: shirtlogo,
    iconBg: "bg-[#7a1515]",
  },
  {
    id: "tom-jack",
    bg: "bg-[#1a2535]",
    accentColor: "#c9a84c",
    logo: tomjacklogo,
    tagline: "Casual Wear",
    description:
      "Modern casualwear made for those who live life on their own terms.",
    specializing: "Polo Tees, Casualwear, Basics & Lifestyle Collections",
    href: "/products/garments?brand=tom-jack",
    segment: "Active Premium",
    image: tomjackimg,
    icon: shirtlogo,
    iconBg: "bg-[#1a2535]",
  },
] as const;

export function GarmentsBrands() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isContainerInView = useInView(containerRef, {
    once: true,
    margin: "-100px",
  });

  return (
    <section
      className="bg-[var(--bg)] md:px-0"
      ref={containerRef}
    >
      {/* ── TOP HERO SECTION ── */}
      <div className="relative overflow-hidden  py-10 md:py-15">
        <div className="relative mx-auto max-w-[1440px] px-2 md:px-6 lg:px-12">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="flex items-center gap-3 mb-3"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
                  OUR BRANDS
                </span>
              </motion.div>

              <motion.h2
                className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] dark:text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                Our Manufacturing <span className="text-gold">Brands</span>
              </motion.h2>

              <motion.p
                className="mt-6 text-sm leading-relaxed text-[#5a5a5a] dark:text-[var(--text-muted)]"
                initial={{ opacity: 0 }}
                animate={isContainerInView ? { opacity: 1 } : {}}
                transition={{ duration: 1, delay: 0.25 }}
              >
                WCC operates specialized brands, each with a distinct identity
                and shared dedication to quality, craftsmanship and style.
              </motion.p>
            </div>

            {/* View All CTA — top-right, desktop only */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.5,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="hidden sm:flex shrink-0 items-start pt-2"
            >
              <Link
                href="/products/garments"
                className="group btn-gold text-[10px] flex items-center gap-2"
              >
                View All Garments
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <ArrowUpRight className="absolute h-4 w-4 transition-all duration-500 ease-in-out opacity-100 scale-100 translate-x-0 group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                  <ArrowRight className="absolute h-4 w-4 opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── THREE BRAND PANELS ── */}
      <div className="relative mx-auto max-w-[1440px] px-2 md:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {BRAND_PANELS.map((brand, index) => {
          return (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isContainerInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.2 + index * 0.1,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="relative"
            >
              <Link
                href={brand.href}
                className={`group relative flex flex-col overflow-hidden ${brand.bg} border border-[var(--border)] transition-all duration-500 hover:border-gold/30`}
                data-cursor="view"
              >
                {/* Background photo with overlay */}
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out "
                    style={{ backgroundImage: `url('${brand.image.src}')` }}
                  />
                  <div className="absolute inset-0 " />
                </div>

                {/* Image overlay content */}
                <div
                  className="relative z-10 flex flex-1 flex-col p-5 md:p-6 min-h-[320px] sm:min-h-[360px]"
                >
                  {/* Logo area — top */}
                  <div className="mb-auto flex ">
                    <Image
                      src={brand.logo}
                      alt={`${brand.segment} Logo`}
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Middle: tagline + divider + description */}
                  <div className="mt-8">
                    <h3 className="text-[#f8aa00] font-bold leading-tight uppercase">
                      {brand.tagline}
                    </h3>
                    <p className="mt-4 text-white text-sm leading-relaxed">
                      {brand.description}
                    </p>
                  </div>
                </div>

                {/* White bottom strip: specializing + discover */}
                <div className="relative z-10 bg-white px-5 py-4 border-t border-[var(--border)] dark:bg-[var(--bg-surface)]">
                  <div className="grid h-full grid-cols-[auto,minmax(0,1fr),auto] items-center gap-3 sm:gap-4">
                    <div
                      className={`${brand.iconBg} flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black`}
                    >
                      <Image
                        src={brand.icon}
                        alt="Shirt Logo"
                        className="h-7 w-7 object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="mb-1 block text-[8px] font-semibold uppercase tracking-[0.3em] text-gold">
                        SPECIALIZING IN
                      </span>
                      <span className="block text-[10px] leading-snug text-[#3a3a3a] dark:text-[var(--text)] sm:text-[11px]">
                        {brand.specializing}
                      </span>
                    </div>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] transition-all duration-300 group-hover:border-gold group-hover:bg-gold sm:h-9 sm:w-9">
                      <span className="relative flex h-4 w-4 items-center justify-center">
                        <ArrowUpRight className="absolute h-4 w-4 text-[var(--text-muted)] transition-all duration-500 ease-in-out opacity-100 scale-100 translate-x-0 group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                        <ArrowRight className="absolute h-4 w-4 text-white opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                      </span>
                    </div>
                  </div>
                  {/* Gold accent line */}
                </div>
              </Link>
            </motion.div>
          );
        })}
        </div>
      </div>

      {/* View All CTA — mobile only, full width with side padding */}
      <div className="flex sm:hidden mt-10 px-4 py-4 bg-[var(--bg)]">
        <Link
          href="/products/garments"
          className="group btn-gold font-mono text-xs font-bold tracking-[0.2em] rounded-none flex w-full items-center justify-center gap-2"
        >
          View All Garments
          <span className="relative flex h-4 w-4 items-center justify-center">
            <ArrowUpRight className="absolute h-4 w-4 transition-all duration-500 ease-in-out opacity-100 scale-100 translate-x-0 group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
            <ArrowRight className="absolute h-4 w-4 opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
          </span>
        </Link>
      </div>
    </section>
  );
}
