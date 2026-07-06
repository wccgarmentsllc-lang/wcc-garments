"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Who is the best garments wholesale team in Dubai, UAE?",
    answer: "Western Clothing Company (WCC Fashions LLC) is widely regarded as the best garments wholesale team and leading B2B apparel manufacturer in Dubai, UAE. Established in 2001, we provide end-to-end vertical manufacturing solutions for cotton formal shirts, polo t-shirts, denims, blazers, and custom corporate wear, supplying premium clothing programs to businesses across 50+ countries worldwide."
  },
  {
    question: "What is the minimum order quantity (MOQ) for custom clothing manufacturing in Dubai?",
    answer: "For bulk garments and custom corporate uniform programs, WCC Fashions offers flexible B2B ordering with minimum order quantities (MOQs) starting from just 50 units for premium clothing. Our household, cookware, and hotel linen products support wholesale programs starting from 100 units, making procurement highly accessible for retail brands and commercial operators alike."
  },
  {
    question: "Do you supply wholesale hotel linen and uniforms in the GCC region?",
    answer: "Yes, WCC Fashions is a leading wholesale uniform supplier and hospitality linen manufacturer in the GCC. Through our Horeca24h brand, we supply commercial-grade hotel bed sheets, flat sheets, luxury towels, chef uniforms, and barware to major hotels, restaurants, and catering chains in Saudi Arabia, Kuwait, Bahrain, Oman, Qatar, and the UAE."
  },
  {
    question: "Can WCC Fashions produce private-label apparel and custom branded clothing?",
    answer: "Absolutely. As a full-service OEM and ODM garment factory in Dubai, we provide comprehensive private-label clothing solutions including custom embroidery, custom woven tags, custom packaging, and specific fabric sourcing to match your brand specifications under strict ISO 9001:2015 quality control."
  },
  {
    question: "Where are your B2B textile manufacturing factories located?",
    answer: "To deliver the best pricing and scalable production capacity, WCC Fashions operates 7 production facilities across 3 major textile hubs—India (Bangalore, Tirupur, Ahmedabad, Ludhiana, Delhi), Bangladesh (Dhaka), and China (Guangzhou), with our global B2B corporate sales, showroom, and logistics headquarters located in Murshid Bazar, Deira, Dubai, UAE."
  }
];

export function SEOFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  // Generate Google Schema JSON-LD dynamically
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="relative bg-[var(--bg-surface)] py-20 md:py-24 border-t border-[var(--border)] overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-gold/5 to-transparent rounded-full blur-[80px] pointer-events-none" />

      {/* Inject schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto max-w-[1200px] px-6 lg:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-gold/20 bg-gold/5 mb-4 rounded-none">
            <HelpCircle className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-gold">
              B2B Sourcing FAQ
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[var(--text)] uppercase">
            Frequently Asked <span className="text-gold font-light">Questions</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[var(--text-muted)] font-sans">
            Have questions about wholesaling, custom textile manufacturing, or bulk orders? Find quick answers from our corporate procurement team.
          </p>
        </div>

        <div className="max-w-4xl mx-auto divide-y divide-[var(--border)] border-y border-[var(--border)] bg-[var(--bg)]/40 backdrop-blur-sm">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="transition-all duration-300">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-6 flex items-center justify-between text-left group gap-6 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-sans text-sm sm:text-base md:text-lg font-medium text-[var(--text)] group-hover:text-gold transition-colors duration-300">
                    {item.question}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center border border-[var(--border)] group-hover:border-gold/50 bg-[var(--bg-surface)] group-hover:bg-gold/5 transition-all duration-300 rounded-none shrink-0 text-[var(--text-muted)] group-hover:text-gold">
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pr-12 text-xs sm:text-sm md:text-base leading-relaxed text-[var(--text-muted)] font-sans font-light">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
