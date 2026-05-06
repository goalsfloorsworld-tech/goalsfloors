import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
const supabaseAdmin = createClient(supabaseUrl, serviceKey);

async function testFetch() {
  console.log('--- Testing with ANON KEY (No Filter) ---');
  const { data: anonData, error: anonError } = await supabase
    .from('blogs')
    .select('*');

  if (anonError) {
    console.error('Anon Error:', anonError);
  } else {
    console.log('Anon Key found blogs:', anonData.length);
  }

  console.log('\n--- Testing with SERVICE ROLE KEY (Bypass RLS) ---');
  const { data: adminData, error: adminError } = await supabaseAdmin
    .from('blogs')
    .select('*');

  if (adminError) {
    console.error('Admin Error:', adminError);
  } else {
    console.log('Admin Key found blogs:', adminData.length);
    console.log('Admin Data sample:', JSON.stringify(adminData.slice(0, 2), null, 2));
  }
}

testFetch();
