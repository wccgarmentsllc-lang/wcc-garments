'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

/**
 * Fetches website_content from Supabase and returns the data for a given section.
 * Starts with `null` so components wait for DB data before rendering,
 * preventing stale/default content flash. Falls back to `defaultValue` only if API fails.
 */
export function useWebsiteContent(
  sectionId: string,
  defaultValue: any
): { data: any; loading: boolean } {
  const [data, setData] = useState<any>(null)    // Start null — wait for DB, not defaults
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.admin
      .getContent(undefined, sectionId)
      .then((res) => {
        if (res?.data) {
          setData(res.data)
        } else {
          // API succeeded but no data found — use defaults
          setData(defaultValue)
        }
      })
      .catch(() => {
        // API failed — fall back to defaults silently
        setData(defaultValue)
      })
      .finally(() => setLoading(false))
  }, [sectionId])

  // While loading, return defaultValue so layout doesn't break with null
  return { data: data ?? defaultValue, loading }
}
