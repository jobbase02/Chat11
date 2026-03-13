import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    const { data: user, error } = await supabase
      .from('user_bots')
      .select('id, otp, otp_expires_at')
      .eq('email', email)
      .single();

    if (error || !user || !user.otp) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }

    if (new Date(user.otp_expires_at) < new Date()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Incorrect OTP.' }, { status: 400 });
    }

    // Hash new password
    const password_hash = await bcrypt.hash(newPassword, 10);

    // Update DB & clear OTP
    await supabase.from('user_bots')
      .update({ 
        password_hash, 
        otp: null, 
        otp_expires_at: null 
      })
      .eq('id', user.id);

    return NextResponse.json({ success: true, message: 'Password updated successfully' });

  } catch (err: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}