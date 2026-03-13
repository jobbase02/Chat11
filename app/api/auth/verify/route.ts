import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email, otp, action } = await req.json();

    // --- RESEND OTP LOGIC ---
    if (action === 'RESEND') {
      const newOtp = Math.floor(10000 + Math.random() * 90000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      
      const { data: user } = await supabase.from('user_bots').select('business_name').eq('email', email).single();

      await supabase.from('user_bots')
        .update({ otp: newOtp, otp_expires_at: expiresAt })
        .eq('email', email);
        
      await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY!
        },
        body: JSON.stringify({
          sender: { name: "chat11 Security", email: process.env.BREVO_SENDER_EMAIL! },
          to: [{ email, name: user?.business_name || 'User' }],
          subject: "Your New Verification Code",
          htmlContent: `
            <div style="background: #0A0A0A; padding: 30px; color: #fff; text-align: center;">
              <h2>New Verification Code</h2>
              <div style="font-size: 36px; font-weight: bold; margin: 20px 0; padding: 15px; background: #111;">${newOtp}</div>
            </div>
          `
        })
      });

      return NextResponse.json({ success: true, message: 'New OTP sent' });
    }

    // --- VERIFY OTP LOGIC ---
    const { data: user, error } = await supabase
      .from('user_bots')
      .select('id, otp, otp_expires_at')
      .eq('email', email)
      .single();

    if (error || !user || !user.otp) {
      return NextResponse.json({ error: 'No pending verification found.' }, { status: 400 });
    }

    if (new Date(user.otp_expires_at) < new Date()) {
      return NextResponse.json({ error: 'OTP has expired. Please request a new one.' }, { status: 400 });
    }

    if (user.otp !== otp) {
      return NextResponse.json({ error: 'Incorrect OTP.' }, { status: 400 });
    }

    // Success! Clear OTP fields AND set verified
    await supabase.from('user_bots')
      .update({ 
        otp: null, 
        otp_expires_at: null,
        is_email_verified: true 
      })
      .eq('id', user.id);

    // 🔥 CREATE RESPONSE
    const response = NextResponse.json({ success: true, message: 'Account verified successfully!' });

    // 🔥 SET COOKIE DIRECTLY FROM SERVER
    response.cookies.set({
      name: 'chat11_session',
      value: email,
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      sameSite: 'lax',
    });

    return response;

  } catch (error: any) {
    console.error("Verify API Error:", error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}