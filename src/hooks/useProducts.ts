'use client'

import { useState, useEffect, useCallback } from 'react'
import { MOCK_PRODUCTS } from '@/lib/constants'
import type { Product } from '@/types'

interface UseProductsOptions {
  division?: string
  category?: string
  featured?: boolean
  is_new?: boolean
  is_offer?: boolean
  limit?: number
  search?: string
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (options.division) params.set('division', options.division)
      if (options.category) params.set('category', options.category)
      if (options.featured) params.set('featured', 'true')
      if (options.is_new) params.set('is_new', 'true')
      if (options.is_offer) params.set('is_offer', 'true')
      if (options.limit) params.set('limit', String(options.limit))
      if (options.search) params.set('search', options.search)

      const qs = params.toString()
      const res = await fetch(`/api/products${qs ? `?${qs}` : ''}`)
      const json = await res.json()

      if (json.success) {
        setProducts(json.data || [])
        setTotal(json.total || 0)
      } else {
        throw new Error(json.error || 'Failed to fetch products')
      }
    } catch (err: any) {
      console.error('useProducts error:', err)
      setProducts([])
      setTotal(0)
      setError(err.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [options.division, options.category, options.featured, options.is_new, options.is_offer, options.limit, options.search])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, total, refetch: fetchProducts }
}
