import { getSupabase } from './supabaseClient.js';

export async function handler(event) {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const limit = Math.min(parseInt(event.queryStringParameters?.limit || '10', 10), 100);

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('players')
      .select('player_name,total_score,current_level,challenges_completed,badges_earned,updated_at')
      .order('total_score', { ascending: false })
      .order('updated_at', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ players: data || [] })
    };
  } catch (e) {
    console.error('get-leaderboard error', e);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
}