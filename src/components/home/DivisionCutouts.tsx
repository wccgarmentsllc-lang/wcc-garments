"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";

const DEFAULT_GARMENTS = {
  indicator: "OUR MANUFACTURING DIVISIONS",
  headingStart: "Garments we ",
  headingHighlight: "manufacture",
  description:
    "High-quality garments, linens, and B2B supplies crafted with precision. While garments remain our absolute core business, we have successfully expanded our industrial capacities to serve major developments in hospitality, home decor, fragrance, and household supply.",
  categories: [
    {
      name: "Shirts",
      slug: "shirts",
      tagline: "Crisp, premium tailored fits",
      count: "140+ Styles",
      image: "/images/formal-shirts.png",
    },
    {
      name: "T-Shirts",
      slug: "t-shirts",
      tagline: "High-comfort mercerized cotton",
      count: "320+ Styles",
      image: "/images/polo tshirts.png",
    },
    {
      name: "Jeans",
      slug: "jeans",
      tagline: "Durable premium industrial denim",
      count: "210+ Styles",
      image: "/images/jeans-denims.png",
    },
    {
      name: "Trousers",
      slug: "trousers",
      tagline: "Perfect fit corporate trousers",
      count: "110+ Styles",
      image: "/images/trousers.png",
    },
    {
      name: "Cargos",
      slug: "cargos",
      tagline: "Heavy-duty utility cargo workwear",
      count: "95+ Styles",
      image: "/images/products/cargo_work_pants.png",
    },
    {
      name: "Track Pants",
      slug: "track-pants",
      tagline: "Active performance leisure wear",
      count: "85+ Styles",
      image: "/images/Blazers and suits.png",
    },
  ],
};

export function DivisionCutouts() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data } = useWebsiteContent("garments-showcase", DEFAULT_GARMENTS);

  return (
    <section className="bg-[var(--bg)] py-16 md:py-24" ref={ref}>
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
                {data.indicator}
              </span>
            </div>
          </motion.div>
          <motion.h2
            className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--text)]"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
          >
            {data.headingStart}
            <span className="text-gold">{data.headingHighlight}</span>
          </motion.h2>
          <motion.p
            className="mt-4 text-sm sm:text-base leading-relaxed text-gray-500 max-w-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {data.description}
          </motion.p>
        </div>

        {/* Division Grid - 3x2 Symmetrical */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {data.categories.map((category: any, index: number) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.8,
                delay: 0.15 + index * 0.08,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <Link
                href={`/products/garments?category=${category.slug}`}
                className="group relative block overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] rounded-none transition-all duration-500 hover:border-gold/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                data-cursor="view"
              >
                {/* Image aspect-[3/4] */}
                <div className="relative overflow-hidden aspect-[4/3] sm:aspect-[3/4] rounded-none">
                  <ResponsivePicture
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Subtle lighting mask */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-85" />
                </div>

                {/* Info Bottom */}
                <div className="p-5 bg-[var(--bg-surface)]">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[var(--text)] group-hover:text-gold transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                        {category.tagline}
                      </p>
                      <span className="mt-2.5 inline-block font-mono text-[9px] font-bold text-gold uppercase tracking-wider bg-gold/5 border border-gold/10 px-2 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] transition-all duration-300 group-hover:border-gold group-hover:bg-gold">
                      <span className="relative flex h-4 w-4 items-center justify-center">
                        <ArrowUpRight className="absolute h-4 w-4 text-[var(--text-muted)] transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                        <ArrowRight className="absolute h-4 w-4 text-white opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                      </span>
                    </div>
                  </div>
                  {/* Gold accent line */}
                  <div className="mt-4 h-[2px] w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
