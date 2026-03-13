import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { apiKey, messages } = await req.json();

    if (!apiKey || !messages) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders });
    }

    // Fetch DB context securely
    const { data: bot, error } = await supabase
      .from('user_bots')
      .select('bot_name, business_name, business_details, status')
      .eq('bot_api_key', apiKey)
      .single();

    if (error || !bot || bot.status !== 'approved') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403, headers: corsHeaders });
    }

    // Call Gemini (Hidden from client)
    const systemInstruction = `You are a helpful customer support assistant named ${bot.bot_name} working for ${bot.business_name}.
    Context to follow strictly: ${bot.business_details}
    Rules: Keep answers concise, human-like, and strictly related to the business context.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction });

    const formattedHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));
    
    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(messages[messages.length - 1].content);

    return NextResponse.json({ success: true, reply: result.response.text() }, { headers: corsHeaders });

  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500, headers: corsHeaders });
  }
}