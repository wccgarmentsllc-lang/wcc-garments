"use client";

import { useState } from "react";
import { useWebsiteContent } from "@/hooks/useWebsiteContent";

const DEFAULT_NEWSLETTER = {
  backgroundImage: "/images/factory.jpeg",
  headline: "Receive exclusive B2B catalog releases, wholesale offers, and custom manufacturing updates across our garments, hospitality, and household divisions."
};

export default function NewsletterSubscribe() {
  const { data: content } = useWebsiteContent("newsletter", DEFAULT_NEWSLETTER);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setEmail('')
      } else {
        setErrorMsg(data.message || 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  };

  return (
    <div className="mx-auto max-w-[1440px] w-full">
      <section
        className="relative w-full bg-[var(--bg-surface)] text-[var(--text)] py-12 md:py-16 lg:py-20 px-6 flex items-center justify-center overflow-hidden transition-colors duration-500 min-h-0"
        style={{ contain: 'paint' }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ width: '100%', height: '100%' }}>
          <div
            className="absolute inset-0 opacity-20 dark:opacity-[0.14]"
            style={{
              backgroundImage: `url('${content?.backgroundImage || DEFAULT_NEWSLETTER.backgroundImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'scroll',
              filter: 'saturate(0.2) brightness(0.85)',
            }}
          />
          <div className="absolute inset-0 bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(10,10,10,0.65)]" />
        </div>

        {/* Subtle grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "180px",
          }}
        />

        <div className="relative z-10 w-full max-w-xl lg:max-w-2xl mx-auto text-center">
          {/* Eyebrow label */}
          <p
            className="text-xs tracking-[0.25em] text-gold uppercase mb-6 lg:mb-10 font-bold"
            style={{ fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif" }}
          >
            Stay Connected
          </p>

          {/* Headline */}
          {status !== "success" && (
            <p
              className="text-lg md:text-[1.2rem] lg:text-[1.35rem] leading-relaxed text-[var(--text)] font-light mb-8 lg:mb-12 max-w-2xl mx-auto"
              style={{ fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif" }}
            >
              {content?.headline || DEFAULT_NEWSLETTER.headline}
            </p>
          )}

          {/* Success state */}
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-6 animate-[fadeIn_0.6s_ease_forwards]">
              <svg
                className="w-8 h-8 text-[var(--text)] mb-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              <p
                className="text-[1.2rem] text-[var(--text)] font-light"
                style={{ fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif" }}
              >
                You're on the list.
              </p>
              <p
                className="text-xs tracking-[0.18em] text-[var(--text-muted)] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif" }}
              >
                Expect something beautiful soon.
              </p>
            </div>
          ) : (
            <>
              {/* Input + Button */}
              <div className="flex flex-col sm:flex-row items-stretch w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto border border-[var(--border)] bg-transparent">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  placeholder="Your email address"
                  className="flex-1 bg-transparent px-5 py-3 lg:py-4 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none tracking-wide border-b sm:border-b-0 border-[var(--border)]"
                  style={{ fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif", fontSize: "1rem" }}
                />
                <button
                  onClick={handleSubscribe}
                  disabled={status === "loading"}
                  className="relative bg-gold text-white px-8 py-3 lg:py-4 text-xs tracking-[0.22em] uppercase font-light transition-all duration-300 hover:bg-gold-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden group"
                  style={{ fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif" }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      <span>Sending</span>
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>

              {/* Error message */}
              {status === "error" && (
                <p
                  className="mt-3 text-xs text-[#D97706] dark:text-[#FBBF24] tracking-widest uppercase animate-[fadeIn_0.3s_ease_forwards]"
                  style={{ fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif" }}
                >
                  {errorMsg}
                </p>
              )}

              {/* Disclaimer */}
              <p
                className="mt-5 text-[0.65rem] tracking-[0.2em] text-[var(--text-muted)] uppercase"
                style={{ fontFamily: "'Cormorant Garamond', 'Garamond', Georgia, serif" }}
              >
                No Spam. Unsubscribe Anytime.
              </p>
            </>
          )}
        </div>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap');

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>
    </div>
  );
}