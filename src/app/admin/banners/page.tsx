'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminBannersPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/admin/sections')
  }, [router])

  return (
    <div className="flex items-center justify-center p-12 font-mono text-xs text-gold animate-pulse">
      Redirecting to Website Content...
    </div>
  )
}
