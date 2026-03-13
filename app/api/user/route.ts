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

    // 🔥 Added bot_header_text_color and suggested_questions to the select query
    const { data: user, error } = await supabase
      .from('user_bots')
      .select('bot_name, business_name, business_details, theme_color, status, bot_api_key, key_requested, widget_bg_color, widget_icon_color, bot_header_color, bot_bubble_color, widget_icon_name, bot_avatar_name, bot_header_text_color, suggested_questions')
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

    // 🔥 IF ACTION IS "REQUEST_KEY", SET key_requested TO TRUE (Untouched)
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

    // NORMAL SAVE: Update Bot Details with NEW CUSTOMIZATION FIELDS
    const { 
      bot_name, 
      business_details, 
      theme_color,
      widget_bg_color,
      widget_icon_color,
      bot_header_color,
      bot_bubble_color,
      widget_icon_name,
      bot_avatar_name,
      bot_header_text_color, // Naya field
      suggested_questions    // Naya field (Array aayega frontend se)
    } = body;

    const { error } = await supabase
      .from('user_bots')
      .update({
        bot_name,
        business_details,
        theme_color,
        widget_bg_color,
        widget_icon_color,
        bot_header_color,
        bot_bubble_color,
        widget_icon_name,
        bot_avatar_name,
        bot_header_text_color, // DB me save
        suggested_questions    // DB me as JSONB save hoga automatically
      })
      .eq('email', decodeURIComponent(email));

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, message: 'Saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}