"use client";

import { useMemo, memo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";
import { DEFAULT_GARMENTS } from "@/app/admin/sections/defaults";

export interface CutoutCategory {
  name: string;
  slug: string;
  tagline?: string;
  count?: string;
  image?: string;
}

export interface DivisionCutoutsData {
  indicator?: string;
  headingStart?: string;
  headingHighlight?: string;
  description?: string;
  categories: CutoutCategory[];
}

// Static Framer Motion animation variants (reused across renders for zero memory allocations)
const headerVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] } },
};

const titleVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] } },
};

const descVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, delay: 0.2 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.1 + (index % 3) * 0.08,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
};

// Static Skeleton Items
const SKELETON_ITEMS = [1, 2, 3, 4, 5, 6];

// Memoized Cutout Card Item Component
const CutoutCard = memo(function CutoutCard({
  category,
  index,
}: {
  category: CutoutCategory;
  index: number;
}) {
  const catSlug = useMemo(
    () => category.slug || category.name?.toLowerCase().replace(/\s+/g, "-"),
    [category.slug, category.name]
  );

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={cardVariant}
    >
      <Link
        href={`/products/garments?category=${catSlug}`}
        className="group relative block overflow-hidden bg-[var(--bg-surface)] border border-[var(--border)] rounded-none transition-all duration-500 hover:border-gold/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
        data-cursor="view"
      >
        {/* Image Aspect Ratio */}
        <div className="relative overflow-hidden aspect-[16/10] rounded-none">
          <ResponsivePicture
            src={category.image || "/images/placeholder.jpg"}
            alt={category.name}
            fill
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-85" />
        </div>

        {/* Info Card Content */}
        <div className="p-5 bg-[var(--bg-surface)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-gold transition-colors duration-300">
                {category.name}
              </h3>
              {category.tagline && (
                <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                  {category.tagline}
                </p>
              )}
              {category.count && (
                <span className="mt-2.5 inline-block font-mono text-[9px] font-bold text-gold uppercase tracking-wider bg-gold/5 border border-gold/10 px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              )}
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] transition-all duration-300 group-hover:border-gold group-hover:bg-gold">
              <span className="relative flex h-4 w-4 items-center justify-center">
                <ArrowUpRight className="absolute h-4 w-4 text-[var(--text-muted)] transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                <ArrowRight className="absolute h-4 w-4 text-white opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
              </span>
            </div>
          </div>
          <div className="mt-4 h-[2px] w-0 bg-gold transition-all duration-500 group-hover:w-full" />
        </div>
      </Link>
    </motion.div>
  );
});

export function DivisionCutouts() {
  const { data, loading } = useWebsiteContent("garments-showcase", DEFAULT_GARMENTS);

  const activeData: DivisionCutoutsData = data || DEFAULT_GARMENTS;

  if (loading) {
    return (
      <section className="bg-[var(--bg)] py-16 md:py-24 font-sans">
        <div className="mx-auto max-w-[1440px] px-2 md:px-6 lg:px-12 animate-pulse">
          <div className="mb-12 max-w-2xl space-y-4">
            <div className="h-4 w-40 bg-gold/20 rounded" />
            <div className="h-10 w-3/4 bg-gray-300 dark:bg-gray-800 rounded" />
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800/50 rounded" />
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {SKELETON_ITEMS.map((i) => (
              <div key={i} className="aspect-[16/10] bg-gray-200 dark:bg-gray-800/40 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!activeData || !Array.isArray(activeData.categories) || activeData.categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-[var(--bg)] py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-2 md:px-6 lg:px-12">
        {/* Section Header */}
        <div className="mb-16 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={headerVariant}
          >
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
                {activeData.indicator || "OUR MANUFACTURING DIVISIONS"}
              </span>
            </div>
          </motion.div>
          <motion.h1
            className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-[var(--text)]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={titleVariant}
          >
            {activeData.headingStart ? activeData.headingStart.replace(/\bwe\b/gi, "We") : ""}{" "}
            <span className="text-gold capitalize">
              {activeData.headingHighlight
                ? activeData.headingHighlight.charAt(0).toUpperCase() + activeData.headingHighlight.slice(1)
                : ""}
            </span>
          </motion.h1>
          {activeData.description && (
            <motion.p
              className="mt-4 text-sm sm:text-base leading-relaxed text-gray-500 "
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={descVariant}
            >
              {activeData.description}
            </motion.p>
          )}
        </div>

        {/* Division Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {activeData.categories.map((category, index) => (
            <CutoutCard key={category.slug || index} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
