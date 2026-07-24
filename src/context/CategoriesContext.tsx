'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface DivisionItem {
  id?: string
  slug: string
  name: string
  description?: string
  status?: string
  image?: string
  stat1Label?: string
  stat1Value?: string
  stat2Label?: string
  stat2Value?: string
  stat3Label?: string
  stat3Value?: string
  heroHeading?: string
  heroSubtitle?: string
  [key: string]: any
}

interface CategoriesContextType {
  divisions: DivisionItem[]
  loading: boolean
  error: string | null
  refreshDivisions: () => Promise<void>
}

const CategoriesContext = createContext<CategoriesContextType>({
  divisions: [],
  loading: true,
  error: null,
  refreshDivisions: async () => {},
})

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [divisions, setDivisions] = useState<DivisionItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDivisions = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/categories?divisions=true', { cache: 'no-store' })
      const data = await res.json()

      if (data.success && Array.isArray(data.data)) {
        const mapped: DivisionItem[] = data.data.map((d: any) => ({
          ...d,
          stat1Label: d.stat1_label || d.stat1Label,
          stat1Value: d.stat1_value || d.stat1Value,
          stat2Label: d.stat2_label || d.stat2Label,
          stat2Value: d.stat2_value || d.stat2Value,
          stat3Label: d.stat3_label || d.stat3Label,
          stat3Value: d.stat3_value || d.stat3Value,
          heroHeading: d.hero_heading || d.heroHeading,
          heroSubtitle: d.hero_subtitle || d.heroSubtitle,
        }))
        setDivisions(mapped)
        setError(null)
      }
    } catch (err: any) {
      console.error('[CategoriesContext] Failed to fetch divisions:', err)
      setError(err.message || 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDivisions()
  }, [fetchDivisions])

  return (
    <CategoriesContext.Provider
      value={{
        divisions,
        loading,
        error,
        refreshDivisions: fetchDivisions,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategoriesContext() {
  return useContext(CategoriesContext)
}
