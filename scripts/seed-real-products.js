const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Parse .env.local manually
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
  if (match) {
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const REAL_PRODUCTS = [
  {
    name: 'Egyptian Cotton Shirt',
    slug: 'egyptian-cotton-shirt',
    division: 'Garments',
    division_slug: 'garments',
    category: 'Formal Shirts',
    short_description: 'Premium export-grade 100% Egyptian cotton formal shirt with pristine executive weight and stitch finish.',
    moq: '50 Units',
    lead_time: '12–25 Days',
    images: ['/images/products/egyptian_cotton_shirt.png'],
    brand_slug: 'treasure',
    is_new: true,
    featured: true,
    custom_branding: true,
    specifications: {
      fabric: '100% Giza Egyptian Cotton',
      weight: '140 GSM',
      weave: 'Premium Twill / Herringbone',
      fit: 'Executive Slim / Classic Fit',
      collar: 'Spread Collar (Removable Stays)'
    }
  },
  {
    name: 'Industrial Cargo Work Pants',
    slug: 'industrial-cargo-work-pants',
    division: 'Uniforms',
    division_slug: 'uniforms',
    category: 'Industrial & PPE',
    short_description: 'Heavy-duty cargo workpants with reinforced triple-stitched seams and multi-functional utility pockets.',
    moq: '100 Units',
    lead_time: '15–30 Days',
    images: ['/images/products/cargo_work_pants.png'],
    is_new: true,
    featured: true,
    custom_branding: true,
    specifications: {
      fabric: '65% Polyester / 35% Cotton Blend ripstop',
      weight: '240 GSM',
      features: 'Water-repellent finish, reinforced knees',
      pockets: '8 pocket tactical configuration'
    }
  },
  {
    name: 'Rustic Copper Moscow Mule Mug',
    slug: 'rustic-copper-moscow-mule-mug',
    division: 'Hospitality',
    division_slug: 'hospitality',
    category: 'Barware Products',
    short_description: 'Premium double-walled rustic copper Moscow Mule cocktail mug for upscale hospitality bars and corporate gifts.',
    moq: '50 Units',
    lead_time: '12–20 Days',
    images: ['/images/products/copper_moscow_mule_mi5035.png'],
    brand_slug: null,
    is_new: true,
    featured: true,
    custom_branding: true,
    specifications: {
      material: 'Pure Solid Copper / Stainless Steel lining',
      capacity: '16 oz (475 ml)',
      finish: 'Rustic hammered texture',
      care: 'Hand-wash recommended'
    }
  },
  {
    name: 'Luxury Satin Hotel Bed Linen',
    slug: 'luxury-satin-hotel-bed-linen',
    division: 'Home',
    division_slug: 'home',
    category: 'Bedsheets',
    short_description: 'Fine 600TC cotton satin hotel-grade bed sheets and pillowcases engineered for maximum wash durability and luxurious feel.',
    moq: '100 Units',
    lead_time: '10–30 Days',
    images: ['/images/products/hotel_bed_linen.png'],
    brand_slug: null,
    is_new: true,
    featured: true,
    custom_branding: true,
    specifications: {
      material: '100% Long-Staple Combed Cotton',
      thread_count: '600 Thread Count (TC)',
      weave: 'Sateen finish',
      durability: 'Commercial laundry certified (200+ wash cycles)'
    }
  },
  {
    name: 'Premium Arabian Oud Perfume',
    slug: 'premium-arabian-oud-perfume',
    division: 'Fragrance',
    division_slug: 'fragrance',
    category: 'Arabian Oud',
    short_description: 'Rich authentic Arabian Oud perfume oil formulation housed in a luxury gold-plated glass vial.',
    moq: '100 Units',
    lead_time: '10–16 Days',
    images: ['/images/products/arabian_oud_perfume.png'],
    is_new: true,
    featured: true,
    custom_branding: true,
    specifications: {
      concentration: 'Eau de Parfum / Pure Perfume Oil extract',
      volume: '100 ml / Custom vial sizing',
      notes: 'Cambodian Oud, Amber, Sandalwood, Turkish Rose',
      packaging: 'Premium velvet lined presentation box'
    }
  },
  {
    name: 'Triply Stainless Steel Cookware Set',
    slug: 'triply-stainless-steel-cookware-set',
    division: 'Households',
    division_slug: 'households',
    category: 'Triply Cookware',
    short_description: 'Artisan-crafted professional grade triple-layer stainless steel cookware set for optimal heat distribution.',
    moq: '100 Units',
    lead_time: '10–20 Days',
    images: ['/images/products/cookware-17pc.png'],
    brand_slug: null,
    is_new: true,
    featured: true,
    custom_branding: true,
    specifications: {
      material: 'Tri-Ply Stainless Steel (SS304 + Aluminum Core + SS430)',
      finish: 'Mirror exterior, brushed interior',
      induction: 'Compatible with all stovetops including Induction',
      contents: '17-piece premium chef collection'
    }
  }
];

async function run() {
  console.log('Purging existing products...');
  await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('Inserting real products...');
  const { data, error } = await supabase
    .from('products')
    .insert(REAL_PRODUCTS)
    .select();

  if (error) {
    console.error('Error seeding real products:', error);
  } else {
    console.log(`Successfully seeded ${data.length} real products!`);
    console.log(data.map(p => ` - [${p.division}] ${p.name} (${p.slug})`));
  }
}

run();
