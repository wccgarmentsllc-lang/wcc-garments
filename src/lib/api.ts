const BASE = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_SITE_URL || '')

async function fetcher<T = any>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options?.headers as Record<string, string>,
  }

  // Remove manual Authorization header injection, browser sends HttpOnly cookie automatically.
  if (headers['Authorization']) {
    delete headers['Authorization']
  }
  if (headers['authorization']) {
    delete headers['authorization']
  }

  const response = await fetch(`${BASE}${url}`, {
    ...options,
    cache: 'no-store',       // Never cache API responses — always get fresh data
    credentials: 'same-origin',
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'API request failed' }))
    throw new Error(error.message || 'API request failed')
  }

  return response.json()
}

export const api = {
  uploadFile: async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.error || 'Upload failed')
    return data.url as string
  },

  deleteFile: async (url: string) => {
    const res = await fetch(`/api/admin/upload?url=${encodeURIComponent(url)}`, {
      method: 'DELETE',
    })
    const data = await res.json()
    if (!data.success) throw new Error(data.error || 'Deletion failed')
    return data
  },

  getDivisions: () =>
    fetcher('/api/divisions'),

  getProducts: (params?: {
    division?: string
    category?: string
    featured?: boolean
    is_new?: boolean
    is_offer?: boolean
    limit?: number
    offset?: number
    search?: string
  }) => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          searchParams.set(k, String(v))
        }
      })
    }
    const qs = searchParams.toString()
    return fetcher(`/api/products${qs ? `?${qs}` : ''}`)
  },

  getProduct: (slug: string) =>
    fetcher(`/api/products/${slug}`),

  getCategories: (divisionSlug?: string) => {
    const url = divisionSlug
      ? `/api/categories?division=${divisionSlug}`
      : '/api/categories'
    return fetcher(url)
  },

  getMedia: (type?: string) => {
    const url = type ? `/api/media?type=${type}` : '/api/media'
    return fetcher(url)
  },

  submitEnquiry: (data: Record<string, unknown>) =>
    fetcher('/api/enquiry', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  submitCatalogueRequest: (data: Record<string, unknown>) =>
    fetcher('/api/catalogue-request', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  admin: {
    login: (credentials: { email: string; password: string }) =>
      fetcher('/api/admin/auth', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    getProducts: (token: string) =>
      fetcher('/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` },
      }),

    createProduct: (token: string, data: Record<string, unknown>) =>
      fetcher('/api/admin/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }),

    updateProduct: (token: string, id: string, data: Record<string, unknown>) =>
      fetcher(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }),

    deleteProduct: (token: string, id: string) =>
      fetcher(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }),

    getEnquiries: (token: string) =>
      fetcher('/api/admin/enquiries', {
        headers: { Authorization: `Bearer ${token}` },
      }),

    updateEnquiry: (token: string, id: string, data: Record<string, unknown>) =>
      fetcher(`/api/admin/enquiries/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }),

    getMedia: (token: string) =>
      fetcher('/api/admin/media', {
        headers: { Authorization: `Bearer ${token}` },
      }),

    createMedia: (token: string, data: Record<string, unknown>) =>
      fetcher('/api/admin/media', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }),
      
    deleteMedia: (token: string, id: string) =>
      fetcher(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }),

    getBroadcasts: (token: string) =>
      fetcher('/api/admin/broadcast', {
        headers: { Authorization: `Bearer ${token}` },
      }),
      
    broadcast: (token: string, data: Record<string, unknown>) =>
      fetcher('/api/admin/newsletter/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }),

    getDashboard: (token?: string) =>
      fetcher('/api/admin/dashboard', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),

    getCategories: (token?: string) =>
      fetcher('/api/admin/categories', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),
    createCategory: (token: string | undefined, data: Record<string, unknown>) =>
      fetcher('/api/admin/categories', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify(data),
      }),
    updateCategory: (token: string | undefined, id: string, data: Record<string, unknown>) =>
      fetcher(`/api/admin/categories/${id}`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify(data),
      }),
    deleteCategory: (token: string | undefined, id: string) =>
      fetcher(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),

    getBrands: (token?: string) =>
      fetcher('/api/admin/brands', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),
    createBrand: (token: string | undefined, data: Record<string, unknown>) =>
      fetcher('/api/admin/brands', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify(data),
      }),
    updateBrand: (token: string | undefined, id: string, data: Record<string, unknown>) =>
      fetcher(`/api/admin/brands/${id}`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify(data),
      }),
    deleteBrand: (token: string | undefined, id: string) =>
      fetcher(`/api/admin/brands/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),

    getNewsletterSubscribers: (token?: string) =>
      fetcher('/api/admin/newsletter', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),
    deleteNewsletterSubscriber: (token: string | undefined, id: string) =>
      fetcher(`/api/admin/newsletter?id=${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),

    getContent: (token: string | undefined, id?: string) =>
      fetcher(`/api/admin/content${id ? `?id=${id}` : ''}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),
    updateContent: (token: string | undefined, id: string, data: Record<string, unknown>) =>
      fetcher(`/api/admin/content?id=${id}`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify(data),
      }),

    getCatalogueRequests: (token?: string) =>
      fetcher('/api/admin/catalogue-requests', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }),

    updateCatalogueRequest: (token: string | undefined, id: string, data: Record<string, unknown>) =>
      fetcher('/api/admin/catalogue-requests', {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify({ id, ...data }),
      }),
  },
}
