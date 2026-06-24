import { z } from 'zod'

export const EnquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  company: z.string().min(2, 'Company name is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(8, 'Valid phone number required'),
  email: z.string().email('Valid email is required'),
  business_type: z.string().optional(),
  product_interest: z.array(z.string()).optional(),
  quantity_range: z.string().optional(),
  message: z.string().optional(),
  product_id: z.string().uuid().optional(),
  product_name: z.string().optional(),
  source: z.string().optional(),
})

export const ProductSchema = z.object({
  division_id: z.string().uuid(),
  category_id: z.string().uuid().optional().nullable(),
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().min(2, 'Slug is required'),
  short_description: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  specifications: z.record(z.unknown()).optional().default({}),
  moq: z.string().optional().nullable(),
  lead_time: z.string().optional().nullable(),
  custom_branding: z.boolean().default(false),
  images: z.array(z.string()).default([]),
  video_url: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  suitable_for: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  is_new: z.boolean().default(false),
  is_offer: z.boolean().default(false),
  offer_label: z.string().optional().nullable(),
  published: z.boolean().default(false),
})

export const LoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const CategorySchema = z.object({
  division_id: z.string().uuid(),
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  display_order: z.number().default(0),
  active: z.boolean().default(true),
})

export type EnquiryFormData = z.infer<typeof EnquirySchema>
export type ProductFormData = z.infer<typeof ProductSchema>
export type LoginFormData = z.infer<typeof LoginSchema>
export type CategoryFormData = z.infer<typeof CategorySchema>
