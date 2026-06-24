import { DIVISIONS, MOCK_PRODUCTS, MOCK_BRANDS } from './src/lib/constants';
import * as fs from 'fs';

const INITIAL_MEDIA = [
  { id: 'MED-001', title: 'Premium Cotton Twill Suiting Banner 2026', type: 'new_arrival', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80', dimensions: '1920x1080', size: '1.2 MB', uploadedAt: '15 May 2026' },
  { id: 'MED-002', title: 'Hospitality Sateen Bedding Linen Showcase', type: 'new_arrival', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', dimensions: '2048x1536', size: '2.4 MB', uploadedAt: '14 May 2026' },
  { id: 'MED-003', title: 'Industrial Safety Coverall Bulk Clearance Banner', type: 'offer', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80', dimensions: '1200x630', size: '940 KB', uploadedAt: '12 May 2026' },
  { id: 'MED-004', title: 'Pure Oud Attar Royal Box Bottle Macro', type: 'offer', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80', dimensions: '1080x1080', size: '1.8 MB', uploadedAt: '10 May 2026' },
  { id: 'MED-005', title: 'Executive Polo Collection Editorial Banner', type: 'banner', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=800&q=80', dimensions: '1920x800', size: '1.5 MB', uploadedAt: '08 May 2026' },
  { id: 'MED-006', title: 'Microfiber Bulk Household Towel Stack', type: 'product_showcase', image: 'https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80', dimensions: '1600x1200', size: '1.1 MB', uploadedAt: '01 May 2026' },
];

const INITIAL_ENQUIRIES = [
  { id: 'ENQ-2026-008', company: 'Gulf Textiles Trading', country: 'Saudi Arabia', email: 'procurement@gulftextiles.com', phone: '+966 50 123 4567', products: 'Garments, Uniforms', status: 'new', priority: 'urgent', date: '17 May 2026', quantity: '10,000 - 25,000 Units', message: 'Urgently looking for high-quality cotton twill coveralls and corporate staff uniforms for upcoming tender.', rep: 'Unassigned' },
  { id: 'ENQ-2026-007', company: 'Lagos Fashion House', country: 'Nigeria', email: 'director@lagosfashion.ng', phone: '+234 803 111 2222', products: 'Garments', status: 'contacted', priority: 'high', date: '16 May 2026', quantity: '5,000 Units', message: 'Looking for OEM manufacturing partner for our 2026 winter streetwear collection. Spec sheets attached.', rep: 'Sarah K.' },
  { id: 'ENQ-2026-006', company: 'Marriott Hotel Group', country: 'United Arab Emirates', email: 'dubai.purchasing@marriott.com', phone: '+971 4 414 0000', products: 'Hospitality, Uniforms', status: 'quoted', priority: 'urgent', date: '15 May 2026', quantity: '50,000+ Units', message: 'Complete bedding replacement and concierge uniform overhaul for 3 properties across Dubai and Abu Dhabi.', rep: 'Alex M.' },
  { id: 'ENQ-2026-005', company: 'Oman Royal Tender Board', country: 'Oman', email: 'tenders@mof.gov.om', phone: '+968 24 777 888', products: 'Government Uniforms', status: 'quoted', priority: 'high', date: '12 May 2026', quantity: '100,000 Units', message: 'Formal government tender inquiry for military and civil defense standard uniform fabrics.', rep: 'Alex M.' },
  { id: 'ENQ-2026-004', company: 'Nairobi Retail Chain', country: 'Kenya', email: 'import@nairobibigbox.ke', phone: '+254 20 123 456', products: 'Households, Fragrance', status: 'converted', priority: 'normal', date: '10 May 2026', quantity: '2,500 Units', message: 'Trial order for private label room fresheners and bulk micro-fiber cleaning cloths.', rep: 'Sarah K.' },
];

let sql = `
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
`;

const escapeStr = (s: string | null | undefined) => {
  if (s === null || s === undefined) return 'NULL';
  return "'" + s.replace(/'/g, "''") + "'";
};

const escapeJson = (j: any) => {
  if (!j) return "'{}'::jsonb";
  return "'" + JSON.stringify(j).replace(/'/g, "''") + "'::jsonb";
};

const escapeArr = (a: any[]) => {
  if (!a) return "ARRAY[]::text[]";
  return "ARRAY[" + a.map(v => escapeStr(v)).join(', ') + "]";
};


// 1. Seed Categories (Divisions)
sql += `\n-- Seed Categories\n`;
DIVISIONS.forEach(div => {
  sql += `INSERT INTO public.categories (
    slug, name, icon, status, description, meta_title, meta_description, keywords, hero_heading, hero_subtitle, stat1_label, stat1_value, stat2_label, stat2_value, stat3_label, stat3_value, sub_categories
  ) VALUES (
    ${escapeStr(div.slug)}, ${escapeStr(div.name)}, ${escapeStr(div.icon)}, ${escapeStr(div.status)}, ${escapeStr(div.description)}, ${escapeStr(div.metaTitle)}, ${escapeStr(div.metaDescription)}, ${escapeJson(div.keywords)}, ${escapeStr(div.heroHeading)}, ${escapeStr(div.heroSubtitle)}, ${escapeStr(div.stat1Label)}, ${escapeStr(div.stat1Value)}, ${escapeStr(div.stat2Label)}, ${escapeStr(div.stat2Value)}, ${escapeStr(div.stat3Label)}, ${escapeStr(div.stat3Value)}, ${escapeJson(div.categories)}
  ) ON CONFLICT (slug) DO NOTHING;\n`;
});

// 2. Seed Brands
sql += `\n-- Seed Brands\n`;
MOCK_BRANDS.forEach(brand => {
  sql += `INSERT INTO public.brands (
    slug, name, tagline, description, logo_mobile, logo_desktop, featured, display_order
  ) VALUES (
    ${escapeStr(brand.slug)}, ${escapeStr(brand.name)}, ${escapeStr(brand.tagline)}, ${escapeStr(brand.description)}, ${escapeStr(brand.logo_mobile)}, ${escapeStr(brand.logo_desktop)}, ${brand.featured}, ${brand.display_order}
  ) ON CONFLICT (slug) DO NOTHING;\n`;
});

// 3. Seed Products
sql += `\n-- Seed Products\n`;
MOCK_PRODUCTS.forEach(p => {
  sql += `INSERT INTO public.products (
    slug, name, division, division_slug, category, short_description, moq, lead_time, images, is_new, is_offer, offer_label, offer_start, offer_end, offer_terms, featured, custom_branding, certifications, specifications, suitable_for, tags, brand_slug
  ) VALUES (
    ${escapeStr(p.slug)}, ${escapeStr(p.name)}, ${escapeStr(p.division)}, ${escapeStr(p.division_slug)}, ${escapeStr(p.category)}, ${escapeStr(p.short_description)}, ${escapeStr(p.moq)}, ${escapeStr(p.lead_time)}, ${escapeArr(p.images)}, ${p.is_new}, ${p.is_offer}, ${escapeStr(p.offer_label)}, ${escapeStr(p.offer_start || null)}, ${escapeStr(p.offer_end || null)}, ${escapeStr(p.offer_terms || null)}, ${p.featured}, ${p.custom_branding || false}, ${escapeArr(p.certifications || [])}, ${escapeJson(p.specifications)}, ${escapeArr(p.suitable_for || [])}, ${escapeArr(p.tags || [])}, ${escapeStr(p.brand_slug || null)}
  ) ON CONFLICT (slug) DO NOTHING;\n`;
});

// 4. Seed Enquiries (just insert, no conflict resolution on id since they are random or we can specify the exact id if we alter schema, wait the schema says id UUID PRIMARY KEY DEFAULT gen_random_uuid(). I will just insert without ID.)
sql += `\n-- Seed Enquiries\n`;
INITIAL_ENQUIRIES.forEach(e => {
  sql += `INSERT INTO public.enquiries (
    name, company, country, email, phone, product_interest, status, priority, message, created_at, assigned_to
  ) VALUES (
    ${escapeStr(e.company)}, ${escapeStr(e.company)}, ${escapeStr(e.country)}, ${escapeStr(e.email)}, ${escapeStr(e.phone)}, ${escapeArr([e.products])}, ${escapeStr(e.status)}, ${escapeStr(e.priority)}, ${escapeStr(e.message)}, ${escapeStr(e.date)}, ${escapeStr(e.rep)}
  );\n`;
});

// 5. Seed Media
sql += `\n-- Seed Media\n`;
INITIAL_MEDIA.forEach(m => {
  sql += `INSERT INTO public.media (
    url, filename, mime_type, created_at
  ) VALUES (
    ${escapeStr(m.image)}, ${escapeStr(m.title)}, ${escapeStr(m.type)}, ${escapeStr(m.uploadedAt)}
  );\n`;
});


fs.appendFileSync('supabase_schema.sql', sql);
console.log('Successfully appended schema and seed data to supabase_schema.sql');
