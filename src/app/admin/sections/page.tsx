'use client'

import { useState, useEffect } from 'react'
import { 
  Layers, Layout, Users, FileText, Settings,
  TrendingUp, Sliders, Mail, Info
} from 'lucide-react'
import { contentStore } from '@/lib/content-store'
import { useThemeContext } from '@/context/ThemeContext'
import { api } from '@/lib/api'

import { GlobalConfigEditor } from './components/GlobalConfigEditor'
import { BulkOfferEditor } from './components/BulkOfferEditor'
import { HeroEditor } from './components/HeroEditor'
import { WhoWeAreEditor } from './components/WhoWeAreEditor'
import { ShowcaseEditor } from './components/ShowcaseEditor'
import { ExpansionEditor } from './components/ExpansionEditor'
import { DubaiPipelineEditor } from './components/DubaiPipelineEditor'
import { NewsletterEditor } from './components/NewsletterEditor'
import { AboutPageEditor } from './components/AboutPageEditor'

import {
  DEFAULT_BULK_OFFER,
  DEFAULT_HERO,
  DEFAULT_WHO_WE_ARE,
  DEFAULT_GARMENTS,
  DEFAULT_HOUSEHOLDS,
  DEFAULT_HOSPITALITY,
  DEFAULT_EXPANSION,
  DEFAULT_DUBAI_PIPELINE,
  DEFAULT_NEWSLETTER,
  DEFAULT_ABOUT,
  DEFAULT_UNIFORMS,
  DEFAULT_HOME_SHOWCASE,
  DEFAULT_FRAGRANCE
} from './defaults'

type ActiveSection = 'global' | 'bulk' | 'hero' | 'who' | 'garment' | 'hospitality' | 'household' | 'uniforms' | 'homeShowcase' | 'fragrance' | 'expansion' | 'pipeline' | 'newsletter' | 'aboutPage'

export default function AdminSectionsPage() {
  const [activeTab, setActiveTab] = useState<ActiveSection>('hero')

  const [siteConfig, setSiteConfig] = useState<any>(null)
  const [bulkOffer, setBulkOffer] = useState<any>(null)
  const [hero, setHero] = useState<any>(null)
  const [whoWeAre, setWhoWeAre] = useState<any>(null)
  const [garments, setGarments] = useState<any>(null)
  const [households, setHouseholds] = useState<any>(null)
  const [hospitality, setHospitality] = useState<any>(null)
  const [uniforms, setUniforms] = useState<any>(null)
  const [homeShowcase, setHomeShowcase] = useState<any>(null)
  const [fragrance, setFragrance] = useState<any>(null)
  const [expansion, setExpansion] = useState<any>(null)
  const [dubaiPipeline, setDubaiPipeline] = useState<any>(null)
  const [newsletter, setNewsletter] = useState<any>(null)
  const [aboutPage, setAboutPage] = useState<any>(null)

  const [loading, setLoading] = useState(true)
  const { isDark } = useThemeContext()

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('wcc-admin-token') || ''
        const { data } = await api.admin.getContent(token)
        
        const getSec = (id: string, def: any) => {
          if (!data) return def
          const row = data.find((d: any) => (d.key === id || d.section_id === id))
          return row && row.content ? row.content : def
        }

        setSiteConfig(getSec('site_config', contentStore.getSiteConfig()))
        setBulkOffer(getSec('bulk-offer', DEFAULT_BULK_OFFER))
        setHero(getSec('hero', DEFAULT_HERO))
        setWhoWeAre(getSec('who-we-are', DEFAULT_WHO_WE_ARE))
        setGarments(getSec('garments-showcase', DEFAULT_GARMENTS))
        setHouseholds(getSec('households-showcase-v2', DEFAULT_HOUSEHOLDS))
        setHospitality(getSec('hospitality-showcase-v2', DEFAULT_HOSPITALITY))
        setUniforms(getSec('uniforms-showcase', DEFAULT_UNIFORMS))
        setHomeShowcase(getSec('home-showcase', DEFAULT_HOME_SHOWCASE))
        setFragrance(getSec('fragrance-showcase', DEFAULT_FRAGRANCE))
        setExpansion(getSec('strategic-expansion', DEFAULT_EXPANSION))
        setDubaiPipeline(getSec('dubai-pipeline', DEFAULT_DUBAI_PIPELINE))
        setNewsletter(getSec('newsletter', DEFAULT_NEWSLETTER))
        setAboutPage(getSec('about-page', DEFAULT_ABOUT))
      } catch (err) {
        console.error('Failed to load content from Supabase', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const themeText = isDark ? 'text-white' : 'text-gray-900'
  const themeTextSub = isDark ? 'text-white/50' : 'text-gray-500'
  const themeTextMuted = isDark ? 'text-white/30' : 'text-gray-400'
  const themeBorder = isDark ? 'border-white/10' : 'border-gray-200'
  const themeBgCard = isDark ? 'bg-[#0C0C0C]' : 'bg-white'
  const themeBgSidebar = isDark ? 'bg-white/5' : 'bg-white shadow-sm'

  const tabClass = (tab: ActiveSection) => `
    flex items-center gap-3 w-full px-4 py-3.5 text-xs font-mono font-semibold uppercase tracking-wider text-left border-l-2 transition-all rounded-none
    ${activeTab === tab 
      ? 'bg-gold/10 text-gold border-gold font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]' 
      : isDark
        ? 'text-white/60 border-transparent hover:bg-white/5 hover:text-white'
        : 'text-gray-600 border-transparent hover:bg-gray-100 hover:text-gray-900'
    }
  `

  return (
    <div className={`space-y-8 max-w-[1600px] mx-auto font-mono ${themeText}`}>
      {/* Title Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 font-sans ${themeBorder}`}>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-bold tracking-tight uppercase">Website Sections Editor</h1>
            <span className="bg-gold/10 border border-gold/30 px-3 py-0.5 font-mono text-xs font-bold text-gold rounded-none">
              Live Contents
            </span>
          </div>
          <p className={`mt-1 font-mono text-xs ${themeTextSub}`}>
            Control the typography, images, layouts, and toggles across all home sections in real-time
          </p>
        </div>
      </div>

      {/* Main Sections Grid layout */}
      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Left column sidebar for sections */}
        <div className={`lg:col-span-3 border p-3 space-y-1 rounded-none ${themeBorder} ${themeBgSidebar}`}>
          <span className={`px-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] block mb-2 ${themeTextMuted}`}>
            Section Nav Matrix
          </span>
          <button onClick={() => setActiveTab('hero')} className={tabClass('hero')}>
            <Layout className="h-4 w-4 shrink-0" />
            <span>1. Hero Section</span>
          </button>
          <button onClick={() => setActiveTab('who')} className={tabClass('who')}>
            <Users className="h-4 w-4 shrink-0" />
            <span>2. About Section</span>
          </button>
          <button onClick={() => setActiveTab('garment')} className={tabClass('garment')}>
            <Layers className="h-4 w-4 shrink-0" />
            <span>3. Garments Categories</span>
          </button>
          <button onClick={() => setActiveTab('uniforms')} className={tabClass('uniforms')}>
            <Layers className="h-4 w-4 shrink-0" />
            <span>3.5 Uniforms Showcase</span>
          </button>
          <button onClick={() => setActiveTab('hospitality')} className={tabClass('hospitality')}>
            <Layers className="h-4 w-4 shrink-0" />
            <span>4. Hospitality Showcase</span>
          </button>
          <button onClick={() => setActiveTab('household')} className={tabClass('household')}>
            <Layers className="h-4 w-4 shrink-0" />
            <span>5. Household Showcase</span>
          </button>
          <button onClick={() => setActiveTab('homeShowcase')} className={tabClass('homeShowcase')}>
            <Layers className="h-4 w-4 shrink-0" />
            <span>5.2 Home Showcase</span>
          </button>
          <button onClick={() => setActiveTab('fragrance')} className={tabClass('fragrance')}>
            <Layers className="h-4 w-4 shrink-0" />
            <span>5.5 Fragrance Showcase</span>
          </button>
          <button onClick={() => setActiveTab('bulk')} className={tabClass('bulk')}>
            <Sliders className="h-4 w-4 shrink-0" />
            <span>6. Bulk Offer Banner</span>
          </button>
          <button onClick={() => setActiveTab('global')} className={tabClass('global')}>
            <Settings className="h-4 w-4 shrink-0" />
            <span>7. Contact & General</span>
          </button>
          <button onClick={() => setActiveTab('expansion')} className={tabClass('expansion')}>
            <TrendingUp className="h-4 w-4 shrink-0" />
            <span>8. Future Expansion</span>
          </button>
          <button onClick={() => setActiveTab('pipeline')} className={tabClass('pipeline')}>
            <FileText className="h-4 w-4 shrink-0" />
            <span>9. Dubai Pipeline</span>
          </button>
          <button onClick={() => setActiveTab('newsletter')} className={tabClass('newsletter')}>
            <Mail className="h-4 w-4 shrink-0" />
            <span>10. Newsletter Strip</span>
          </button>
          <button onClick={() => setActiveTab('aboutPage')} className={tabClass('aboutPage')}>
            <Info className="h-4 w-4 shrink-0" />
            <span>11. About Page Content</span>
          </button>
        </div>

        {/* Right column form panels */}
        <div className={`lg:col-span-9 border p-6 lg:p-8 rounded-none shadow-xl space-y-6 ${themeBorder} ${themeBgCard}`}>
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <span className="text-sm font-mono text-gold animate-pulse">Initializing Data Streams...</span>
            </div>
          ) : (
            <>
              {activeTab === 'global' && siteConfig && <GlobalConfigEditor initialData={siteConfig} />}
              {activeTab === 'bulk' && bulkOffer && <BulkOfferEditor initialData={bulkOffer} />}
              {activeTab === 'hero' && hero && <HeroEditor initialData={hero} />}
              {activeTab === 'who' && whoWeAre && <WhoWeAreEditor initialData={whoWeAre} />}
              
              {activeTab === 'garment' && garments && (
                <ShowcaseEditor 
                  initialData={garments} 
                  sectionId="garments-showcase"
                  title="5. Garment Manufacturing Showcase"
                  subtitle="Configure active garment categories, descriptions, styles, and card cover images"
                  matrixTitle="Garment Categories Matrix (6 Symmetrical Cards)"
                />
              )}
              {activeTab === 'uniforms' && uniforms && (
                <ShowcaseEditor 
                  initialData={uniforms} 
                  sectionId="uniforms-showcase"
                  title="5.2 Uniforms Manufacturing Showcase"
                  subtitle="Configure active uniforms categories, descriptions, and card images"
                  matrixTitle="Uniforms Categories Matrix (6 Symmetrical Cards)"
                />
              )}
              {activeTab === 'hospitality' && hospitality && (
                <ShowcaseEditor 
                  initialData={hospitality} 
                  sectionId="hospitality-showcase-v2"
                  title="6.5 Hospitality Manufacturing Showcase"
                  subtitle="Configure active hospitality items, description parameters, MOQ values, and card images"
                  matrixTitle="Hospitality Categories Matrix (5 Portrait Cards)"
                />
              )}
              {activeTab === 'household' && households && (
                <ShowcaseEditor 
                  initialData={households} 
                  sectionId="households-showcase-v2"
                  title="6. Household Manufacturing Showcase"
                  subtitle="Configure active household items, description parameters, MOQ values, and card images"
                  matrixTitle="Household Categories Matrix (4 Cinematic Cards)"
                />
              )}
              {activeTab === 'homeShowcase' && homeShowcase && (
                <ShowcaseEditor 
                  initialData={homeShowcase} 
                  sectionId="home-showcase"
                  title="6.2 Home Furnishings Showcase"
                  subtitle="Configure active home furnishing items, descriptions, and card images"
                  matrixTitle="Home Furnishing Categories Matrix (4 Cinematic Cards)"
                />
              )}
              {activeTab === 'fragrance' && fragrance && (
                <ShowcaseEditor 
                  initialData={fragrance} 
                  sectionId="fragrance-showcase"
                  title="6.8 Fragrance Showcase"
                  subtitle="Configure active fragrance items, descriptions, and card images"
                  matrixTitle="Fragrance Categories Matrix (5 Portrait Cards)"
                />
              )}

              {activeTab === 'expansion' && expansion && <ExpansionEditor initialData={expansion} />}
              {activeTab === 'pipeline' && dubaiPipeline && <DubaiPipelineEditor initialData={dubaiPipeline} />}
              {activeTab === 'newsletter' && newsletter && <NewsletterEditor initialData={newsletter} />}
              {activeTab === 'aboutPage' && aboutPage && <AboutPageEditor initialData={aboutPage} />}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
