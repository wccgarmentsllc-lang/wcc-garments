import { MOCK_PRODUCTS, MOCK_BRANDS } from './constants'
import { Brand, Product } from '@/types'

// Keys for local storage persistence
const BRANDS_STORAGE_KEY = 'wcc-garments-brands'
const PRODUCTS_STORAGE_KEY = 'wcc-garments-products'

// Helper to check if running in client/browser environment
const isClient = () => typeof window !== 'undefined'

export const brandStore = {
  // ── Brands CRUD ─────────────────────────────────────────────────────────────
  getBrands(): Brand[] {
    if (!isClient()) return MOCK_BRANDS as Brand[]
    
    try {
      const stored = localStorage.getItem(BRANDS_STORAGE_KEY)
      if (!stored) {
        // Initialize storage if empty
        localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(MOCK_BRANDS))
        return MOCK_BRANDS as Brand[]
      }
      return JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse stored brands:', e)
      return MOCK_BRANDS as Brand[]
    }
  },

  getBrandBySlug(slug: string): Brand | undefined {
    const brands = this.getBrands()
    return brands.find(b => b.slug === slug)
  },

  saveBrand(brand: Omit<Brand, 'id' | 'created_at'> & { id?: string }): Brand {
    if (!isClient()) {
      throw new Error('Persistence operations only supported on the client-side')
    }

    const brands = this.getBrands()
    const now = new Date().toISOString()
    
    let savedBrand: Brand
    if (brand.id) {
      // Update
      const index = brands.findIndex(b => b.id === brand.id)
      savedBrand = {
        ...brands[index],
        ...brand,
        created_at: brands[index]?.created_at || now
      } as Brand
      if (index !== -1) brands[index] = savedBrand
    } else {
      // Create
      savedBrand = {
        ...brand,
        id: `brand-${crypto.randomUUID()}`,
        created_at: now
      } as Brand
      brands.push(savedBrand)
    }

    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(brands))
    return savedBrand
  },

  deleteBrand(id: string): void {
    if (!isClient()) return
    const brands = this.getBrands()
    const filtered = brands.filter(b => b.id !== id)
    localStorage.setItem(BRANDS_STORAGE_KEY, JSON.stringify(filtered))
  },

  // ── Products CRUD & Filtering ───────────────────────────────────────────────
  getProducts(): Product[] {
    // Cast products to include optional brand_slug
    const baseProducts = MOCK_PRODUCTS.map(p => ({
      ...p,
      division: { id: p.id, name: p.division, slug: p.division_slug, accent_color: '#DAA520' },
      category: { id: p.id, name: p.category, slug: p.category.toLowerCase().replace(/\s+/g, '-') },
      categories: ((p as any).categories || (p.category ? [p.category] : [])).map((c: any) => ({ id: p.id, name: c, slug: c.toLowerCase().replace(/\s+/g, '-') }))
    })) as unknown as Product[]

    if (!isClient()) return baseProducts
    
    try {
      const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY)
      const customProducts: Product[] = stored ? JSON.parse(stored) : []
      
      // Filter out any default products that might have been marked deleted
      const deletedKey = 'wcc-garments-deleted-products'
      const deletedIds: string[] = JSON.parse(localStorage.getItem(deletedKey) || '[]')
      const filteredBase = baseProducts.filter(p => !deletedIds.includes(p.id))

      return [...filteredBase, ...customProducts]
    } catch (e) {
      console.error('Failed to parse products:', e)
      return baseProducts
    }
  },

  saveProduct(product: Partial<Product> & { name: string; division_id: string }): Product {
    if (!isClient()) {
      throw new Error('Persistence operations only supported on the client-side')
    }

    const customProductsStored = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    const customProducts: Product[] = customProductsStored ? JSON.parse(customProductsStored) : []
    const now = new Date().toISOString()

    let savedProduct: Product
    
    if (product.id) {
      // Find and update inside custom products
      const idx = customProducts.findIndex(p => p.id === product.id)
      if (idx !== -1) {
        savedProduct = {
          ...customProducts[idx],
          ...product,
          updated_at: now
        } as Product
        customProducts[idx] = savedProduct
      } else {
        // Checking if it updates a mock product
        savedProduct = {
          ...product,
          updated_at: now,
          created_at: now
        } as Product
        customProducts.push(savedProduct)
      }
    } else {
      // Create new
      savedProduct = {
        ...product,
        id: `prod-${crypto.randomUUID()}`,
        created_at: now,
        updated_at: now,
        slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        images: product.images || ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'],
        tags: product.tags || [],
        specifications: product.specifications || {},
        moq: product.moq || '500 Units',
        lead_time: product.lead_time || '15-20 Days',
        suitable_for: product.suitable_for || ['Corporate', 'Retail'],
        division: { id: 'Garments', name: 'Garments', slug: 'garments', accent_color: '#DAA520' },
        category: { id: product.category_id || 'formal', name: product.category_id || 'Formal Shirts', slug: (product.category_id || 'formal').toLowerCase().replace(/\s+/g, '-') },
        categories: (product.category_ids || (product.category_id ? [product.category_id] : ['Formal Shirts'])).map(c => ({ id: c, name: c, slug: c.toLowerCase().replace(/\s+/g, '-') }))
      } as unknown as Product
      customProducts.push(savedProduct)
    }

    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(customProducts))
    return savedProduct
  },

  deleteProduct(id: string): void {
    if (!isClient()) return
    
    // If it's a custom product, filter out from custom list
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY)
    if (stored) {
      const customProducts: Product[] = JSON.parse(stored)
      const filtered = customProducts.filter(p => p.id !== id)
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered))
    }

    // If it's a default mock product, store in deleted IDs index
    const deletedKey = 'wcc-garments-deleted-products'
    const deletedIds: string[] = JSON.parse(localStorage.getItem(deletedKey) || '[]')
    if (!deletedIds.includes(id)) {
      deletedIds.push(id)
      localStorage.setItem(deletedKey, JSON.stringify(deletedIds))
    }
  }
}
