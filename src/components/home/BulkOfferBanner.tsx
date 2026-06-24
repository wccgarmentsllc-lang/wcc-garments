"use client";

import { ArrowRight, ArrowUpRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";
import { ResponsivePicture } from "@/components/ui/ResponsivePicture";

const DEFAULT_BULK_OFFER = {
  enabled: true,
  tagText: "Bulk Garments Order",
  headingStart: "Exclusive Discounts on Bulk Garment",
  headingHighlight: "Orders",
  description:
    "Large-scale premium clothing production for brands, wholesalers, and businesses with top-quality materials and reliable delivery.",
  discountPercentage: 25,
  discountText: "Flat Discount",
  discountSubText: "On orders above 500 pieces",
  offerEndDate: "June 30, 2026",
  buttonText: "Get Quote",
  slideImages: [
    "/images/bulkoffer/premium_hoodie.png",
    "/images/bulkoffer/premium_jeans.png",
    "/images/bulkoffer/premium_shirt.png",
  ],
};

export default function BulkOfferBanner() {
  const [current, setCurrent] = useState(0);
  const { data } = useWebsiteContent("bulk-offer", DEFAULT_BULK_OFFER);

  useEffect(() => {
    const images = data?.slideImages ?? [];
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [data?.slideImages?.length]);

  if (!data?.enabled) return null;

  const slideImages: any[] = data.slideImages ?? [];

  return (
    <section className="relative overflow-hidden bg-black py-5">
      <div className="relative mx-auto max-w-7xl">
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 items-center gap-10 px-5 py-10 md:p-8 lg:grid-cols-2 lg:p-14">
            {/* Left Content */}
            <div className="space-y-8 order-1 lg:order-1">
              <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
                {data.tagText}
              </span>

              <div className="space-y-0">
                <h2 className="mt-4 font-display text-4xl font-semibold leading-tight text-white md:text-5xl lg:text-6xl">
                  {data.headingStart}{" "}
                  <span className="text-gold">{data.headingHighlight}</span>
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
                  {data.description}
                </p>
              </div>

              {/* Offer Card */}
              <div className="flex flex-col gap-5 border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
                    {data.discountPercentage}%
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {data.discountText}
                    </h4>
                    <p className="text-sm text-gray-400">{data.discountSubText}</p>
                  </div>
                </div>

                <div className="hidden h-12 w-px bg-white/10 sm:block" />

                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                  <Calendar className="text-purple-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-400">Offer Ends</p>
                    <p className="text-sm font-medium text-white">
                      {data.offerEndDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA — desktop */}
              <div className="mt-10 w-full hidden lg:block">
                <Link
                  href="/contact?source=new-arrivals&intent=request-quote&businessType=Wholesale%20Distributor"
                  className="group btn-gold !text-white font-mono text-xs font-bold tracking-[0.2em] rounded-none flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {data.buttonText}
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <ArrowUpRight className="absolute h-4 w-4 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                    <ArrowRight className="absolute h-4 w-4 opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Right Side Slider */}
            <div className="relative flex h-[400px] lg:h-[520px] w-full items-center justify-center overflow-hidden order-2 lg:order-2">
              <div className="absolute h-[300px] w-[300px] lg:h-[350px] lg:w-[350px] rounded-full bg-blue-500/20 blur-[120px]" />
              <div className="relative h-[350px] w-full md:h-[430px] md:w-full overflow-hidden bg-white/5 shadow-[0_20px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                <div
                  className="flex h-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${current * 100}%)` }}
                >
                  {slideImages.map((img, index) => (
                    <div
                      key={index}
                      className="relative h-full min-w-full overflow-hidden"
                    >
                      <ResponsivePicture
                        src={img}
                        alt={`Bulk Product ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA — mobile */}
            <div className="w-full order-3 lg:hidden">
              <Link
                href="/contact?source=new-arrivals&intent=request-quote&businessType=Wholesale%20Distributor"
                className="group btn-gold !text-white font-mono text-xs font-bold tracking-[0.2em] rounded-none flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {data.buttonText}
                <span className="relative flex h-4 w-4 items-center justify-center">
                  <ArrowUpRight className="absolute h-4 w-4 transition-all duration-500 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:translate-x-2" />
                  <ArrowRight className="absolute h-4 w-4 opacity-0 scale-75 -translate-x-2 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}