'use client'

import { Scissors, Layers, ShieldCheck, Truck, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRef } from 'react'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'
import { ResponsivePicture } from '@/components/ui/ResponsivePicture'

const ICONS = [Search, Scissors, Layers, ShieldCheck, Truck]

const DEFAULT_DUBAI_PIPELINE = {
  indicator: "MANUFACTURING EXCELLENCE",
  headingStart: "The Dubai manufacturing ",
  headingHighlight: "pipeline",
  subHeading: "Five stages from raw textile to global distribution",
  scenes: [
    { step: '01', title: 'Textile Sourcing & Inspection', desc: 'Uncompromising raw material selection from global yarn mills, verified through rigorous tension and density diagnostics.', image: '/images/manufacturing-pipeline/textstyle sorcing.png' },
    { step: '02', title: 'Precision CAD Pattern Cutting', desc: 'Laser automated fabric slicing ensuring millimeter exactness across thousands of stacked textile layers simultaneously.', image: '/images/manufacturing-pipeline/2pipeline img.png' },
    { step: '03', title: 'Industrial Assembly & Stitching', desc: 'High-speed automated and artisan needlecraft producing reinforced seams engineered for extreme commercial endurance.', image: '/images/manufacturing-pipeline/3pipelineimg.png' },
    { step: '04', title: 'Flawless QA & Finishing', desc: 'Multi-stage optical and mechanical stress tests ensuring zero defects before garment pressing and sanitary enclosure.', image: '/images/manufacturing-pipeline/4pipelineimg.png' },
    { step: '05', title: 'Secure Enclosure & Export', desc: 'Containerized logistics departing from Jebel Ali Port, Dubai directly to corporate hubs and distributors in 50+ countries.', image: '/images/factory.jpeg' }
  ]
}

export function ManufacturingStory() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const { data } = useWebsiteContent('dubai-pipeline', DEFAULT_DUBAI_PIPELINE)

  const scroll = (dir: 'prev' | 'next') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'next' ? 320 : -320, behavior: 'smooth' })
  }

  return (
    <section className="bg-[#0A0A0A] text-white py-16 md:py-24 px-2 lg:px-12 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(218,165,32,0.03)_0%,transparent_70%)] pointer-events-none" />

      {/* Heading */}
      <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              {data.indicator}
            </span>
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {data.headingStart}<span className='text-gold'>{data.headingHighlight}</span>
          </h2>
          <p className="mt-3 text-xs uppercase tracking-widest text-white/50 font-mono">
            ✦ {data.subHeading}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => scroll('prev')}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all duration-300 active:scale-95"
            aria-label="Previous Step"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={() => scroll('next')}
            className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-gold hover:border-gold hover:text-white transition-all duration-300 active:scale-95"
            aria-label="Next Step"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Cards Row */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {data.scenes.map((scene: any, idx: number) => {
          const Icon = ICONS[idx] || Search
          return (
            <div
              key={scene.step}
              className="group relative h-[460px] w-[calc(100vw-48px)] sm:w-[330px] flex-shrink-0 overflow-hidden border border-white/10 rounded-none bg-neutral-950 p-6 flex flex-col justify-between transition-all duration-500 hover:border-gold/40 hover:shadow-[0_20px_50px_rgba(218,165,32,0.15)] snap-start"
            >
              {/* Card Image Background */}
              <div className="absolute inset-0 z-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1.2s] ease-out rounded-none">
                <ResponsivePicture
                  src={scene.image}
                  alt={scene.title}
                  fill
                  unoptimized={true}
                  className="object-cover transition-all duration-[1s] ease-out rounded-none"
                  sizes="330px"
                  priority={idx < 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent rounded-none" />
              </div>

              {/* Header: Step Indicator & Icon */}
              <div className="relative z-10 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-none border border-white/10 bg-black/80 backdrop-blur-md text-white shadow-lg">
                  <span className="font-mono text-base font-bold tracking-tight">
                    {scene.step}
                  </span>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/80 backdrop-blur-md text-gold group-hover:border-gold group-hover:bg-gold group-hover:text-white transition-all duration-500 shadow-lg">
                  <Icon className="h-4.5 w-4.5 text-white" />
                </div>
              </div>

              {/* Bottom Details */}
              <div className="relative z-10 bg-black/80 backdrop-blur-xl border border-white/10 p-5 rounded-none mt-auto shadow-2xl">
                <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-gold transition-colors duration-300">
                  {scene.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-xs leading-relaxed text-white/80">
                  {scene.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}