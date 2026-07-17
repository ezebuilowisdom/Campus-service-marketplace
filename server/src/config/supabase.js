const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
  console.warn('⚠️  Warning: Supabase keys are not set or are placeholders in server/.env. Please configure them for full database connectivity.');
}

const supabase = createClient(supabaseUrl || 'https://placeholder-project.supabase.co', supabaseAnonKey || 'placeholder');
const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co', 
  supabaseServiceKey || 'placeholder',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

module.exports = {
  supabase,
  supabaseAdmin
};
