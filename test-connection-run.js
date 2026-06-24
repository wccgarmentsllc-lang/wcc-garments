const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read .env.local manually
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing keys. URL:", supabaseUrl, "Key:", supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Checking DB tables...");
  const { data: catData, error: catErr } = await supabase.from('categories').select('slug, name');
  const { data: prodData, error: prodErr } = await supabase.from('products').select('slug, name, division, brand_slug');
  const { data: brandData, error: brandErr } = await supabase.from('brands').select('slug, name');
  const { data: contentData, error: contentErr } = await supabase.from('website_content').select('key');

  console.log("Categories error:", catErr, "Data:", catData);
  console.log("Products error:", prodErr, "Count:", prodData ? prodData.length : 0);
  if (prodData) {
    console.log("First 3 Products:", prodData.slice(0, 3));
  }
  console.log("Brands error:", brandErr, "Data:", brandData);
  console.log("Website Content error:", contentErr, "Data:", contentData);
}

test();
