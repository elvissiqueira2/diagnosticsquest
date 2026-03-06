import { getSupabase } from './supabaseClient.js';

export async function handler(event) {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const name = (event.queryStringParameters?.name || '').trim();
    if (!name) return { statusCode: 400, body: 'Missing name' };

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('players')
      .select('player_name,total_score,current_level,badges_earned,challenges_completed,updated_at')
      .eq('player_name', name)
      .maybeSingle();

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player: data || null })
    };
  } catch (e) {
    console.error('get-player error', e);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
}