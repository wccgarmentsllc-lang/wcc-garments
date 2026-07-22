'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { RevealText } from '@/components/ui/RevealText'
import { GlobalPresence } from '@/components/home/GlobalPresence'
import { MapPin, Target, Lightbulb, Users, ShieldCheck, Factory, Globe2, Layers } from 'lucide-react'
import { useWebsiteContent } from '@/hooks/useWebsiteContent'

const TIMELINE = [
  { year: '2001', event: 'WCC Fashions founded in Bangalore, India.' },
  { year: '2005', event: 'Expanded production to key textile hubs: Ahmedabad, Delhi, and Ludhiana.' },
  { year: '2010', event: 'Strategic shift of Headquarters to Dubai, UAE for global export reach.' },
  { year: '2014', event: 'Launched dedicated Uniforms & Workwear and Hospitality textile divisions.' },
  { year: '2018', event: 'International expansion with production facilities in Bangladesh and China.' },
  { year: '2022', event: 'Achieved major export milestones serving B2B clients across 50+ nations.' },
  { year: '2026', event: 'Celebrating 25+ years of industrial-scale manufacturing excellence.' },
]

const LOCATIONS = [
  { country: 'UAE', city: 'Dubai', role: 'Global Headquarters', detail: 'Strategic hub for sales, customer relations, and export operations to GCC, Africa, and beyond.' },
  { country: 'India', city: '5 Production Centers', role: 'Primary Manufacturing', detail: 'Vertically integrated facilities across Ahmedabad, Ludhiana, Bangalore, Delhi, and Tirupur.' },
  { country: 'Bangladesh', city: 'Dhaka', role: 'Bulk Production', detail: 'High-volume, cost-effective manufacturing facility ensuring competitive pricing.' },
  { country: 'China', city: 'Guangzhou', role: 'Sourcing & Mfg', detail: 'Strategic sourcing operations and specialized raw material manufacturing.' },
]

const VALUES = [
  { title: 'Quality Assurance', desc: 'Export-grade quality standards in every stitch and thread.' },
  { title: 'Scale & Capability', desc: 'Industrial-scale manufacturing handling small programs to massive contracts.' },
  { title: 'Global Reach', desc: 'Manufacturing across 3 countries, supplying to businesses in 50+ nations.' },
  { title: 'Partnership Approach', desc: 'Building long-term relationships. We grow when you grow.' },
]

const DEFAULT_ABOUT = {
  heroImage: "/images/about-hero.jpg",
  heroSince: "Since 2001",
  heroHeadingStart: "25+ Years of",
  heroHeadingHighlight: "Manufacturing Excellence",
  heroDescriptions: [
    "Established over **30 years ago** as **WCC Garments Trading LLC**, and now known as **WCC Fashions**, the company has earned the trust of leading retailers across the GCC and Middle East through its commitment to quality, reliability, and long-standing industry partnerships. Building on this strong foundation, WCC Fashions has expanded beyond apparel into **home furnishings, household products, and premium home & car fragrances**, delivering comprehensive lifestyle solutions for the retail and hospitality sectors.",

  ],
  stats: [
    { value: "50+", label: "Countries" },
    { value: "7", label: "Production Facilities" },
    { value: "6", label: "Specialized Divisions" },
    { value: "25+", label: "Years Experience" }
  ],
  missionTitle: "Our Mission",
  missionDesc: "To provide businesses worldwide with reliable, scalable, and high-quality textile manufacturing solutions. We strive to simplify global procurement for our B2B partners through vertical integration, multi-country production, and an unwavering commitment to export-grade quality.",
  visionTitle: "Our Vision",
  visionDesc: "To be the most trusted global manufacturing partner for corporate, hospitality, and retail sectors, recognized for our quarter-century of expertise, ethical production standards, and ability to deliver exceptional value at an industrial scale.",
  footprintTitle: "Global Footprint",
  footprintDesc: "7 international production and sourcing locations across 3 countries, strategically headquartered in Dubai.",
  locations: LOCATIONS,
  journeyTitle: "Our Journey",
  journeyDesc: "From our origins in Bangalore in 2001 to our current status as a Dubai-headquartered global manufacturing group, our 25-year journey has been defined by continuous expansion, uncompromised quality, and strong B2B partnerships.",
  timeline: TIMELINE,
  valuesTitle: "Our Core Values",
  values: VALUES,
  galleryTitle: "Warehouse & Production Gallery",
  galleryDesc: "A glimpse into our manufacturing excellence, warehouse operations, and global production capabilities.",
  gallery: [
    { image: "/images/gallery/ourgalleryimage.png", title: "PREMIUM MATERIALS", subtitle: "OUR PROCESS" },
    { image: "/images/gallery/ourgalleryimage4.png", title: "PRECISE PRODUCTION", subtitle: "OUR PROCESS" },
    { image: "/images/gallery/ourgalleryimage3.png", title: "QUALITY ASSURED", subtitle: "OUR PROCESS" },
    { image: "/images/gallery/ourgalleryimage5.png", title: "PREMIUM MATERIALS", subtitle: "OUR PROCESS" }
  ]
}

export default function AboutClient() {
  const { data } = useWebsiteContent('about-page', DEFAULT_ABOUT)

  return (
    <div className="min-h-screen bg-[var(--bg)] mt-16 font-sans">
      {/* Hero */}
      <div className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[70vh] w-full flex items-center overflow-hidden pt-10">
        <Image
          src={data.heroImage || DEFAULT_ABOUT.heroImage}
          alt="WCC Fashions Manufacturing Facility"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />

        {/* Subtle Dark Gradient Overlay behind text only */}
        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent w-full md:w-[60%] lg:w-[45%] z-10" />

        <div className="relative z-20 w-full mx-auto max-w-[1440px] px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-[50%] lg:w-[35%]"
          >
            <span className="font-display text-sm font-semibold tracking-widest text-gold uppercase mb-6 block font-mono">
              {data.heroSince}
            </span>
            <h1 className="font-display text-5xl lg:text-5xl leading-[1.1] font-bold text-white mb-6">
              {data.heroHeadingStart} <br />
              <span className="font-bold text-gold">{data.heroHeadingHighlight}</span>
            </h1>
            <div className="space-y-4 mb-10">
              {(data.heroDescriptions ?? [data.heroDescription]).map((para: string, i: number) => (
                <p key={i} className="text-sm leading-relaxed text-neutral-300">
                  {para.split(/\*\*(.+?)\*\*/).map((chunk: string, j: number) =>
                    j % 2 === 1
                      ? <strong key={j} className="font-semibold text-white">{chunk}</strong>
                      : chunk
                  )}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Stats Bar */}
      <div className="bg-black py-10 border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4 text-left lg:justify-center">
              <Globe2 className="w-10 h-10 text-gold stroke-[1.5] shrink-0" />
              <div>
                <p className="text-3xl font-bold text-white mb-1">{data.stats?.[0]?.value}</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest font-mono">{data.stats?.[0]?.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left lg:justify-center">
              <Factory className="w-10 h-10 text-gold stroke-[1.5] shrink-0" />
              <div>
                <p className="text-3xl font-bold text-white mb-1">{data.stats?.[1]?.value}</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest font-mono">{data.stats?.[1]?.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left lg:justify-center">
              <Layers className="w-10 h-10 text-gold stroke-[1.5] shrink-0" />
              <div>
                <p className="text-3xl font-bold text-white mb-1">{data.stats?.[2]?.value}</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest font-mono">{data.stats?.[2]?.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-left lg:justify-center">
              <Users className="w-10 h-10 text-gold stroke-[1.5] shrink-0" />
              <div>
                <p className="text-3xl font-bold text-white mb-1">{data.stats?.[3]?.value}</p>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest font-mono">{data.stats?.[3]?.label}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-section border-b border-[var(--border)] relative overflow-hidden">
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[1px] bg-[var(--border)] hidden lg:block" />
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 grid lg:grid-cols-2 gap-16 relative z-10">
          <motion.div className="bg-[var(--bg)] p-8 border border-[var(--border)]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <Target className="w-8 h-8 text-gold" />
              <h2 className="font-display text-2xl font-semibold">{data.missionTitle}</h2>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {data.missionDesc}
            </p>
          </motion.div>
          <motion.div className="bg-[var(--bg)] p-8 border border-[var(--border)]" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <div className="flex items-center gap-4 mb-6">
              <Lightbulb className="w-8 h-8 text-gold" />
              <h2 className="font-display text-2xl font-semibold">{data.visionTitle}</h2>
            </div>
            <p className="text-[var(--text-muted)] leading-relaxed">
              {data.visionDesc}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Global Manufacturing Footprint */}
      <div className="bg-[var(--bg-surface)] py-section border-b border-[var(--border)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <RevealText>
              <h2 className="font-display text-display-sm font-semibold text-[var(--text)]">
                {data.footprintTitle?.split(' ')[0]} <span className="font-light italic text-gold">{data.footprintTitle?.split(' ').slice(1).join(' ')}</span>
              </h2>
            </RevealText>
            <p className="mt-4 text-[var(--text-muted)]">{data.footprintDesc}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.locations?.map((loc: any, i: number) => (
              <motion.div key={loc.country || i} className="border border-[var(--border)] bg-[var(--bg)] p-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <MapPin className="w-6 h-6 text-gold mb-4" />
                <h3 className="font-display text-xl font-semibold mb-1">{loc.country}</h3>
                <p className="text-sm text-gold mb-4 font-medium">{loc.city}</p>
                <div className="h-[1px] w-full bg-[var(--border)] mb-4" />
                <p className="text-sm font-semibold text-[var(--text)] mb-2">{loc.role}</p>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{loc.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Global Presence Component */}
      <GlobalPresence />

      {/* Timeline */}
      <div className="py-section bg-[var(--bg)] border-t border-[var(--border)] overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
            <RevealText>
              <h2 className="font-display text-display-sm font-semibold text-[var(--text)]">
                {data.journeyTitle?.split(' ')[0]} <span className='text-gold'>{data.journeyTitle?.split(' ').slice(1).join(' ')}</span>
              </h2>
            </RevealText>
            <p className="mt-6 text-sm text-[var(--text-muted)] leading-relaxed">
              {data.journeyDesc}
            </p>
          </div>

          {/* Desktop/Tablet Horizontal Timeline */}
          <div className="hidden lg:block relative w-full pb-10">
            <div className="relative flex justify-between items-center w-full min-h-[350px]">
              {/* Actual line that we'll draw through the middle */}
              <div className="absolute left-0 right-0 top-1/2 h-[3px] bg-[var(--border)] -translate-y-1/2 rounded-full" />

              {/* Arrow head at the end of the line */}
              <div className="absolute right-0 top-1/2 w-4 h-4 border-t-[3px] border-r-[3px] border-[var(--border)] transform rotate-45 -translate-y-1/2 translate-x-[2px]" />

              {data.timeline?.map((item: any, i: number) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div
                    key={item.year || i}
                    className="relative flex flex-col items-center flex-1 group"
                    initial={{ opacity: 0, y: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {isEven ? (
                      <div className="absolute bottom-1/2 mb-3 flex flex-col items-center w-full px-2">
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-4 xl:p-5 rounded-xl text-center shadow-lg group-hover:border-gold/50 transition-colors duration-300 relative w-full max-w-[190px]">
                          <span className="font-display text-2xl xl:text-3xl font-bold text-gold block mb-2 xl:mb-3">{item.year}</span>
                          <p className="text-[11px] xl:text-xs text-[var(--text-muted)] group-hover:text-neutral-300 transition-colors leading-relaxed">{item.event}</p>
                        </div>
                        <div className="h-6 xl:h-8 w-[2px] border-l-2 border-dashed border-[var(--border)] group-hover:border-gold/50 transition-colors duration-300 mt-3" />
                      </div>
                    ) : (
                      <div className="absolute top-1/2 mt-3 flex flex-col items-center w-full px-2">
                        <div className="h-6 xl:h-8 w-[2px] border-l-2 border-dashed border-[var(--border)] group-hover:border-gold/50 transition-colors duration-300 mb-3" />
                        <div className="bg-[var(--bg-surface)] border border-[var(--border)] p-4 xl:p-5 rounded-xl text-center shadow-lg group-hover:border-gold/50 transition-colors duration-300 relative w-full max-w-[190px]">
                          <span className="font-display text-2xl xl:text-3xl font-bold text-gold block mb-2 xl:mb-3">{item.year}</span>
                          <p className="text-[11px] xl:text-xs text-[var(--text-muted)] group-hover:text-neutral-300 transition-colors leading-relaxed">{item.event}</p>
                        </div>
                      </div>
                    )}

                    {/* The Node on the line */}
                    <div className="w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-[var(--bg)] border-[3px] border-gold z-10 group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:bg-gold transition-all duration-300" />
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="lg:hidden max-w-lg mx-auto">
            {data.timeline?.map((item: any, i: number) => (
              <motion.div
                key={item.year || i}
                className="flex gap-5 border-l-[3px] border-[var(--border)] pb-8 pl-6 relative last:pb-0 last:border-transparent"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-[var(--bg)] border-[3px] border-gold" />
                <div className="-mt-2 bg-[var(--bg-surface)] border border-[var(--border)] p-5 rounded-xl w-full hover:border-gold/50 transition-colors">
                  <span className="font-display text-2xl font-bold text-gold block mb-2">
                    {item.year}
                  </span>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{item.event}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* Values */}
      <div className="bg-[var(--bg-surface)] pt-16 lg:pt-20 pb-16 lg:pb-24 border-t border-[var(--border)]">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 text-center">
          <RevealText><h2 className="font-display text-display-sm font-semibold text-[var(--text)]">{data.valuesTitle}</h2></RevealText>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.values?.map((val: any, i: number) => {
              const Icon = [ShieldCheck, Factory, Globe2, Users][i] || ShieldCheck;
              return (
                <motion.div key={val.title || i} className="border border-[var(--border)] bg-[var(--bg)] px-8 py-10 transition-all hover:border-gold/50 flex flex-col items-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Icon className="w-10 h-10 text-gold mb-6" />
                  <h3 className="font-display text-lg font-semibold text-[var(--text)] mb-3">{val.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{val.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="text-center mb-10 pt-10">
        <span className="font-mono text-[9px] font-bold pb-5 uppercase tracking-[0.3em] text-[var(--gold)] font-mono">
          GALLERY
        </span>

        <h2 className="font-display text-3xl md:text-4xl font-bold text-[var(--text)] mb-3">
          {data.galleryTitle?.split(' ').slice(0, -1).join(' ')} <span className="text-gold">{data.galleryTitle?.split(' ').slice(-1)[0]}</span>
        </h2>

        <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto">
          {data.galleryDesc}
        </p>
      </div>

      {/* Our Process Gallery Section */}
      <div className="pt-16 lg:pt-24 pb-16 lg:pb-20 overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4 auto-rows-[300px] md:auto-rows-[350px]">
            <div className="col-span-1 md:col-span-2 lg:col-span-1 relative rounded-xl overflow-hidden">
              <Image
                src={data.gallery?.[3]?.image || DEFAULT_ABOUT.gallery[3].image}
                alt={data.gallery?.[3]?.title || "Premium Materials"}
                fill
                className="object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />

              <div className="absolute top-8 left-8 right-8 z-10">
                <span className="font-display text-[11px] font-bold tracking-[0.2em] text-neutral-300 uppercase mb-4 block font-mono">
                  {data.gallery?.[3]?.subtitle || "OUR PROCESS"}
                </span>

                <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-[1.1]">
                  {data.gallery?.[3]?.title?.split(' ')?.[0]}
                  <br />
                  {data.gallery?.[3]?.title?.split(' ')?.slice(1)?.join(' ')}
                </h2>
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-10">
                <p className="text-sm text-neutral-300 leading-relaxed max-w-sm">
                  Every piece we create follows a journey of precision, care, and purpose.
                </p>
              </div>
            </div>

            {/* Image 01 - Row 1, Col 2 & 3 */}
            <motion.div
              className="col-span-1 md:col-span-2 lg:col-span-2 relative rounded-xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Image
                src={data.gallery?.[0]?.image || DEFAULT_ABOUT.gallery[0].image}
                alt={data.gallery?.[0]?.title || "Premium Materials"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <span className="text-neutral-300 text-xs font-semibold tracking-widest uppercase font-mono">{data.gallery?.[0]?.title}</span>
              </div>
            </motion.div>

            {/* Image 02 - Row 2, Col 1 & 2 */}
            <motion.div
              className="col-span-1 md:col-span-2 lg:col-span-2 relative rounded-xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <Image
                src={data.gallery?.[1]?.image || DEFAULT_ABOUT.gallery[1].image}
                alt={data.gallery?.[1]?.title || "Precise Production"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <span className="text-neutral-300 text-xs font-semibold tracking-widest uppercase font-mono">{data.gallery?.[1]?.title}</span>
              </div>
            </motion.div>

            {/* Image 03 - Row 2, Col 3 */}
            <motion.div
              className="col-span-1 relative rounded-xl overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src={data.gallery?.[2]?.image || DEFAULT_ABOUT.gallery[2].image}
                alt={data.gallery?.[2]?.title || "Quality Assured"}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <span className="text-neutral-300 text-xs font-semibold tracking-widest uppercase font-mono">{data.gallery?.[2]?.title}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
