-- Migration: Add division_slug column to brands table
-- Run this in the Supabase SQL Editor

-- 1. Add the column (nullable so existing rows don't break)
ALTER TABLE public.brands
  ADD COLUMN IF NOT EXISTS division_slug TEXT DEFAULT 'garments';

-- 2. Backfill existing known brands
UPDATE public.brands SET division_slug = 'garments'   WHERE slug IN ('treasure', 'vandegraff', 'tom-jack');
UPDATE public.brands SET division_slug = 'hospitality' WHERE slug IN ('horeca24h');
UPDATE public.brands SET division_slug = 'households'  WHERE slug IN ('aanya-homecraft');

-- 3. Make the column NOT NULL now that rows are backfilled
ALTER TABLE public.brands
  ALTER COLUMN division_slug SET NOT NULL;

-- 4. Add an index for fast per-division queries
CREATE INDEX IF NOT EXISTS idx_brands_division_slug ON public.brands (division_slug);
