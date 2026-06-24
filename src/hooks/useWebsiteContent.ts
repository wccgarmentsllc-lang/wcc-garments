'use client'

import { useEffect, useState } from 'react'
import { api } from '@/lib/api'

type ContentMap = Record<string, any>

/**
 * Fetches all website_content rows from Supabase and returns a lookup map
 * keyed by section_id. Falls back to `defaults` if the API call fails.
 */
export function useWebsiteContent(
  sectionId: string,
  defaultValue: any
): { data: any; loading: boolean } {
  const [data, setData] = useState(defaultValue)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.admin
      .getContent(undefined, sectionId)
      .then((res) => {
        if (res?.data) {
          setData(res.data)
        }
      })
      .catch(() => {
        // Silently fall back to defaults — no admin token needed for public reads
      })
      .finally(() => setLoading(false))
  }, [sectionId])

  return { data, loading }
}
