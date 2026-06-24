'use client'

import { useState } from 'react'
import { Info, Save, Loader2, CheckCircle2, Layout, Target, MapPin, Milestone, Image as ImageIcon } from 'lucide-react'
import { api } from '@/lib/api'
import { useThemeContext } from '@/context/ThemeContext'
import { ResponsiveImageUploader } from '@/components/admin/ResponsiveImageUploader'
import type { AboutPageContent } from '../types'

interface Props {
  initialData: AboutPageContent;
}

type TabType = 'hero' | 'mission' | 'footprint' | 'timeline' | 'gallery'

export function AboutPageEditor({ initialData }: Props) {
  const [about, setAbout] = useState<AboutPageContent>(initialData)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [activeSubTab, setActiveSubTab] = useState<TabType>('hero')
  const { isDark } = useThemeContext()

  const themeText = isDark ? 'text-white' : 'text-gray-900'
  const themeTextSub = isDark ? 'text-white/50' : 'text-gray-500'
  const themeBorder = isDark ? 'border-white/10' : 'border-gray-200'
  const themeBorderSub = isDark ? 'border-white/5' : 'border-gray-100'
  const themeBgCard = isDark ? 'bg-black/40' : 'bg-gray-50'

  const inputClass = `w-full rounded-xl border px-4 py-3 text-xs transition-all font-mono focus:border-gold focus:outline-none ${
    isDark 
      ? 'border-white/10 bg-black/60 text-white placeholder-white/20 focus:bg-black' 
      : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:bg-gray-50'
  }`
  const labelClass = `mb-1.5 block text-[10px] font-bold uppercase tracking-wider font-mono ${
    isDark ? 'text-white/50' : 'text-gray-500'
  }`

  const tabClass = (tab: TabType) => `
    flex items-center gap-2 px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2
    ${activeSubTab === tab 
      ? 'border-gold text-gold bg-gold/5' 
      : 'border-transparent text-gray-500 hover:text-gold hover:bg-gold/5'
    }
  `

  const handleSave = async () => {
    setSaving(true)
    setSuccess(false)
    try {
      const token = localStorage.getItem('wcc-admin-token') || ''
      await api.admin.updateContent(token, 'about-page', about as any)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to save to Supabase', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className={`border-b pb-4 flex justify-between items-center ${themeBorder}`}>
        <div>
          <h3 className={`text-lg font-bold uppercase flex items-center gap-2 ${themeText}`}>
            <Info className="h-5 w-5 text-gold" />
            <span>About Page Content Editor</span>
          </h3>
          <p className={`text-xs mt-1 ${themeTextSub}`}>Customize the complete /about page content including the hero header, stats, journey timeline, locations, and photo gallery.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2.5 rounded-none bg-gold px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-gold-light shadow-md disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : (success ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />)}
          <span>{saving ? 'Saving...' : (success ? 'Saved' : 'Save')}</span>
        </button>
      </div>

      {/* Sub tabs */}
      <div className={`flex flex-wrap border-b ${themeBorder}`}>
        <button onClick={() => setActiveSubTab('hero')} className={tabClass('hero')}>
          <Layout className="h-4 w-4" />
          <span>1. Hero & Stats</span>
        </button>
        <button onClick={() => setActiveSubTab('mission')} className={tabClass('mission')}>
          <Target className="h-4 w-4" />
          <span>2. Mission & Vision</span>
        </button>
        <button onClick={() => setActiveSubTab('footprint')} className={tabClass('footprint')}>
          <MapPin className="h-4 w-4" />
          <span>3. Locations</span>
        </button>
        <button onClick={() => setActiveSubTab('timeline')} className={tabClass('timeline')}>
          <Milestone className="h-4 w-4" />
          <span>4. Timeline</span>
        </button>
        <button onClick={() => setActiveSubTab('gallery')} className={tabClass('gallery')}>
          <ImageIcon className="h-4 w-4" />
          <span>5. Core Values & Gallery</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'hero' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Hero Since Tagline</label>
              <input
                type="text"
                value={about.heroSince}
                onChange={e => setAbout({ ...about, heroSince: e.target.value })}
                className={inputClass}
                placeholder="Since 2001"
              />
            </div>
            <div>
              <label className={labelClass}>Hero Heading (White Text Part)</label>
              <input
                type="text"
                value={about.heroHeadingStart}
                onChange={e => setAbout({ ...about, heroHeadingStart: e.target.value })}
                className={inputClass}
                placeholder="25+ Years of"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Hero Heading Highlight (Gold Text Part)</label>
              <input
                type="text"
                value={about.heroHeadingHighlight}
                onChange={e => setAbout({ ...about, heroHeadingHighlight: e.target.value })}
                className={inputClass}
                placeholder="Manufacturing Excellence"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Hero Description Paragraph</label>
            <textarea
              rows={4}
              value={about.heroDescription}
              onChange={e => setAbout({ ...about, heroDescription: e.target.value })}
              className={inputClass}
              placeholder="Founded in Bangalore in 2001..."
            />
          </div>

          <div>
            <ResponsiveImageUploader
              label="Hero Background Image"
              value={about.heroImage}
              onChange={val => setAbout({ ...about, heroImage: val.desktop || val.mobile || '' })}
              aspectRatioHint="Suggested: 16:9 panoramic (e.g. factory hero background)"
            />
          </div>

          <div className={`pt-4 border-t ${themeBorderSub}`}>
            <span className={labelClass}>Stats Matrix (4 columns bar)</span>
            <div className="grid gap-4 sm:grid-cols-4">
              {about.stats?.map((stat, sIdx) => (
                <div key={sIdx} className={`border p-4 space-y-3 rounded-xl ${themeBorder} ${themeBgCard}`}>
                  <span className="text-[9px] font-mono font-bold text-gold uppercase block">Stat Slot 0{sIdx + 1}</span>
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Stat Value</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={e => {
                        const updated = [...about.stats]
                        updated[sIdx].value = e.target.value
                        setAbout({ ...about, stats: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Stat Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={e => {
                        const updated = [...about.stats]
                        updated[sIdx].label = e.target.value
                        setAbout({ ...about, stats: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'mission' && (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className={`border p-5 rounded-xl space-y-4 ${themeBorder} ${themeBgCard}`}>
              <span className="text-sm font-bold text-gold uppercase font-mono block">Our Mission</span>
              <div>
                <label className={labelClass}>Mission Section Title</label>
                <input
                  type="text"
                  value={about.missionTitle}
                  onChange={e => setAbout({ ...about, missionTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Mission Description</label>
                <textarea
                  rows={6}
                  value={about.missionDesc}
                  onChange={e => setAbout({ ...about, missionDesc: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className={`border p-5 rounded-xl space-y-4 ${themeBorder} ${themeBgCard}`}>
              <span className="text-sm font-bold text-gold uppercase font-mono block">Our Vision</span>
              <div>
                <label className={labelClass}>Vision Section Title</label>
                <input
                  type="text"
                  value={about.visionTitle}
                  onChange={e => setAbout({ ...about, visionTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Vision Description</label>
                <textarea
                  rows={6}
                  value={about.visionDesc}
                  onChange={e => setAbout({ ...about, visionDesc: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={`border p-5 rounded-xl space-y-4 ${themeBorder} ${themeBgCard}`}>
            <span className="text-sm font-bold text-gold uppercase font-mono block">Our Journey Description</span>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Journey Heading Title</label>
                <input
                  type="text"
                  value={about.journeyTitle}
                  onChange={e => setAbout({ ...about, journeyTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Journey Description Intro Text</label>
                <textarea
                  rows={3}
                  value={about.journeyDesc}
                  onChange={e => setAbout({ ...about, journeyDesc: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'footprint' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Footprint Title</label>
              <input
                type="text"
                value={about.footprintTitle}
                onChange={e => setAbout({ ...about, footprintTitle: e.target.value })}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Footprint Subtitle Description</label>
              <textarea
                rows={2}
                value={about.footprintDesc}
                onChange={e => setAbout({ ...about, footprintDesc: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className={`pt-4 border-t ${themeBorderSub}`}>
            <span className={labelClass}>Global Sourcing & Production Locations</span>
            <div className="grid gap-6 sm:grid-cols-2">
              {about.locations?.map((loc, lIdx) => (
                <div key={lIdx} className={`border p-5 rounded-xl space-y-3 ${themeBorder} ${themeBgCard}`}>
                  <span className="text-[10px] font-mono font-bold text-gold uppercase block">Location Slot 0{lIdx + 1}</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={`text-[9px] block ${themeTextSub}`}>Country</label>
                      <input
                        type="text"
                        value={loc.country}
                        onChange={e => {
                          const updated = [...about.locations]
                          updated[lIdx].country = e.target.value
                          setAbout({ ...about, locations: updated })
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={`text-[9px] block ${themeTextSub}`}>City</label>
                      <input
                        type="text"
                        value={loc.city}
                        onChange={e => {
                          const updated = [...about.locations]
                          updated[lIdx].city = e.target.value
                          setAbout({ ...about, locations: updated })
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Operational Role</label>
                    <input
                      type="text"
                      value={loc.role}
                      onChange={e => {
                        const updated = [...about.locations]
                        updated[lIdx].role = e.target.value
                        setAbout({ ...about, locations: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Detail Description</label>
                    <textarea
                      rows={2}
                      value={loc.detail}
                      onChange={e => {
                        const updated = [...about.locations]
                        updated[lIdx].detail = e.target.value
                        setAbout({ ...about, locations: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'timeline' && (
        <div className="space-y-6">
          <span className={labelClass}>Journey Timeline Nodes</span>
          <p className={`text-xs -mt-4 ${themeTextSub}`}>Manage the milestones that show on the horizontal timeline (desktop) or vertical timeline (mobile).</p>

          <div className="grid gap-4 sm:grid-cols-2">
            {about.timeline?.map((item, tIdx) => (
              <div key={tIdx} className={`border p-4 rounded-xl space-y-3 ${themeBorder} ${themeBgCard}`}>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold text-gold uppercase">Milestone Node 0{tIdx + 1}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="sm:col-span-1">
                    <label className={`text-[9px] block ${themeTextSub}`}>Year</label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={e => {
                        const updated = [...about.timeline]
                        updated[tIdx].year = e.target.value
                        setAbout({ ...about, timeline: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={`text-[9px] block ${themeTextSub}`}>Event Details</label>
                    <input
                      type="text"
                      value={item.event}
                      onChange={e => {
                        const updated = [...about.timeline]
                        updated[tIdx].event = e.target.value
                        setAbout({ ...about, timeline: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'gallery' && (
        <div className="space-y-6">
          <div className={`border p-5 rounded-xl space-y-4 ${themeBorder} ${themeBgCard}`}>
            <span className="text-sm font-bold text-gold uppercase font-mono block">Core Values Section</span>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Values Headline Title</label>
                <input
                  type="text"
                  value={about.valuesTitle}
                  onChange={e => setAbout({ ...about, valuesTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {about.values?.map((val, vIdx) => (
                <div key={vIdx} className={`border p-4 rounded-xl space-y-2.5 ${themeBorder} bg-black/10`}>
                  <span className="text-[9px] font-mono font-bold text-gold uppercase block">Value Slot 0{vIdx + 1}</span>
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Title</label>
                    <input
                      type="text"
                      value={val.title}
                      onChange={e => {
                        const updated = [...about.values]
                        updated[vIdx].title = e.target.value
                        setAbout({ ...about, values: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={`text-[9px] block ${themeTextSub}`}>Description</label>
                    <textarea
                      rows={2}
                      value={val.desc}
                      onChange={e => {
                        const updated = [...about.values]
                        updated[vIdx].desc = e.target.value
                        setAbout({ ...about, values: updated })
                      }}
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`border p-5 rounded-xl space-y-4 ${themeBorder} ${themeBgCard}`}>
            <span className="text-sm font-bold text-gold uppercase font-mono block">Warehouse & Production Gallery</span>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Gallery Title</label>
                <input
                  type="text"
                  value={about.galleryTitle}
                  onChange={e => setAbout({ ...about, galleryTitle: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Gallery Description</label>
                <textarea
                  rows={2}
                  value={about.galleryDesc}
                  onChange={e => setAbout({ ...about, galleryDesc: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              {about.gallery?.map((item, gIdx) => (
                <div key={gIdx} className={`border p-4 rounded-xl space-y-3 ${themeBorder} bg-black/10`}>
                  <span className="text-[9px] font-mono font-bold text-gold uppercase block">Gallery Item 0{gIdx + 1}</span>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className={`text-[9px] block ${themeTextSub}`}>Cover Title</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={e => {
                          const updated = [...about.gallery]
                          updated[gIdx].title = e.target.value
                          setAbout({ ...about, gallery: updated })
                        }}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={`text-[9px] block ${themeTextSub}`}>Subtitle (Process tag)</label>
                      <input
                        type="text"
                        value={item.subtitle}
                        onChange={e => {
                          const updated = [...about.gallery]
                          updated[gIdx].subtitle = e.target.value
                          setAbout({ ...about, gallery: updated })
                        }}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <ResponsiveImageUploader
                      label="Gallery Image"
                      value={item.image}
                      onChange={val => {
                        const updated = [...about.gallery]
                        updated[gIdx].image = val.desktop || val.mobile || ''
                        setAbout({ ...about, gallery: updated })
                      }}
                      aspectRatioHint="Suggested: 4:3 landscape ratio"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
