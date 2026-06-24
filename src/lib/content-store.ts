import { SITE_CONFIG, DIVISIONS } from './constants'

// Helper to check if running in client/browser environment
const isClient = () => typeof window !== 'undefined'

export const contentStore = {
  // Generic Section Data Getter & Setter
  getSectionData<T>(sectionKey: string, defaultValue: T): T {
    if (!isClient()) return defaultValue

    try {
      const stored = localStorage.getItem(`wcc-content-${sectionKey}`)
      if (!stored) {
        // Initialize storage on client
        localStorage.setItem(`wcc-content-${sectionKey}`, JSON.stringify(defaultValue))
        return defaultValue
      }
      return JSON.parse(stored) as T
    } catch (e) {
      console.error(`Failed to parse content for ${sectionKey}:`, e)
      return defaultValue
    }
  },

  saveSectionData<T>(sectionKey: string, data: T): void {
    if (!isClient()) return
    try {
      localStorage.setItem(`wcc-content-${sectionKey}`, JSON.stringify(data))
    } catch (e) {
      console.error(`Failed to save content for ${sectionKey}:`, e)
    }
  },

  // ── SITE CONFIGURATION ──────────────────────────────────────────────────────
  getSiteConfig() {
    return this.getSectionData('site_config', SITE_CONFIG)
  },

  saveSiteConfig(data: typeof SITE_CONFIG) {
    this.saveSectionData('site_config', data)
  },

  // ── DIVISIONS ───────────────────────────────────────────────────────────────
  getDivisions() {
    return this.getSectionData('divisions-v3', DIVISIONS)
  },

  saveDivisions(data: typeof DIVISIONS) {
    this.saveSectionData('divisions-v3', data)
  }
}
