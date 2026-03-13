import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const { data: user, error } = await supabase
      .from('user_bots')
      .select('id, password_hash, is_email_verified, is_account_suspended')
      .eq('email', email)
      .single();

    if (error || !user || !user.password_hash) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (user.is_account_suspended) {
      return NextResponse.json({ error: 'Account is suspended. Contact support.' }, { status: 403 });
    }

    if (!user.is_email_verified) {
      return NextResponse.json({ error: 'Please verify your email first using the signup page.' }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // 🔥 CREATE RESPONSE
    const response = NextResponse.json({ success: true, message: 'Logged in successfully' });

    // 🔥 SET COOKIE DIRECTLY FROM SERVER (Middleware will read this)
    response.cookies.set({
      name: 'chat11_session',
      value: email,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax',
    });

    return response;

  } catch (err: any) {
    console.error("Login API Error:", err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}