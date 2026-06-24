'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react'
import { ResponsiveImage, normalizeImage } from '@/lib/image-utils'
import { useThemeContext } from '@/context/ThemeContext'
import { api } from '@/lib/api'

interface Props {
  label: string
  value: string | ResponsiveImage | null | undefined
  onChange: (value: ResponsiveImage) => void
  aspectRatioHint?: string
}

export function ResponsiveImageUploader({ label, value, onChange, aspectRatioHint }: Props) {
  const { isDark } = useThemeContext()
  const img = normalizeImage(value)
  const [uploading, setUploading] = useState<{ desktop: boolean; mobile: boolean }>({ desktop: false, mobile: false })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(prev => ({ ...prev, [type]: true }))
      try {
        const url = await api.uploadFile(file)
        onChange({ ...img, [type]: url })
      } catch (err) {
        console.error('Failed to upload image', err)
        alert('Failed to upload image. Please check if Supabase storage is configured.')
      } finally {
        setUploading(prev => ({ ...prev, [type]: false }))
      }
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    onChange({ ...img, [type]: e.target.value })
  }

  const themeText = isDark ? 'text-white' : 'text-gray-900'
  const themeTextSub = isDark ? 'text-white/50' : 'text-gray-500'
  const themeBorder = isDark ? 'border-white/10' : 'border-gray-200'
  const inputClass = `w-full rounded-none border px-3 py-2 text-xs transition-all focus:border-gold focus:outline-none ${
    isDark ? 'border-white/10 bg-black/60 text-white placeholder-white/20' : 'border-gray-200 bg-white text-gray-900 placeholder-gray-400'
  }`

  return (
    <div className={`border p-4 rounded-none space-y-4 ${themeBorder} ${isDark ? 'bg-black/20' : 'bg-gray-50/50'}`}>
      <div>
        <label className={`block text-xs font-bold uppercase tracking-wider font-mono ${themeText}`}>
          {label}
        </label>
        {aspectRatioHint && (
          <p className={`text-[10px] mt-1 font-mono ${themeTextSub}`}>
            {aspectRatioHint}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Desktop View */}
        <div className="space-y-3">
          <span className={`text-[10px] font-bold uppercase ${themeTextSub}`}>Desktop Layout Image</span>
          <div className={`relative aspect-video w-full bg-black overflow-hidden border ${themeBorder}`}>
            {img.desktop && <Image src={img.desktop} alt="Desktop" fill className="object-cover" />}
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or paste URL..."
                value={img.desktop?.startsWith('data:') ? '' : img.desktop}
                onChange={(e) => handleUrlChange(e, 'desktop')}
                className={inputClass}
              />
            </div>
            <div>
              <label className="flex items-center justify-center gap-1.5 py-2 w-full font-mono text-[10px] font-bold cursor-pointer border transition-colors hover:border-gold rounded-none">
                {uploading.desktop ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                <span>{uploading.desktop ? 'Uploading...' : 'Upload from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'desktop')}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="space-y-3">
          <span className={`text-[10px] font-bold uppercase ${themeTextSub}`}>Mobile Layout Image</span>
          <div className={`relative aspect-[3/4] w-2/3 mx-auto bg-black overflow-hidden border ${themeBorder}`}>
            {img.mobile && <Image src={img.mobile} alt="Mobile" fill className="object-cover" />}
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Or paste URL..."
                value={img.mobile?.startsWith('data:') ? '' : img.mobile}
                onChange={(e) => handleUrlChange(e, 'mobile')}
                className={inputClass}
              />
            </div>
            <div>
              <label className="flex items-center justify-center gap-1.5 py-2 w-full font-mono text-[10px] font-bold cursor-pointer border transition-colors hover:border-gold rounded-none">
                {uploading.mobile ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                <span>{uploading.mobile ? 'Uploading...' : 'Upload from Device'}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'mobile')}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
