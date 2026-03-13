import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: clients, error } = await supabase
      .from('user_bots')
      .select('id, email, bot_name, business_name, is_account_suspended, is_bot_suspended, is_email_verified, approved_at, status')
      .neq('status', 'pending') // Pending walo ko hata diya
      .order('approved_at', { ascending: false }); // Newest first

    if (error) throw error;

    return NextResponse.json({ success: true, clients: clients || [] });
  } catch (error: any) {
    console.error("Fetch Clients Error:", error);
    return NextResponse.json({ error: 'Failed to fetch clients' }, { status: 500 });
  }
}