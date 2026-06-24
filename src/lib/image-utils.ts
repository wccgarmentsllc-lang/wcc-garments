/**
 * Shared image utility types and helpers for responsive desktop/mobile images.
 * Used by both admin editors and frontend display components.
 */

export type ResponsiveImage = {
  desktop: string
  mobile: string
}

/**
 * Normalizes any image value (legacy string or new ResponsiveImage object)
 * into a consistent { desktop, mobile } shape.
 */
export const normalizeImage = (
  img: string | ResponsiveImage | undefined | null
): ResponsiveImage => {
  if (!img) return { desktop: '', mobile: '' }
  if (typeof img === 'string') return { desktop: img, mobile: img }
  return {
    desktop: img.desktop || img.mobile || '',
    mobile: img.mobile || img.desktop || '',
  }
}

/**
 * Resolves a (potentially responsive) image to a single usable src string.
 * Picks mobile variant when `preferMobile` is true.
 */
export const resolveImageSrc = (
  img: string | ResponsiveImage | undefined | null,
  preferMobile = false
): string => {
  const normalized = normalizeImage(img)
  return preferMobile
    ? normalized.mobile || normalized.desktop
    : normalized.desktop || normalized.mobile
}
