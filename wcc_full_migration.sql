-- ═══════════════════════════════════════════════════════════════
-- WCC B2B PLATFORM — SUPABASE FULL MIGRATION SCRIPT (SINGAPORE)
-- ═══════════════════════════════════════════════════════════════
-- This script initializes the database schemas, triggers, indexes,
-- storage buckets, RLS policies, and inserts all original seed data.
-- Run this in your new Supabase Project SQL Editor.

-- Enable UUID-OSSP extension for generating random UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─────────────────────────────────────────────────────────────
-- SECTION 1: SCHEMAS & TRIGGERS (TABLES IN DEPENDENCY ORDER)
-- ─────────────────────────────────────────────────────────────

-- 1. Helper function for auto-updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 2. Categories / Divisions Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    status TEXT DEFAULT 'active',
    description TEXT,
    meta_title TEXT,
    meta_description TEXT,
    keywords JSONB DEFAULT '[]'::jsonb,
    hero_heading TEXT,
    hero_subtitle TEXT,
    stat1_label TEXT, stat1_value TEXT,
    stat2_label TEXT, stat2_value TEXT,
    stat3_label TEXT, stat3_value TEXT,
    sub_categories JSONB DEFAULT '[]'::jsonb,
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trigger_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Brands Table
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    logo_mobile TEXT,
    logo_desktop TEXT,
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trigger_brands_updated_at
    BEFORE UPDATE ON public.brands
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Products Table (Referencing Categories and Brands via Slug for compatibility)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    division TEXT,
    division_slug TEXT REFERENCES public.categories(slug) ON DELETE SET NULL,
    category TEXT,
    short_description TEXT,
    moq TEXT,
    lead_time TEXT,
    images TEXT[],
    is_new BOOLEAN DEFAULT false,
    is_offer BOOLEAN DEFAULT false,
    offer_label TEXT,
    offer_start DATE,
    offer_end DATE,
    offer_terms TEXT,
    featured BOOLEAN DEFAULT false,
    custom_branding BOOLEAN DEFAULT false,
    certifications TEXT[],
    specifications JSONB DEFAULT '{}'::jsonb,
    suitable_for TEXT[],
    tags TEXT[],
    brand_slug TEXT REFERENCES public.brands(slug) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    enquiry_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT,
    country TEXT,
    phone TEXT,
    email TEXT NOT NULL,
    business_type TEXT,
    product_interest TEXT[],
    quantity_range TEXT,
    message TEXT,
    product_id TEXT,
    product_name TEXT,
    source TEXT,
    status TEXT DEFAULT 'new',
    priority TEXT DEFAULT 'normal',
    assigned_to TEXT,
    notes TEXT,
    follow_up_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trigger_enquiries_updated_at
    BEFORE UPDATE ON public.enquiries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Media Table
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    filename TEXT NOT NULL,
    size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Broadcasts Table
CREATE TABLE IF NOT EXISTS public.broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    body TEXT,
    sent_to JSONB DEFAULT '[]'::jsonb,
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Website Content Table (CMS Customization)
CREATE TABLE IF NOT EXISTS public.website_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trigger_website_content_updated_at
    BEFORE UPDATE ON public.website_content
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- SECTION 2: INDEXES FOR PERFORMANCE OPTIMIZATION
-- ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_division_slug ON public.products(division_slug);
CREATE INDEX IF NOT EXISTS idx_products_brand_slug ON public.products(brand_slug);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries(created_at);

-- ─────────────────────────────────────────────────────────────
-- SECTION 3: STORAGE CONFIGURATION
-- ─────────────────────────────────────────────────────────────
-- Create wcc_media storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('wcc_media', 'wcc_media', true)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- SECTION 4: ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;

-- 1. Categories
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin write access on categories" ON public.categories;
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on categories" ON public.categories FOR ALL USING (auth.role() = 'service_role');

-- 2. Brands
DROP POLICY IF EXISTS "Allow public read access on brands" ON public.brands;
DROP POLICY IF EXISTS "Allow admin write access on brands" ON public.brands;
CREATE POLICY "Allow public read access on brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on brands" ON public.brands FOR ALL USING (auth.role() = 'service_role');

-- 3. Products
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
DROP POLICY IF EXISTS "Allow admin write access on products" ON public.products;
CREATE POLICY "Allow public read access on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on products" ON public.products FOR ALL USING (auth.role() = 'service_role');

-- 4. Enquiries (Allow public inserts, admin read/write)
DROP POLICY IF EXISTS "Allow public insert access on enquiries" ON public.enquiries;
DROP POLICY IF EXISTS "Allow admin access on enquiries" ON public.enquiries;
CREATE POLICY "Allow public insert access on enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin access on enquiries" ON public.enquiries FOR ALL USING (auth.role() = 'service_role');

-- 5. Media
DROP POLICY IF EXISTS "Allow public read access on media" ON public.media;
DROP POLICY IF EXISTS "Allow admin write access on media" ON public.media;
CREATE POLICY "Allow public read access on media" ON public.media FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on media" ON public.media FOR ALL USING (auth.role() = 'service_role');

-- 6. Newsletter Subscribers (Allow public inserts, admin read/write)
DROP POLICY IF EXISTS "Allow public insert access on newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Allow admin access on newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Allow public insert access on newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin access on newsletter" ON public.newsletter_subscribers FOR ALL USING (auth.role() = 'service_role');

-- 7. Broadcasts
DROP POLICY IF EXISTS "Allow admin access on broadcasts" ON public.broadcasts;
CREATE POLICY "Allow admin access on broadcasts" ON public.broadcasts FOR ALL USING (auth.role() = 'service_role');

-- 8. Website Content
DROP POLICY IF EXISTS "Allow public read access on website_content" ON public.website_content;
DROP POLICY IF EXISTS "Allow admin write access on website_content" ON public.website_content;
CREATE POLICY "Allow public read access on website_content" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "Allow admin write access on website_content" ON public.website_content FOR ALL USING (auth.role() = 'service_role');

-- 9. Storage policies
DROP POLICY IF EXISTS "Allow public select access on storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin insert access on storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete access on storage objects" ON storage.objects;
CREATE POLICY "Allow public select access on storage objects" ON storage.objects FOR SELECT USING (bucket_id = 'wcc_media');
CREATE POLICY "Allow admin insert access on storage objects" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'wcc_media');
CREATE POLICY "Allow admin delete access on storage objects" ON storage.objects FOR DELETE USING (bucket_id = 'wcc_media');

-- ─────────────────────────────────────────────────────────────
-- SECTION 5: ORIGINAL SEED DATA
-- ─────────────────────────────────────────────────────────────

-- Seed Categories
INSERT INTO public.categories (slug, name, icon, status, description, meta_title, meta_description, keywords, hero_heading, hero_subtitle, stat1_label, stat1_value, stat2_label, stat2_value, stat3_label, stat3_value, sub_categories) VALUES 
('garments', 'Garments', 'DIV-01', 'flagship', 'Premium garment manufacturing for global export', 'Wholesale Garments Manufacturer UAE | Bulk Cotton Shirts, Polos & Formal Wear — WCC Garments', 'B2B wholesale garment manufacturer in Dubai, UAE. Premium cotton shirts, polo shirts, formal wear & blazers. Export-grade QC. MOQ from 50 units. Get a bulk quote today.', '["wholesale garments manufacturer UAE", "bulk t-shirt manufacturer Dubai", "cotton shirts wholesale UAE", "garment factory Dubai", "polo shirt bulk order UAE", "formal shirts wholesale Dubai", "B2B garment supplier UAE", "custom garment manufacturer Middle East", "blazer manufacturer UAE", "corporate wear bulk Dubai"]'::jsonb, 'Premium Garments. Precision-Built for Global Wholesale.', 'From cotton formal shirts to velvet blazers — crafted for large-scale B2B buyers across 50+ countries.', 'MOQ From', '50 Units', 'Lead Time', '12–25 Days', 'Export QC', 'Grade A', '[{"id": "GAR-CAT-01", "name": "Formal Shirts", "slug": "formal-shirts", "status": "active", "displayOrder": 1, "subCategories": []}, {"id": "GAR-CAT-02", "name": "Blazers & Suits", "slug": "blazers-suits", "status": "active", "displayOrder": 2, "subCategories": []}, {"id": "GAR-CAT-03", "name": "Jeans & Denims", "slug": "jeans-denims", "status": "active", "displayOrder": 3, "subCategories": []}, {"id": "GAR-CAT-04", "name": "Polo & T-Shirts", "slug": "polo-tshirts", "status": "active", "displayOrder": 4, "subCategories": []}, {"id": "GAR-CAT-05", "name": "Trousers & Chinos", "slug": "trousers", "status": "active", "displayOrder": 5, "subCategories": []}, {"id": "GAR-CAT-06", "name": "Outerwear & Jackets", "slug": "jackets", "status": "active", "displayOrder": 6, "subCategories": []}]'::jsonb),
('uniforms', 'Uniforms', 'DIV-04', 'established', 'Professional uniform solutions for all sectors', 'Uniform Supplier Dubai | Bulk Workwear, Security & Corporate Uniforms — WCC Garments', 'UAE-based uniform manufacturer supplying workwear, security uniforms, corporate attire & industrial PPE in bulk. Serving hotels, hospitals, oil & gas. Request a quote.', '["uniform supplier Dubai", "workwear manufacturer UAE", "corporate uniform bulk order", "security uniform supplier UAE", "industrial workwear Dubai", "hotel staff uniform manufacturer", "safety uniform UAE", "bulk uniform order Middle East", "tactical uniform supplier", "B2B uniform factory Dubai"]'::jsonb, 'Professional Uniforms for Every Sector.', 'From industrial cargo wear to tactical security suites — bulk uniform solutions engineered for performance and compliance.', 'MOQ From', '100 Units', 'Lead Time', '15–30 Days', 'Sectors', '10+', '[{"id": "UNI-CAT-01", "name": "Corporate Workwear", "slug": "corporate-workwear", "status": "active", "displayOrder": 1, "subCategories": []}, {"id": "UNI-CAT-02", "name": "Security Attire", "slug": "security-attire", "status": "active", "displayOrder": 2, "subCategories": []}, {"id": "UNI-CAT-03", "name": "Industrial & PPE", "slug": "industrial-ppe", "status": "active", "displayOrder": 3, "subCategories": []}, {"id": "UNI-CAT-04", "name": "Chef & Kitchen Wear", "slug": "chef-kitchen-wear", "status": "active", "displayOrder": 4, "subCategories": []}, {"id": "UNI-CAT-05", "name": "Protective Aprons", "slug": "protective-aprons", "status": "active", "displayOrder": 5, "subCategories": []}, {"id": "UNI-CAT-06", "name": "Medical & Scrubs", "slug": "medical-scrubs", "status": "coming-soon", "displayOrder": 6, "subCategories": []}]'::jsonb),
('hospitality', 'Hospitality', 'DIV-03', 'expanding', 'Premium hospitality textiles and uniforms', 'Hotel Linen & Hospitality Uniform Supplier UAE | Bed Linen, Chef Wear — WCC Garments', 'Wholesale hospitality textiles from Dubai. Hotel bed linen sets, chef uniforms, restaurant wear & spa towels. Commercial laundering-grade. Bulk supply for hotels & resorts.', '["hotel linen supplier UAE", "hospitality uniform manufacturer Dubai", "hotel bed linen wholesale", "chef uniform bulk order UAE", "restaurant staff uniform Dubai", "hotel towel supplier", "hospitality textile manufacturer", "spa linen wholesale UAE", "resort uniform supplier", "bulk hotel amenities Dubai"]'::jsonb, 'Hospitality Textiles Trusted by 5-Star Properties.', 'Hotel bed linen, chef uniforms & spa textiles engineered for commercial laundering and five-star presentation.', 'MOQ From', '100 Sets', 'Lead Time', '12–20 Days', 'Hotels Served', '500+', '[{"id": "HOS-CAT-01", "name": "Bed Linen Sets", "slug": "bed-linen-sets", "status": "active", "displayOrder": 1, "subCategories": []}, {"id": "HOS-CAT-02", "name": "Chef Uniforms", "slug": "chef-uniforms", "status": "active", "displayOrder": 2, "subCategories": []}, {"id": "HOS-CAT-03", "name": "Spa & Bath Towels", "slug": "spa-bath-towels", "status": "active", "displayOrder": 3, "subCategories": []}, {"id": "HOS-CAT-04", "name": "Restaurant Staff Wear", "slug": "restaurant-wear", "status": "active", "displayOrder": 4, "subCategories": []}, {"id": "HOS-CAT-05", "name": "Pool & Beach Towels", "slug": "pool-beach-towels", "status": "coming-soon", "displayOrder": 5, "subCategories": []}, {"id": "HOS-CAT-06", "name": "Bathrobes & Slippers", "slug": "bathrobes-slippers", "status": "coming-soon", "displayOrder": 6, "subCategories": []}]'::jsonb),
('home', 'Home', 'DIV-05', 'expanding', 'Luxury home linen and furnishing textiles', 'Home Linen Wholesale UAE | Bedsheets, Bath Towels & Luxury Throws — WCC Garments', 'Bulk home textile manufacturer in Dubai. Premium bedsheets, bath towels, cashmere throws & home furnishing textiles. Wholesale pricing for retailers & distributors.', '["home linen wholesale UAE", "bedsheet manufacturer Dubai", "bath towel bulk order UAE", "home textile supplier Middle East", "luxury throws wholesale", "cotton bedding manufacturer UAE", "wholesale home furnishing textiles", "cashmere blanket bulk supplier", "ring spun towel manufacturer Dubai", "B2B home linen distributor"]'::jsonb, 'Luxury Home Textiles for Retailers & Distributors.', 'Premium bedsheets, plush bath towels, and cashmere throws — built for bulk retail and private-label distribution.', 'MOQ From', '100 Units', 'Lead Time', '10–30 Days', 'Thread Count', 'Up to 600TC', '[{"id": "HOME-CAT-01", "name": "Bedsheets", "slug": "bedsheets", "status": "active", "displayOrder": 1, "subCategories": [{"id": "HOME-SUB-01", "name": "Fitted Sheets", "slug": "fitted-sheets", "status": "active", "displayOrder": 1}, {"id": "HOME-SUB-02", "name": "Flat Sheets", "slug": "flat-sheets", "status": "active", "displayOrder": 2}, {"id": "HOME-SUB-03", "name": "Pillow Covers", "slug": "pillow-covers", "status": "active", "displayOrder": 3}]}, {"id": "HOME-CAT-02", "name": "Bath Textiles", "slug": "bath-textiles", "status": "active", "displayOrder": 2, "subCategories": [{"id": "HOME-SUB-04", "name": "Bath Towels", "slug": "bath-towels", "status": "active", "displayOrder": 1}, {"id": "HOME-SUB-05", "name": "Hand Towels", "slug": "hand-towels", "status": "active", "displayOrder": 2}, {"id": "HOME-SUB-06", "name": "Bath Sheets", "slug": "bath-sheets", "status": "active", "displayOrder": 3}]}, {"id": "HOME-CAT-03", "name": "Luxury Throws", "slug": "luxury-throws", "status": "active", "displayOrder": 3, "subCategories": [{"id": "HOME-SUB-07", "name": "Cashmere Throws", "slug": "cashmere-throws", "status": "active", "displayOrder": 1}, {"id": "HOME-SUB-08", "name": "Merino Wool Blankets", "slug": "merino-blankets", "status": "active", "displayOrder": 2}]}, {"id": "HOME-CAT-04", "name": "Table Linen", "slug": "table-linen", "status": "coming-soon", "displayOrder": 4, "subCategories": [{"id": "HOME-SUB-09", "name": "Table Runners", "slug": "table-runners", "status": "coming-soon", "displayOrder": 1}, {"id": "HOME-SUB-10", "name": "Placemats", "slug": "placemats", "status": "coming-soon", "displayOrder": 2}]}]'::jsonb),
('fragrance', 'Fragrance', 'DIV-06', 'newly-started', 'Perfumes, raw materials and private label', 'Wholesale Perfume & Fragrance Manufacturer UAE | Oud, Bakhoor, Private Label — WCC Garments', 'UAE-based fragrance manufacturer offering Arabian Oud, Bakhoor, Eau de Parfum & private label fragrance solutions in bulk. Ideal for retail, duty-free & gift shops.', '["wholesale perfume manufacturer UAE", "oud fragrance supplier Dubai", "private label perfume UAE", "bakhoor supplier wholesale", "Arabian fragrance manufacturer", "Eau de Parfum bulk order", "incense wholesale UAE", "fragrance raw material supplier Dubai", "luxury perfume B2B UAE", "custom fragrance manufacturer Middle East"]'::jsonb, 'Authentic Arabian Fragrances. Private Label Ready.', 'Oud, Bakhoor, Eau de Parfum — crafted in the UAE for retail chains, duty-free operators, and private label buyers worldwide.', 'MOQ From', '100 Units', 'Lead Time', '10–16 Days', 'Label Options', 'Private Label', '[{"id": "FRA-CAT-01", "name": "Arabian Oud", "slug": "arabian-oud", "status": "active", "displayOrder": 1, "subCategories": []}, {"id": "FRA-CAT-02", "name": "Bakhoor & Incense", "slug": "bakhoor-incense", "status": "active", "displayOrder": 2, "subCategories": []}, {"id": "FRA-CAT-03", "name": "Eau de Parfum", "slug": "eau-de-parfum", "status": "active", "displayOrder": 3, "subCategories": []}, {"id": "FRA-CAT-04", "name": "Private Label", "slug": "private-label", "status": "active", "displayOrder": 4, "subCategories": []}, {"id": "FRA-CAT-05", "name": "Raw Materials", "slug": "raw-materials", "status": "coming-soon", "displayOrder": 5, "subCategories": []}]'::jsonb),
('households', 'Households', 'DIV-02', 'active', 'Essential household products for bulk supply', 'Household Products Wholesale UAE | Microfiber Cloths, Bar Mops & Cleaning Supplies — WCC Garments', 'Bulk household and cleaning product supplier in Dubai. Microfiber cleaning cloths, commercial bar mops, terry cleaning supplies. Industrial-grade. Wholesale pricing.', '["household products wholesale UAE", "microfiber cloth manufacturer Dubai", "cleaning supplies bulk UAE", "bar mop wholesale supplier", "industrial cleaning cloth Dubai", "commercial cleaning products UAE", "terry cloth bulk order", "janitorial supplies wholesale Dubai", "B2B household supplier UAE", "cleaning textile manufacturer Middle East"]'::jsonb, 'Industrial-Grade Household Products at Scale.', 'Microfiber cloths, terry bar mops & commercial cleaning textiles — bulk supply for hotels, healthcare, and industrial facilities.', 'MOQ From', '2,500 Units', 'Lead Time', '7–14 Days', 'Wash Rating', '90°C Safe', '[{"id": "HH-CAT-01", "name": "Kitchen", "slug": "kitchen", "status": "active", "displayOrder": 1, "subCategories": [{"id": "HH-SUB-01", "name": "Cutlery", "slug": "cutlery", "status": "active", "displayOrder": 1}, {"id": "HH-SUB-02", "name": "Cookware", "slug": "cookware", "status": "active", "displayOrder": 2}, {"id": "HH-SUB-03", "name": "Utility", "slug": "utility", "status": "active", "displayOrder": 3}, {"id": "HH-SUB-04", "name": "Kitchen Essentials", "slug": "kitchen-essentials", "status": "active", "displayOrder": 4}, {"id": "HH-SUB-05", "name": "Dinnerware", "slug": "dinnerware", "status": "coming-soon", "displayOrder": 5}, {"id": "HH-SUB-06", "name": "Barware", "slug": "barware", "status": "coming-soon", "displayOrder": 6}, {"id": "HH-SUB-07", "name": "Kitchen Utensils", "slug": "kitchen-utensils", "status": "coming-soon", "displayOrder": 7}]}, {"id": "HH-CAT-02", "name": "Microfiber & Cleaning", "slug": "microfiber-cleaning", "status": "active", "displayOrder": 2, "subCategories": []}, {"id": "HH-CAT-03", "name": "Bulk Liquids & Sanitizers", "slug": "bulk-liquids-sanitizers", "status": "active", "displayOrder": 3, "subCategories": []}, {"id": "HH-CAT-04", "name": "Institutional Linens", "slug": "institutional-linens", "status": "active", "displayOrder": 4, "subCategories": []}, {"id": "HH-CAT-05", "name": "OEM Custom Essentials", "slug": "oem-custom-essentials", "status": "active", "displayOrder": 5, "subCategories": []}, {"id": "HH-CAT-06", "name": "Table Top", "slug": "table-top", "status": "coming-soon", "displayOrder": 6, "subCategories": []}, {"id": "HH-CAT-07", "name": "Bathroom Accessories", "slug": "bathroom-accessories", "status": "coming-soon", "displayOrder": 7, "subCategories": []}, {"id": "HH-CAT-08", "name": "Horeca Products", "slug": "horeca-products", "status": "coming-soon", "displayOrder": 8, "subCategories": []}, {"id": "HH-CAT-09", "name": "Seasonal Gifting", "slug": "seasonal-gifting", "status": "coming-soon", "displayOrder": 9, "subCategories": []}]'::jsonb)
ON CONFLICT (slug) DO NOTHING;
ON CONFLICT (slug) DO NOTHING;

-- Seed Brands
INSERT INTO public.brands (slug, name, tagline, description, logo_mobile, logo_desktop, featured, display_order) VALUES 
('treasure', 'TREASURE', 'Sleek Corporate Tailoring & Bespoke Formal Wear', 'A distinguished name in executive and protocol apparel. Known for premium-cut 100% Egyptian cotton shirts, velvet blazers, and luxury formal trousers representing the apex of B2B corporate wear.', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=1200&q=80', true, 1),
('vandegraff', 'VANDEGRAFF', 'Heavy-Duty Corporate Attire & Technical Workwear', 'Engineered for absolute performance, high-grade twill corporate trousers, heavy-duty cargo wear, and premium corporate uniforms constructed with reinforced stitching and stain-resistant treatment.', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80', 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80', true, 2),
('tom-jack', 'TOM & JACK', 'Contemporary Active Apparel & Refined Team Wear', 'Modern, high-comfort garments designed for luxury hospitality staff, VIP events, and professional team environments. Specialists in double-mercerized cotton polo shirts and elegant corporate accessories.', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1200&q=80', true, 3)
ON CONFLICT (slug) DO NOTHING;

-- Seed Products
INSERT INTO public.products (slug, name, division, division_slug, category, short_description, moq, lead_time, images, is_new, is_offer, offer_label, offer_start, offer_end, offer_terms, featured, custom_branding, certifications, specifications, suitable_for, tags, brand_slug) VALUES 
('egyptian-cotton-premium-shirts', 'Egyptian Cotton Premium Shirts', 'Garments', 'garments', 'Formal Shirts', 'Premium 100% Egyptian cotton shirts crafted for global wholesale distribution. Available in multiple fits and finishes.', '500 units', '15-25 working days', ARRAY['/images/products/egyptian_cotton_shirt.png', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=85'], true, false, NULL, NULL, NULL, NULL, true, true, ARRAY['Export Grade QC'], '{"material": "100% Egyptian Cotton", "thread_count": "300 TC", "weight": "120 GSM", "sizes": "S, M, L, XL, XXL", "colors": "White, Sky Blue, Navy, Black"}'::jsonb, ARRAY['Corporate', 'Retail', 'Hotels'], ARRAY['cotton', 'formal', 'premium'], 'treasure'),
('industrial-cargo-work-pants', 'Industrial Cargo Work Pants', 'Uniforms', 'uniforms', 'Workwear', 'Heavy-duty cargo work pants built for industrial environments. Reinforced stitching and multiple utility pockets.', '300 units', '20-30 working days', ARRAY['/images/products/cargo_work_pants.png', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=85'], false, true, 'Bulk Discount', '2026-05-01', '2026-06-30', 'Applicable for orders above 1,000 units. Subject to production slot confirmation.', true, true, ARRAY['Industrial Workwear QA'], '{"material": "Poly-Cotton Blend 65/35", "weight": "280 GSM", "sizes": "28-44 Waist", "colors": "Khaki, Navy, Black, Olive"}'::jsonb, ARRAY['Construction', 'Manufacturing', 'Oil & Gas'], ARRAY['workwear', 'industrial', 'cargo'], NULL),
('hotel-bed-linen-collection', 'Hotel Bed Linen Collection', 'Hospitality', 'hospitality', 'Bed Linen', 'Luxury hotel-grade bed linen sets. Sateen weave finish with exceptional durability for commercial laundering.', '200 sets', '15-20 working days', ARRAY['/images/products/hotel_bed_linen.png', 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=85'], true, false, NULL, NULL, NULL, NULL, true, true, ARRAY['Hospitality Textile QC'], '{"material": "100% Combed Cotton", "thread_count": "300-600 TC", "weave": "Sateen", "sizes": "Single, Double, Queen, King"}'::jsonb, ARRAY['Hotels', 'Resorts', 'Airlines'], ARRAY['hotel', 'linen', 'luxury'], NULL),
('luxury-bath-towel-set', 'Luxury Bath Towel Set', 'Home', 'home', 'Bath Textiles', 'Ultra-soft ring spun cotton towels with superior absorbency. Double-stitched hems for commercial durability.', '1000 units', '10-15 working days', ARRAY['/images/products/luxury_bath_towels.png', 'https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=85'], false, true, 'Seasonal Special', '2026-05-10', '2026-07-10', 'Offer applies to container-load and mixed-SKU bulk enquiries only.', false, true, ARRAY[]::text[], '{"material": "100% Ring Spun Cotton", "weight": "500-700 GSM", "sizes": "Hand, Bath, Bath Sheet", "colors": "White, Ivory, Grey, Navy"}'::jsonb, ARRAY['Hotels', 'Retail', 'Healthcare'], ARRAY['towel', 'bath', 'cotton'], NULL),
('arabian-oud-collection', 'Arabian Oud Collection', 'Fragrance', 'fragrance', 'Premium Fragrances', 'Authentic Arabian Oud fragrances crafted from rare aged agarwood. Private label options available.', '100 units', '10-15 working days', ARRAY['/images/products/arabian_oud_perfume.png', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&q=85'], true, false, NULL, NULL, NULL, NULL, true, true, ARRAY[]::text[], '{"type": "Eau de Parfum", "concentration": "18-22%", "sizes": "50ml, 100ml", "notes": "Oud, Rose, Amber, Musk"}'::jsonb, ARRAY['Retail', 'Duty Free', 'Gift Shops'], ARRAY['fragrance', 'oud', 'luxury'], NULL),
('premium-chef-uniform-set', 'Premium Chef Uniform Set', 'Hospitality', 'hospitality', 'Chef Uniforms', 'Professional chef coats with breathable fabric and stain resistance. Double-breasted design with cloth buttons.', '100 units', '12-18 working days', ARRAY['/images/products/chef_uniform.png', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=85'], false, false, NULL, NULL, NULL, NULL, true, true, ARRAY[]::text[], '{"material": "Poly-Cotton Twill", "weight": "200 GSM", "sizes": "XS-3XL", "colors": "White, Black, Grey"}'::jsonb, ARRAY['Restaurants', 'Hotels', 'Catering'], ARRAY['chef', 'uniform', 'hospitality'], NULL),
('microfiber-cleaning-cloths', 'Microfiber Cleaning Cloths', 'Households', 'households', 'Cleaning Products', 'Industrial grade microfiber cleaning cloths. Ultra-absorbent, lint-free, and reusable for hundreds of wash cycles.', '5000 units', '7-10 working days', ARRAY['https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&q=85', 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=800&q=85'], false, true, 'Clearance', '2026-04-20', '2026-05-31', 'Limited to available warehouse inventory. Bulk dispatch scheduling applies.', false, false, ARRAY[]::text[], '{"material": "80% Polyester / 20% Polyamide", "weight": "300 GSM", "sizes": "30x30cm, 40x40cm", "colors": "Blue, Green, Yellow, Red"}'::jsonb, ARRAY['Hotels', 'Healthcare', 'Industrial'], ARRAY['cleaning', 'microfiber', 'household'], NULL),
('executive-polo-collection', 'Executive Polo Collection', 'Garments', 'garments', 'Polo Shirts', 'Premium pique cotton polo shirts with corporate customization. Ribbed collar and cuffs for refined appearance.', '250 units', '12-18 working days', ARRAY['https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=85', 'https://images.unsplash.com/photo-1622445262465-248197307967?w=800&q=85'], true, false, NULL, NULL, NULL, NULL, false, true, ARRAY[]::text[], '{"material": "100% Pique Cotton", "weight": "220 GSM", "sizes": "S-3XL", "colors": "White, Navy, Black, Burgundy, Forest Green"}'::jsonb, ARRAY['Corporate', 'Hotels', 'Events'], ARRAY['polo', 'corporate', 'cotton'], 'tom-jack'),
('executive-velvet-blazer', 'Executive Velvet Blazer', 'Garments', 'garments', 'Formal Outerwear', 'Luxury tailored velvet blazers engineered for VIP hospitality and front-of-house attire. Stain resistant coating.', '50 units', '14-20 working days', ARRAY['https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&5', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=85'], false, true, 'VIP Package', '2026-05-15', '2026-08-15', 'Bundle includes branded packaging and priority sampling for qualified buyers.', true, true, ARRAY[]::text[], '{"material": "Italian Cotton Velvet", "weight": "320 GSM", "sizes": "36-48 Chest", "colors": "Midnight Blue, Royal Black, Emerald"}'::jsonb, ARRAY['Boutique Hotels', 'Luxury Lounges', 'Private Clubs'], ARRAY['blazer', 'velvet', 'vip'], 'treasure'),
('tactical-security-uniform-suite', 'Tactical Security Uniform Suite', 'Uniforms', 'uniforms', 'Security Attire', 'Industrial ripstop tactical uniforms engineered for VIP security and protocol forces. Water and abrasion resistant coating.', '200 units', '18-25 working days', ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=85', 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=800&q=85'], true, false, NULL, NULL, NULL, NULL, true, true, ARRAY['Compliance-Ready Fabrics'], '{"material": "65% Polyester / 35% Cotton Ripstop", "weight": "260 GSM", "sizes": "S-4XL", "colors": "Navy, Black, Desert Tan"}'::jsonb, ARRAY['Security Firms', 'Hotels', 'Aviation'], ARRAY['tactical', 'uniform', 'security'], NULL),
('cashmere-merino-hospitality-blanket', 'Cashmere Merino Hospitality Blanket', 'Home', 'home', 'Luxury Throws', 'Exquisite blended cashmere and merino wool throws designed for five-star presidential suites and VIP aviation lounges.', '100 units', '20-30 working days', ARRAY['https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=800&q=85', 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&q=85'], true, false, NULL, NULL, NULL, NULL, true, true, ARRAY[]::text[], '{"material": "30% Mongolian Cashmere / 70% Merino Wool", "weight": "450 GSM", "dimensions": "180x220cm", "colors": "Warm Taupe, Charcoal, Oatmeal"}'::jsonb, ARRAY['Luxury Hotels', 'Private Jets', 'High-End Retail'], ARRAY['cashmere', 'blanket', 'home'], NULL),
('royal-majalis-bakhoor-infusion', 'Royal Majalis Bakhoor Infusion', 'Fragrance', 'fragrance', 'Incense & Home Fragrance', 'Traditional royal Bakhoor compressed tablets rich in natural sandalwood, ambergris, and Taif rose essential oils.', '300 boxes', '12-16 working days', ARRAY['https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=800&q=85', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=85'], false, false, NULL, NULL, NULL, NULL, true, true, ARRAY[]::text[], '{"format": "Compressed Incense Tablets", "weight": "150g per box", "origin": "UAE Crafted", "notes": "Sandalwood, Amber, Taif Rose"}'::jsonb, ARRAY['Palaces', 'Luxury Hotels', 'Boutique Spas'], ARRAY['bakhoor', 'fragrance', 'majalis'], NULL),
('heavy-duty-industrial-apron-set', 'Heavy-Duty Industrial Apron Set', 'Uniforms', 'uniforms', 'Protective Workwear', 'Waxed cotton canvas aprons with genuine leather harness straps and solid brass hardware. Built for artisan workshops.', '150 units', '15-20 working days', ARRAY['https://images.unsplash.com/photo-1602573991155-21f0143bb45c?w=800&q=85', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=85'], true, false, NULL, NULL, NULL, NULL, false, true, ARRAY[]::text[], '{"material": "16oz Waxed Cotton Canvas", "straps": "Full Grain Leather", "hardware": "Solid Brass", "sizes": "Adjustable One Size"}'::jsonb, ARRAY['Coffee Roasters', 'Woodworking', 'Bespoke Kitchens'], ARRAY['apron', 'workwear', 'canvas'], NULL),
('commercial-terry-bar-mops', 'Commercial Terry Bar Mops', 'Households', 'households', 'Cleaning Supplies', 'Industrial bulk pack terry bar mops engineered for high-volume commercial kitchens and sanitation workflows.', '2500 units', '10-14 working days', ARRAY['https://images.unsplash.com/photo-1616627561839-074385245ff6?w=800&q=85', 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&q=85'], false, false, NULL, NULL, NULL, NULL, true, false, ARRAY[]::text[], '{"material": "100% Virgin Cotton Terry", "weight": "350 GSM", "pack": "50 units per bundle", "laundering": "90C Industrial Wash Safe"}'::jsonb, ARRAY['Restaurants', 'Bars', 'Industrial Caterers'], ARRAY['cleaning', 'barmop', 'terry'], NULL),
('premium-silk-tie-collection', 'Premium Silk Tie Collection', 'Garments', 'garments', 'Corporate Accessories', 'Handcrafted jacquard woven 100% mulberry silk neckties. Custom monogramming and corporate gift box packaging available.', '300 units', '20-25 working days', ARRAY['https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=85', 'https://images.unsplash.com/photo-1617137953288-c89b33a75908?w=800&q=85'], true, false, NULL, NULL, NULL, NULL, false, true, ARRAY[]::text[], '{"material": "100% Mulberry Silk", "width": "8cm Classic Width", "finish": "Jacquard Weave", "lining": "100% Wool Interlining"}'::jsonb, ARRAY['Corporate Gifts', 'Airlines', 'Executive Protocol'], ARRAY['silk', 'tie', 'corporate'], 'tom-jack')
ON CONFLICT (slug) DO NOTHING;

-- Seed Enquiries
INSERT INTO public.enquiries (name, company, country, email, phone, product_interest, status, priority, message, created_at, assigned_to) VALUES 
('Gulf Textiles Trading', 'Gulf Textiles Trading', 'Saudi Arabia', 'procurement@gulftextiles.com', '+966 50 123 4567', ARRAY['Garments, Uniforms'], 'new', 'urgent', 'Urgently looking for high-quality cotton twill coveralls and corporate staff uniforms for upcoming tender.', NOW(), 'Unassigned'),
('Lagos Fashion House', 'Lagos Fashion House', 'Nigeria', 'director@lagosfashion.ng', '+234 803 111 2222', ARRAY['Garments'], 'contacted', 'high', 'Looking for OEM manufacturing partner for our 2026 winter streetwear collection. Spec sheets attached.', NOW(), 'Sarah K.'),
('Marriott Hotel Group', 'Marriott Hotel Group', 'United Arab Emirates', 'dubai.purchasing@marriott.com', '+971 4 414 0000', ARRAY['Hospitality, Uniforms'], 'quoted', 'urgent', 'Complete bedding replacement and concierge uniform overhaul for 3 properties across Dubai and Abu Dhabi.', NOW(), 'Alex M.'),
('Oman Royal Tender Board', 'Oman Royal Tender Board', 'Oman', 'tenders@mof.gov.om', '+968 24 777 888', ARRAY['Government Uniforms'], 'quoted', 'high', 'Formal government tender inquiry for military and civil defense standard uniform fabrics.', NOW(), 'Alex M.'),
('Nairobi Retail Chain', 'Nairobi Retail Chain', 'Kenya', 'import@nairobibigbox.ke', '+254 20 123 456', ARRAY['Households, Fragrance'], 'converted', 'normal', 'Trial order for private label room fresheners and bulk micro-fiber cleaning cloths.', NOW(), 'Sarah K.');

-- Seed Media
INSERT INTO public.media (url, filename, mime_type, created_at) VALUES 
('https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80', 'Premium Cotton Twill Suiting Banner 2026', 'new_arrival', NOW()),
('https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', 'Hospitality Sateen Bedding Linen Showcase', 'new_arrival', NOW()),
('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80', 'Industrial Safety Coverall Bulk Clearance Banner', 'offer', NOW()),
('https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80', 'Pure Oud Attar Royal Box Bottle Macro', 'offer', NOW()),
('https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80', 'Executive Polo Collection Editorial Banner', 'banner', NOW()),
('https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80', 'Microfiber Bulk Household Towel Stack', 'product_showcase', NOW());

-- Seed Website Content (CMS Setup default row)
INSERT INTO public.website_content (key, content) VALUES
('home_hero', '{"heading": "Outfitting the World''s Finest Enterprises", "subheading": "Premium global wholesale supply solutions for corporate clothing, workwear uniforms, luxury hotel linens, and custom branded fragrance experiences."}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ═══════════════════════════════════════════════════════════════
-- ANALYTICS HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════

-- Increment views function
CREATE OR REPLACE FUNCTION public.increment_product_views(product_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.products
    SET view_count = COALESCE(view_count, 0) + 1
    WHERE slug = product_slug;
END;
$$ LANGUAGE plpgsql;


-- Increment enquiry count function
CREATE OR REPLACE FUNCTION public.increment_product_enquiries(product_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.products
    SET enquiry_count = COALESCE(enquiry_count, 0) + 1
    WHERE slug = product_slug;
END;
$$ LANGUAGE plpgsql;

-- Create catalogue_requests table to store client requests for catalogues
CREATE TABLE IF NOT EXISTS public.catalogue_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    brand_slug TEXT NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.catalogue_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow public insert access to submit requests
DROP POLICY IF EXISTS "Allow public insert access to catalogue_requests" ON public.catalogue_requests;
CREATE POLICY "Allow public insert access to catalogue_requests"
    ON public.catalogue_requests
    FOR INSERT
    WITH CHECK (true);

-- Allow service_role (admin) full access to manage requests
DROP POLICY IF EXISTS "Allow admin access to catalogue_requests" ON public.catalogue_requests;
CREATE POLICY "Allow admin access to catalogue_requests"
    ON public.catalogue_requests
    FOR ALL
    USING (auth.role() = 'service_role');

-- Trigger to automatically update 'updated_at' timestamp
DROP TRIGGER IF EXISTS update_catalogue_requests_modtime ON public.catalogue_requests;
CREATE TRIGGER update_catalogue_requests_modtime
    BEFORE UPDATE ON public.catalogue_requests
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();


