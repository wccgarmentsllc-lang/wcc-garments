const { createClient } = require('@supabase/supabase-js');

async function run() {
  const url = 'https://aouhgpeonexfofllurlh.supabase.co';
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdWhncGVvbmV4Zm9mbGx1cmxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDc0OTExNiwiZXhwIjoyMDk2MzI1MTE2fQ.dd4tof5U6qSHTgaTzFbiKmOgMomHVeTCQtXANMHGATE';
  const supabase = createClient(url, key);

  const { data, error } = await supabase
    .from('website_content')
    .select('key, content');

  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('KEYS:', data.map(d => d.key));
    console.log('CONTENT:', JSON.stringify(data, null, 2));
  }
}

run();
