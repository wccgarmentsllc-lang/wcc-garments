"use client";

import React, { useEffect, useState, JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const BLUR_PLACEHOLDER =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

const CAMPAIGN_SETS = [
  {
    id: 1,
    center: "/images/products/egyptian_cotton_shirt.png",
    left: "/images/products/cargo_work_pants.png",
    right: "/images/products/chef_uniform.png",
    title: "Industrial Elegance",
    tag: "Campaign 2026",
  },
  {
    id: 2,
    center: "/images/products/hotel_bed_linen.png",
    left: "/images/products/luxury_bath_towels.png",
    right: "/images/products/egyptian_cotton_shirt.png",
    title: "Hospitality & Bedding",
    tag: "Luxury Suite",
  },
  {
    id: 3,
    center: "/images/products/chef_uniform.png",
    left: "/images/products/cargo_work_pants.png",
    right: "/images/products/hotel_bed_linen.png",
    title: "Professional Workwear",
    tag: "Corporate Uniforms",
  },
];

const ALL_IMAGE_PATHS = Array.from(
  new Set(CAMPAIGN_SETS.flatMap((c) => [c.center, c.left, c.right])),
);

import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { resolveImageSrc } from "@/lib/image-utils";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export function HeroSection(): JSX.Element {
  const [campaignIdx, setCampaignIdx] = useState<number>(0);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const [dynamicCampaignSets, setDynamicCampaignSets] = useState<any[]>([]);

  const { data: heroData } = useWebsiteContent("hero", { campaigns: CAMPAIGN_SETS });

  useEffect(() => {
    fetch('/api/products?division=garments&limit=100', { cache: 'no-store' })
      .then(res => res.json())
      .then(json => {
        if (json.success && Array.isArray(json.data) && json.data.length >= 3) {
          const list = [...json.data]
          // Shuffle products
          for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
          }
          
          const newCampaigns = []
          const numCampaigns = Math.min(4, list.length)
          for (let i = 0; i < numCampaigns; i++) {
            const centerProd = list[i]
            const leftProd = list[(i - 1 + list.length) % list.length]
            const rightProd = list[(i + 1) % list.length]
            
            newCampaigns.push({
              id: centerProd.id || `dynamic-${i}`,
              center: centerProd.images?.[0] || "/images/products/egyptian_cotton_shirt.png",
              left: leftProd.images?.[0] || "/images/products/cargo_work_pants.png",
              right: rightProd.images?.[0] || "/images/products/chef_uniform.png",
              title: centerProd.name,
              tag: centerProd.brand_slug ? centerProd.brand_slug.toUpperCase() : "LATEST RELEASE",
              centerSlug: centerProd.slug,
              leftSlug: leftProd.slug,
              rightSlug: rightProd.slug,
            })
          }
          setDynamicCampaignSets(newCampaigns)
        }
      })
      .catch(err => console.error("Failed to load hero garments rotation:", err))
  }, [])

  const campaignSets = dynamicCampaignSets.length >= 3 ? dynamicCampaignSets : (heroData?.campaigns ?? CAMPAIGN_SETS);

  useEffect(() => {
    let count = 0;
    const allPaths = Array.from(
      new Set(campaignSets.flatMap((c: any) => [
        resolveImageSrc(c.center), resolveImageSrc(c.left), resolveImageSrc(c.right)
      ])).values()
    ).filter(Boolean);
    if (allPaths.length === 0) {
      setAllLoaded(true);
      return;
    }
    allPaths.forEach((src) => {
      const img = new window.Image();
      img.src = src as string;
      img.onload = img.onerror = () => {
        count += 1;
        if (count >= allPaths.length) setAllLoaded(true);
      };
    });
  }, [campaignSets]);

  useEffect(() => {
    if (!allLoaded) return;
    const timer = setInterval(() => {
      setCampaignIdx((prev) => (prev + 1) % campaignSets.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [allLoaded, campaignSets.length]);

  const campaign = campaignSets[campaignIdx] || CAMPAIGN_SETS[0];

  return (
    <>
      <section
        className={[
          "relative w-full min-h-screen md:h-[88svh] lg:h-[98svh] xl:h-[102svh] overflow-hidden noise-layer z-5 flex items-center justify-center sm:pt-10",
          "bg-white dark:bg-black animate-fade-in",
        ].join(" ")}
      >
        {/* Ambient Glow */}
        <div
          className={[
            "absolute w-[600px] h-[600px] -top-24 left-[40%]",
            "rounded-full pointer-events-none z-0 animate-glow-pulse",
            "bg-[radial-gradient(circle,rgba(180,160,100,0.04)_0%,transparent_70%)]",
          ].join(" ")}
        />

        {/* Hero Content */}
        <div className="relative z-[5] w-full flex flex-col items-center justify-center hover-trigger cursor-default px-6 md:px-0 py-16 md:py-0">
          <div className="relative w-full max-w-[1440px] md:px-12 flex flex-col md:grid md:grid-cols-12 md:grid-rows-[auto_auto] md:gap-8 md:items-center gap-6 justify-center items-center">
            {/* ── TEXT BLOCK ── */}
            <div className="contents md:flex md:flex-col md:col-start-1 md:col-span-7 md:row-start-1 md:row-span-2 md:self-center md:items-start">
              <div className="flex flex-col items-center md:items-start justify-center text-center md:text-left order-1 md:order-none w-full">
                {/* 
                  CHANGE: Added `text-center md:text-left` to this inner container div.
                  This ensures the heading spans inherit centered alignment on mobile
                  while keeping left-aligned on desktop. Everything else is unchanged.
                */}
                <div className="flex flex-col items-center md:items-start gap-0 w-full overflow-hidden">
                  <motion.span
                    initial={{ opacity: 0, scale: 1.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 2,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.2,
                    }}
                    className="block font-sans font-bold text-[#3b82f6] text-[clamp(52px,18vw,110px)] sm:text-[clamp(36px,9vw,110px)] leading-[0.9] tracking-[-0.03em] whitespace-nowrap w-full text-center md:text-left"
                    style={{
                      WebkitTextStroke: "1.2px #3b82f6",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    WESTERN
                  </motion.span>

                  <motion.span
                    initial={{ opacity: 0, scale: 0.35, y: 80 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 2.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.35,
                    }}
                    className="block font-sans font-bold text-black dark:text-white text-[clamp(52px,18vw,110px)] sm:text-[clamp(36px,9vw,110px)] leading-[0.9] tracking-[-0.06em] whitespace-nowrap drop-shadow-[0_0_30px_rgba(255,255,255,0.08)] w-full text-center md:text-left"
                  >
                    CLOTHING
                  </motion.span>

                  <motion.span
                    initial={{ opacity: 0, scale: 0.35, y: 80 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      duration: 2.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.45,
                    }}
                    className="block font-sans font-bold text-black dark:text-white text-[clamp(52px,18vw,110px)] sm:text-[clamp(36px,9vw,110px)] leading-[0.9] tracking-[-0.06em] whitespace-nowrap drop-shadow-[0_0_30px_rgba(255,255,255,0.08)] w-full text-center md:text-left"
                  >
                    COMPANY
                  </motion.span>
                </div>

                <p
                  className={[
                    "mt-6  text-[8px] sm:text-[12px] ",
                    "text-black dark:text-white md:text-black md:dark:text-white max-w-[480px] md:max-w-[700px]",
                    "animate-fade-up [animation-delay:1100ms] hidden md:block",
                  ].join(" ")}
                >
                  An industrial fashion manufacturing group operating at global
                  scale. Delivering bespoke garments, hospitality uniforms, home
                  textiles, and premium raw materials across 50+ countries.
                </p>
              </div>

              <div className="sm:mt-5 flex items-center gap-6 order-3 w-full sm:w-auto">
                <Link
                  href="/contact"
                  className="group btn-gold font-mono text-xs font-bold tracking-[0.2em] rounded-none flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Request a Quotation
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <ArrowUpRight className="absolute h-4 w-4 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />

                    <ArrowRight className="absolute h-4 w-4 opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </div>
            </div>

            {/* ── IMAGE CAROUSEL BLOCK ── */}
            <div className="relative flex items-center justify-center md:col-start-8 md:col-span-5 md:row-start-1 md:row-span-2 w-full h-[320px] sm:h-[400px] md:h-[540px] select-none z-[40] order-2 md:order-none">
              {/* Hidden preload */}
              <div
                className="absolute w-1 h-1 overflow-hidden pointer-events-none opacity-0"
                aria-hidden="true"
              >
                {ALL_IMAGE_PATHS.map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={10}
                    height={10}
                    priority
                    className="object-cover"
                  />
                ))}
              </div>

              {/* Left Card */}
              <AnimatePresence>
                <motion.div
                  key={`left-${campaign.id}`}
                  initial={{ opacity: 0, x: -120, y: 0, rotate: -20 }}
                  animate={{ opacity: 0.4, x: -65, y: -25, rotate: -10 }}
                  exit={{
                    opacity: 0,
                    x: -40,
                    rotate: -5,
                    transition: { duration: 0.4, ease: "easeIn" },
                  }}
                  transition={{
                    duration: 1.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 0.6,
                  }}
                  className="absolute w-[160px] h-[220px] sm:w-[200px] sm:h-[270px] md:w-[260px] md:h-[360px] overflow-hidden"
                  style={{
                    border: "1px boreder-black",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  <Link href={campaign.leftSlug ? `/products/garments/details/${campaign.leftSlug}` : "/products/garments"} className="relative block w-full h-full">
                    <Image
                      src={resolveImageSrc(campaign.left)}
                      alt="Campaign background"
                      fill
                      priority
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 260px"
                      className="object-cover"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Right Card */}
              <AnimatePresence>
                <motion.div
                  key={`right-${campaign.id}`}
                  initial={{ opacity: 0, x: 120, y: 40, rotate: 20 }}
                  animate={{ opacity: 0.3, x: 65, y: 15, rotate: 8 }}
                  exit={{
                    opacity: 0,
                    x: 40,
                    rotate: 5,
                    transition: { duration: 0.4, ease: "easeIn" },
                  }}
                  transition={{
                    duration: 1.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 1.0,
                  }}
                  className="absolute w-[160px] h-[220px] sm:w-[200px] sm:h-[270px] md:w-[260px] md:h-[360px] overflow-hidden"
                  style={{
                    border: "1px boreder-black",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.06)",
                  }}
                >
                  <Link href={campaign.rightSlug ? `/products/garments/details/${campaign.rightSlug}` : "/products/garments"} className="relative block w-full h-full">
                    <Image
                      src={resolveImageSrc(campaign.right)}
                      alt="Campaign background detail"
                      fill
                      priority
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      sizes="(max-width: 640px) 160px, (max-width: 1024px) 200px, 260px"
                      className="object-cover"
                    />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Center Card */}
              <AnimatePresence>
                <motion.div
                  key={`center-${campaign.id}`}
                  initial={{ opacity: 0, scale: 0.8, y: 80, rotate: 0 }}
                  animate={{ opacity: 1, scale: 1, y: -10, rotate: -2 }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    y: 20,
                    transition: { duration: 0.4, ease: "easeIn" },
                  }}
                  transition={{
                    duration: 1.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: 1.4,
                  }}
                  className="absolute w-[180px] h-[245px] sm:w-[220px] sm:h-[300px] md:w-[280px] md:h-[390px] overflow-hidden z-10 group cursor-pointer"
                  style={{
                    border: "1px boreder-black",
                    boxShadow:
                      "0 0 0 1px rgba(0,0,0,0.08), 0 20px 60px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.08)",
                  }}
                >
                  <Link href={campaign.centerSlug ? `/products/garments/details/${campaign.centerSlug}` : "/products/garments"} className="relative block w-full h-full">
                    <Image
                      src={resolveImageSrc(campaign.center)}
                      alt={campaign.title}
                      fill
                      priority
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 280px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex flex-col items-start">
                      <span className="font-mono text-[8px] font-bold tracking-[0.2em] text-[#3b82f6] uppercase mb-1">
                        {campaign.tag}
                      </span>
                      <span className="font-display text-sm md:text-xl font-medium text-white leading-tight">
                        {campaign.title}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
