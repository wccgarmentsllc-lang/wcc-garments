import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function testInsert() {
  console.log("Attempting to insert test email...")
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email: 'test_insert@example.com' }])
    .select()

  if (error) {
    console.error("Supabase Error:", JSON.stringify(error, null, 2))
  } else {
    console.log("Insert Success:", data)
  }
}

testInsert()
