import { getSupabase } from './supabaseClient.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  try {
    const payload = JSON.parse(event.body || '{}');
    const name = (payload.player_name || '').trim();
    const total = Number.isFinite(payload.total_score) ? payload.total_score : 0;
    const level = Number.isFinite(payload.current_level) ? payload.current_level : 1;
    const challenges = Number.isFinite(payload.challenges_completed) ? payload.challenges_completed : 0;
    const badges = (payload.badges_earned || '').toString();

    if (!name) return { statusCode: 400, body: 'Invalid player_name' };

    const supabase = getSupabase();
    // UPSERT por player_name (unique)
    const { error } = await supabase
      .from('players')
      .upsert({
        player_name: name,
        total_score: total,
        current_level: level,
        challenges_completed: challenges,
        badges_earned: badges,
        updated_at: new Date().toISOString()
      }, { onConflict: 'player_name' });

    if (error) throw error;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    console.error('save-player error', e);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
}