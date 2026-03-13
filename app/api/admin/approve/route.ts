import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    // Generate a secure, unique API key (e.g., c11_a8f3b2c1...)
    const newApiKey = 'c11_' + crypto.randomUUID().replace(/-/g, '').substring(0, 16);

    const { error } = await supabase
      .from('user_bots')
      .update({
        status: 'approved',
        key_requested: false,
        bot_api_key: newApiKey,
        approved_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Bot Approved & API Key Generated!' });

  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to approve bot' }, { status: 500 });
  }
}