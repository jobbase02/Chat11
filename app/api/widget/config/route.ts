import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const apiKey = searchParams.get('apiKey');

    if (!apiKey) return NextResponse.json({ error: 'API Key missing' }, { status: 400, headers: corsHeaders });

    // 🔥 Added bot_header_text_color and suggested_questions to the select query
    const { data: bot, error } = await supabase
      .from('user_bots')
      .select(`
        bot_name, theme_color, status, is_bot_suspended,
        widget_bg_color, widget_icon_color, bot_header_color, 
        bot_bubble_color, widget_icon_name, bot_avatar_name,
        bot_header_text_color, suggested_questions
      `)
      .eq('bot_api_key', apiKey)
      .single();

    if (error || !bot) return NextResponse.json({ error: 'Invalid API Key' }, { status: 404, headers: corsHeaders });
    if (bot.status !== 'approved' || bot.is_bot_suspended) {
      return NextResponse.json({ error: 'Bot is inactive' }, { status: 403, headers: corsHeaders });
    }

    return NextResponse.json({ 
      success: true, 
      config: { 
        botName: bot.bot_name, 
        themeColor: bot.theme_color,
        widgetBgColor: bot.widget_bg_color,
        widgetIconColor: bot.widget_icon_color,
        botHeaderColor: bot.bot_header_color,
        botBubbleColor: bot.bot_bubble_color,
        widgetIconName: bot.widget_icon_name,
        botAvatarName: bot.bot_avatar_name,
        // 🔥 Naye variables add kiye yahan pe
        botHeaderTextColor: bot.bot_header_text_color || '#FFFFFF',
        suggestedQuestions: bot.suggested_questions || []
      } 
    }, { headers: corsHeaders });
  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers: corsHeaders });
  }
}