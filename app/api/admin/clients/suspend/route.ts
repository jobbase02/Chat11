import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { userId, type, isSuspended } = await req.json();

    if (!userId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const updatePayload: any = {};
    if (type === 'bot') {
      updatePayload.is_bot_suspended = isSuspended;
    } else if (type === 'account') {
      updatePayload.is_account_suspended = isSuspended;
    }

    const { error } = await supabase
      .from('user_bots')
      .update(updatePayload)
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: `Status updated successfully` });
  } catch (error: any) {
    console.error("Suspend Action Error:", error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}