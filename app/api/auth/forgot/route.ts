import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Check if email exists
    const { data: user } = await supabase.from('user_bots').select('id, business_name').eq('email', email).single();
    if (!user) {
      // Security practice: Don't reveal if email exists or not to prevent scanning
      return NextResponse.json({ success: true, message: 'If email exists, an OTP was sent.' });
    }

    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase.from('user_bots')
      .update({ otp, otp_expires_at: expiresAt })
      .eq('email', email);

    // Send via Brevo
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!
      },
      body: JSON.stringify({
        sender: { name: "chat11 Support", email: process.env.BREVO_SENDER_EMAIL! },
        to: [{ email, name: user.business_name }],
        subject: "Password Reset Code",
        htmlContent: `
          <div style="background: #000; color: #fff; padding: 30px; border-radius: 8px; text-align: center;">
            <h2>Password Reset</h2>
            <p style="color: #888;">Use this 5-digit code to reset your password. Valid for 10 minutes.</p>
            <div style="font-size: 32px; font-weight: bold; background: #111; padding: 15px; border-radius: 8px; margin-top: 20px;">
              ${otp}
            </div>
          </div>
        `
      })
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}