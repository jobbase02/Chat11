import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Fetch Stats
    const { count: totalUsers } = await supabase.from('user_bots').select('*', { count: 'exact', head: true });
    const { count: pendingRequests } = await supabase.from('user_bots').select('*', { count: 'exact', head: true }).eq('key_requested', true);
    const { count: activeBots } = await supabase.from('user_bots').select('*', { count: 'exact', head: true }).eq('status', 'approved').eq('is_bot_suspended', false);
    const { count: suspendedUsers } = await supabase.from('user_bots').select('*', { count: 'exact', head: true }).eq('is_account_suspended', true);

    // 2. Fetch Pending Users Data for Action Required
    const { data: pendingUsers, error } = await supabase
      .from('user_bots')
      .select('id, email, bot_name, business_name, business_details, requested_at')
      .eq('key_requested', true)
      .order('requested_at', { ascending: true }); // Oldest first

    if (error) throw error;

    return NextResponse.json({
      success: true,
      stats: {
        total: totalUsers || 0,
        pending: pendingRequests || 0,
        active: activeBots || 0,
        suspended: suspendedUsers || 0
      },
      pendingUsers: pendingUsers || []
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}