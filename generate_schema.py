import json
import os
import re

def escape_str(s):
    if s is None:
        return 'NULL'
    return "'" + str(s).replace("'", "''") + "'"

def escape_json(j):
    if not j:
        return "'{}'::jsonb"
    return "'" + json.dumps(j).replace("'", "''") + "'::jsonb"

def escape_arr(a):
    if not a:
        return "ARRAY[]::text[]"
    res = []
    for v in a:
        if v is None:
            res.append('NULL')
        else:
            res.append("'" + str(v).replace("'", "''") + "'")
    return "ARRAY[" + ", ".join(res) + "]"

def main():
    with open('dump.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    # I'll just hardcode media and enquiries inside python
    INITIAL_MEDIA = [
      { "id": "MED-001", "title": "Premium Cotton Twill Suiting Banner 2026", "type": "new_arrival", "image": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80", "dimensions": "1920x1080", "size": "1.2 MB", "uploadedAt": "15 May 2026" },
      { "id": "MED-002", "title": "Hospitality Sateen Bedding Linen Showcase", "type": "new_arrival", "image": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", "dimensions": "2048x1536", "size": "2.4 MB", "uploadedAt": "14 May 2026" },
      { "id": "MED-003", "title": "Industrial Safety Coverall Bulk Clearance Banner", "type": "offer", "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", "dimensions": "1200x630", "size": "940 KB", "uploadedAt": "12 May 2026" },
      { "id": "MED-004", "title": "Pure Oud Attar Royal Box Bottle Macro", "type": "offer", "image": "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80", "dimensions": "1080x1080", "size": "1.8 MB", "uploadedAt": "10 May 2026" },
      { "id": "MED-005", "title": "Executive Polo Collection Editorial Banner", "type": "banner", "image": "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80", "dimensions": "1920x800", "size": "1.5 MB", "uploadedAt": "08 May 2026" },
      { "id": "MED-006", "title": "Microfiber Bulk Household Towel Stack", "type": "product_showcase", "image": "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80", "dimensions": "1600x1200", "size": "1.1 MB", "uploadedAt": "01 May 2026" }
    ]

    INITIAL_ENQUIRIES = [
      { "id": "ENQ-2026-008", "company": "Gulf Textiles Trading", "country": "Saudi Arabia", "email": "procurement@gulftextiles.com", "phone": "+966 50 123 4567", "products": "Garments, Uniforms", "status": "new", "priority": "urgent", "date": "17 May 2026", "quantity": "10,000 - 25,000 Units", "message": "Urgently looking for high-quality cotton twill coveralls and corporate staff uniforms for upcoming tender.", "rep": "Unassigned" },
      { "id": "ENQ-2026-007", "company": "Lagos Fashion House", "country": "Nigeria", "email": "director@lagosfashion.ng", "phone": "+234 803 111 2222", "products": "Garments", "status": "contacted", "priority": "high", "date": "16 May 2026", "quantity": "5,000 Units", "message": "Looking for OEM manufacturing partner for our 2026 winter streetwear collection. Spec sheets attached.", "rep": "Sarah K." },
      { "id": "ENQ-2026-006", "company": "Marriott Hotel Group", "country": "United Arab Emirates", "email": "dubai.purchasing@marriott.com", "phone": "+971 4 414 0000", "products": "Hospitality, Uniforms", "status": "quoted", "priority": "urgent", "date": "15 May 2026", "quantity": "50,000+ Units", "message": "Complete bedding replacement and concierge uniform overhaul for 3 properties across Dubai and Abu Dhabi.", "rep": "Alex M." },
      { "id": "ENQ-2026-005", "company": "Oman Royal Tender Board", "country": "Oman", "email": "tenders@mof.gov.om", "phone": "+968 24 777 888", "products": "Government Uniforms", "status": "quoted", "priority": "high", "date": "12 May 2026", "quantity": "100,000 Units", "message": "Formal government tender inquiry for military and civil defense standard uniform fabrics.", "rep": "Alex M." },
      { "id": "ENQ-2026-004", "company": "Nairobi Retail Chain", "country": "Kenya", "email": "import@nairobibigbox.ke", "phone": "+254 20 123 456", "products": "Households, Fragrance", "status": "converted", "priority": "normal", "date": "10 May 2026", "quantity": "2,500 Units", "message": "Trial order for private label room fresheners and bulk micro-fiber cleaning cloths.", "rep": "Sarah K." }
    ]

    sql = """
-- 4. Categories / Divisions Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    status TEXT DEFAULT 'active',
    description TEXT,
    meta_title TEXT,
    meta_description TEXT,
    keywords JSONB DEFAULT '[]',
    hero_heading TEXT,
    hero_subtitle TEXT,
    stat1_label TEXT, stat1_value TEXT,
    stat2_label TEXT, stat2_value TEXT,
    stat3_label TEXT, stat3_value TEXT,
    sub_categories JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Brands Table
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

-- 6. Newsletter Subscribers Table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Broadcasts Table
CREATE TABLE IF NOT EXISTS public.broadcasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject TEXT NOT NULL,
    body TEXT,
    sent_to JSONB DEFAULT '[]',
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

----------------------------------------------------
-- SEED DATA
----------------------------------------------------
"""

    sql += "\\n-- Seed Categories\\n"
    for div in data.get('divisions', []):
        sql += f"INSERT INTO public.categories (slug, name, icon, status, description, meta_title, meta_description, keywords, hero_heading, hero_subtitle, stat1_label, stat1_value, stat2_label, stat2_value, stat3_label, stat3_value, sub_categories) VALUES ({escape_str(div.get('slug'))}, {escape_str(div.get('name'))}, {escape_str(div.get('icon'))}, {escape_str(div.get('status'))}, {escape_str(div.get('description'))}, {escape_str(div.get('metaTitle'))}, {escape_str(div.get('metaDescription'))}, {escape_json(div.get('keywords', []))}, {escape_str(div.get('heroHeading'))}, {escape_str(div.get('heroSubtitle'))}, {escape_str(div.get('stat1Label'))}, {escape_str(div.get('stat1Value'))}, {escape_str(div.get('stat2Label'))}, {escape_str(div.get('stat2Value'))}, {escape_str(div.get('stat3Label'))}, {escape_str(div.get('stat3Value'))}, {escape_json(div.get('categories', []))}) ON CONFLICT (slug) DO NOTHING;\\n"

    sql += "\\n-- Seed Brands\\n"
    for b in data.get('brands', []):
        sql += f"INSERT INTO public.brands (slug, name, tagline, description, logo_mobile, logo_desktop, featured, display_order) VALUES ({escape_str(b.get('slug'))}, {escape_str(b.get('name'))}, {escape_str(b.get('tagline'))}, {escape_str(b.get('description'))}, {escape_str(b.get('logo_mobile'))}, {escape_str(b.get('logo_desktop'))}, {str(b.get('featured', False)).lower()}, {b.get('display_order', 1)}) ON CONFLICT (slug) DO NOTHING;\\n"

    sql += "\\n-- Seed Products\\n"
    for p in data.get('products', []):
        sql += f"INSERT INTO public.products (slug, name, division, division_slug, category, short_description, moq, lead_time, images, is_new, is_offer, offer_label, offer_start, offer_end, offer_terms, featured, custom_branding, certifications, specifications, suitable_for, tags, brand_slug) VALUES ({escape_str(p.get('slug'))}, {escape_str(p.get('name'))}, {escape_str(p.get('division'))}, {escape_str(p.get('division_slug'))}, {escape_str(p.get('category'))}, {escape_str(p.get('short_description'))}, {escape_str(p.get('moq'))}, {escape_str(p.get('lead_time'))}, {escape_arr(p.get('images'))}, {str(p.get('is_new', False)).lower()}, {str(p.get('is_offer', False)).lower()}, {escape_str(p.get('offer_label'))}, {escape_str(p.get('offer_start'))}, {escape_str(p.get('offer_end'))}, {escape_str(p.get('offer_terms'))}, {str(p.get('featured', False)).lower()}, {str(p.get('custom_branding', False)).lower()}, {escape_arr(p.get('certifications', []))}, {escape_json(p.get('specifications', {}))}, {escape_arr(p.get('suitable_for', []))}, {escape_arr(p.get('tags', []))}, {escape_str(p.get('brand_slug'))}) ON CONFLICT (slug) DO NOTHING;\\n"

    sql += "\\n-- Seed Enquiries\\n"
    for e in INITIAL_ENQUIRIES:
        sql += f"INSERT INTO public.enquiries (name, company, country, email, phone, product_interest, status, priority, message, created_at, assigned_to) VALUES ({escape_str(e.get('company'))}, {escape_str(e.get('company'))}, {escape_str(e.get('country'))}, {escape_str(e.get('email'))}, {escape_str(e.get('phone'))}, {escape_arr([e.get('products')])}, {escape_str(e.get('status'))}, {escape_str(e.get('priority'))}, {escape_str(e.get('message'))}, NOW(), {escape_str(e.get('rep'))});\\n"

    sql += "\\n-- Seed Media\\n"
    for m in INITIAL_MEDIA:
        sql += f"INSERT INTO public.media (url, filename, mime_type, created_at) VALUES ({escape_str(m.get('image'))}, {escape_str(m.get('title'))}, {escape_str(m.get('type'))}, NOW());\\n"

    with open('supabase_schema.sql', 'a', encoding='utf-8') as f:
        f.write(sql)

if __name__ == '__main__':
    main()
