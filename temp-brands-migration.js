const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('--')) return;
  const equalIdx = trimmed.indexOf('=');
  if (equalIdx > 0) {
    const key = trimmed.slice(0, equalIdx).trim();
    let val = trimmed.slice(equalIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    env[key] = val;
  }
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  console.log('Step 1: Checking if division_slug column already exists...');
  
  // Try to select division_slug - if it works, column exists
  const { data: testData, error: testError } = await supabase
    .from('brands')
    .select('id, division_slug')
    .limit(1);

  if (testError && testError.message.includes('division_slug')) {
    console.log('Column does not exist yet. Please run the following SQL in the Supabase SQL Editor:\n');
    console.log('------------------------------------------------------------');
    console.log(fs.readFileSync(path.join(__dirname, 'supabase/migrations/brands_division_slug.sql'), 'utf8'));
    console.log('------------------------------------------------------------');
    console.log('\nAfter running that SQL, re-run this script to verify.');
    return;
  }

  if (testError) {
    console.error('Unexpected error:', testError.message);
    return;
  }

  // Column exists — check if data is already backfilled
  console.log('Column exists! Checking backfill...');
  
  // Backfill via UPDATE using Supabase client
  const backfill = [
    { slugs: ['treasure', 'vandegraff', 'tom-jack'], division: 'garments' },
    { slugs: ['horeca24h'], division: 'hospitality' },
    { slugs: ['aanya-homecraft'], division: 'households' },
  ];

  for (const entry of backfill) {
    for (const slug of entry.slugs) {
      const { error } = await supabase
        .from('brands')
        .update({ division_slug: entry.division })
        .eq('slug', slug);
      if (error) {
        console.warn(`  Warning updating ${slug}:`, error.message);
      } else {
        console.log(`  ✓ ${slug} → ${entry.division}`);
      }
    }
  }

  // Verify final state
  const { data, error } = await supabase
    .from('brands')
    .select('name, slug, division_slug')
    .order('division_slug');

  if (error) {
    console.error('Verification error:', error.message);
  } else {
    console.log('\nFinal state:');
    data.forEach(b => console.log(`  ${(b.division_slug || 'UNSET').padEnd(15)} | ${b.name} (${b.slug})`));
    console.log('\n✅ Done!');
  }
}

run().catch(console.error);
