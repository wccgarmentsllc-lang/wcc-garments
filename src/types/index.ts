export interface Division {
  id: string
  name: string
  slug: string
  tagline: string | null
  description: string | null
  short_description: string | null
  hero_image: string | null
  hero_video: string | null
  thumbnail: string | null
  accent_color: string
  display_order: number
  active: boolean
  meta_title: string | null
  meta_description: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  division_id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  display_order: number
  active: boolean
  division?: Division
}

export interface Product {
  id: string
  division_id: string
  category_id?: string | null
  category_ids?: string[]
  name: string
  slug: string
  short_description: string | null
  description: string | null
  specifications: Record<string, unknown>
  moq: string | null
  lead_time: string | null
  custom_branding: boolean
  images: string[]
  video_url: string | null
  tags: string[]
  suitable_for: string[]
  featured: boolean
  is_new: boolean
  is_offer: boolean
  offer_label: string | null
  published: boolean
  view_count: number
  enquiry_count: number
  created_at: string
  updated_at: string
  division?: Division
  category?: Category
  categories?: Category[]
  brand_slug?: string | null
}

export interface Media {
  id: string
  type: 'new_arrival' | 'offer' | 'video' | 'campaign' | 'broadcast'
  title: string | null
  description: string | null
  image_url: string | null
  video_url: string | null
  thumbnail_url: string | null
  product_id: string | null
  division_id: string | null
  tags: string[]
  pinned: boolean
  active: boolean
  view_count: number
  created_at: string
  product?: Product
  division?: Division
}

export interface Enquiry {
  id: string
  name: string
  company: string
  country: string
  phone: string | null
  email: string
  business_type: string | null
  product_interest: string[]
  quantity_range: string | null
  message: string | null
  product_id: string | null
  product_name: string | null
  source: string
  status: 'new' | 'contacted' | 'quoted' | 'negotiating' | 'won' | 'lost'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assigned_to: string | null
  notes: string | null
  follow_up_date: string | null
  created_at: string
  updated_at: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'editor' | 'viewer'
  active: boolean
  last_login: string | null
  created_at: string
}

export interface BroadcastLog {
  id: string
  type: 'whatsapp' | 'email'
  title: string | null
  message: string | null
  media_url: string | null
  recipient_count: number
  status: string
  sent_by: string | null
  created_at: string
}

export interface Contact {
  id: string
  name: string | null
  company: string | null
  phone: string | null
  email: string | null
  country: string | null
  type: string
  whatsapp_opt_in: boolean
  email_opt_in: boolean
  active: boolean
  source: string | null
  created_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  total?: number
  limit?: number
  offset?: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  logo_mobile: string   // Image for mobile
  logo_desktop: string  // Image for desktop
  featured: boolean
  display_order: number
  division_slug: string // Which division this brand belongs to
  created_at: string
}
