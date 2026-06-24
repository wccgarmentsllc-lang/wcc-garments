import React from 'react'
import Image from 'next/image'
import { normalizeImage, ResponsiveImage } from '@/lib/image-utils'

interface ResponsivePictureProps {
  src: string | ResponsiveImage | null | undefined
  alt: string
  fill?: boolean
  className?: string
  sizes?: string
  priority?: boolean
  unoptimized?: boolean
}

/**
 * Renders a <picture> element with a <source> for mobile (max-width: 768px)
 * and a fallback Next.js <Image> for desktop.
 * If both desktop and mobile URLs are the same (or only one is provided),
 * renders a plain <Image> for simplicity.
 */
export function ResponsivePicture({
  src,
  alt,
  fill,
  className,
  sizes,
  priority,
  unoptimized,
}: ResponsivePictureProps) {
  const img = normalizeImage(src)

  const desktopSrc = img.desktop
  const mobileSrc = img.mobile

  // If no source at all, render nothing
  if (!desktopSrc && !mobileSrc) return null

  // If both are the same (or only one exists), just use Next Image directly
  if (!mobileSrc || mobileSrc === desktopSrc) {
    return (
      <Image
        src={desktopSrc || mobileSrc}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
      />
    )
  }

  // Different desktop and mobile images — use <picture>
  // We use unoptimized Next/Image as the <img> fallback inside <picture>
  return (
    <picture className={fill ? 'absolute inset-0 w-full h-full' : undefined}>
      {/* Mobile source */}
      <source media="(max-width: 768px)" srcSet={desktopSrc} />
      {/* Desktop source (default) */}
      <Image
        src={mobileSrc}
        alt={alt}
        fill={fill}
        className={className}
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
      />
    </picture>
  )
}
