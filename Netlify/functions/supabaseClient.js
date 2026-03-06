import { createClient } from '@supabase/supabase-js';

let _client;

export function getSupabase() {
  if (_client) return _client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role
  if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  // Service role só no back-end (Netlify Function). Nunca use no front!
  _client = createClient(url, key, {
    auth: { persistSession: false },
    global: { fetch }
  });
  return _client;
}