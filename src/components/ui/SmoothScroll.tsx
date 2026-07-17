'use client'

import { useEffect, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Auto scroll to top on page navigation using native browser behavior
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return <>{children}</>
}
