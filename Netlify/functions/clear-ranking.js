import { getSupabase } from './supabaseClient.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const adminKey = process.env.ADMIN_KEY;
    const provided = event.headers['x-admin-key'] || event.headers['X-Admin-Key'];
    if (!adminKey || provided !== adminKey) return { statusCode: 403, body: 'Forbidden' };

    const supabase = getSupabase();
    const { error } = await supabase.from('players').delete().neq('player_name', '');
    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    console.error('clear-ranking error', e);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
}