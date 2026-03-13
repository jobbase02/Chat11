import { supabase } from "./supabase";

export async function validateBot(botKey: string) {
  const { data, error } = await supabase
    .from('user_bots')
    .select('status, is_suspended, business_details')
    .eq('bot_api_key', botKey)
    .single();

  if (error || !data) return { valid: false, error: 'Invalid Key' };
  if (data.is_suspended) return { valid: false, error: 'Suspended' };
  if (data.status !== 'approved') return { valid: false, error: 'Pending' };

  return { valid: true, context: data.business_details };
}