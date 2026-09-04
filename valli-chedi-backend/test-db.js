import { supabaseAdmin } from './src/config/supabase.js';

async function test() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabaseAdmin.from('users').select('*').limit(5);
  console.log('Users Data:', data);
  if (error) {
    console.log('Error:', error);
  }
}

test();
