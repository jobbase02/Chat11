import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Fetch User Data
export async function GET() {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get('chat11_session')?.value;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: user, error } = await supabase
      .from('user_bots')
      .select('bot_name, business_name, business_details, theme_color, status, bot_api_key, key_requested')
      .eq('email', decodeURIComponent(email))
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Update User Data OR Request Key
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get('chat11_session')?.value;

    if (!email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    // 🔥 IF ACTION IS "REQUEST_KEY", SET key_requested TO TRUE
    if (body.action === 'REQUEST_KEY') {
      const { error } = await supabase
        .from('user_bots')
        .update({ 
          key_requested: true,
          status: 'reviewing' // Status bhi update kar dete hain UI ke liye
        })
        .eq('email', decodeURIComponent(email));

      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true, message: 'Key requested successfully' });
    }

    // NORMAL SAVE: Update Bot Details
    const { bot_name, business_details, theme_color } = body;
    const { error } = await supabase
      .from('user_bots')
      .update({
        bot_name,
        business_details,
        theme_color
      })
      .eq('email', decodeURIComponent(email));

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, message: 'Saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}