import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Testing Supabase Client connection...');
console.log('URL:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

try {
  const { data, error } = await supabase.from('fleet').select('*').limit(1);
  if (error) {
    console.error('❌ Supabase API error:', error.message);
  } else {
    console.log('✅ Supabase client successful! Fleet count:', data.length);
    console.log('Data:', data);
  }
} catch (err) {
  console.error('❌ Supabase client exception:', err.message);
}
