import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Backend Validations
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // 2. Check if user already exists
    const { data: existingUser } = await supabase
      .from('user_bots')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ 
        error: 'Account already exists with this email. Please login.' 
      }, { status: 409 });
    }

    // 3. Hash Password & Generate 5-Digit OTP
    const password_hash = await bcrypt.hash(password, 10);
    const otp = Math.floor(10000 + Math.random() * 90000).toString(); // Secure 5 digits
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 mins limit

    // 4. Insert into DB (Providing defaults for NOT NULL columns)
    const { error: dbError } = await supabase.from('user_bots').insert([{
      email,
      password_hash,
      otp,
      otp_expires_at: expiresAt,
      business_name: name,
      bot_name: `${name} Assistant`, // Default fallback name
      business_details: 'Pending setup...', // Default fallback context
    }]);

    if (dbError) {
      console.error("Database Error:", dbError);
      throw new Error('Failed to create account. Please try again later.');
    }

    // 5. Send Email via Brevo REST API
    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY!
      },
      body: JSON.stringify({
        sender: { 
          name: "chat11 Security", 
          email: process.env.BREVO_SENDER_EMAIL! // e.g., "support@chat11.com"
        },
        to: [{ email, name }],
        subject: "Verify your chat11 account",
        htmlContent: `
          <div style="font-family: sans-serif; background: #0A0A0A; padding: 40px 20px; color: #fff; text-align: center; border-radius: 8px;">
            <h2 style="margin-bottom: 10px;">Welcome to chat11!</h2>
            <p style="color: #888; margin-bottom: 30px;">Your 5-digit verification code is valid for 10 minutes.</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 20px auto; padding: 20px; background: #111; border: 1px solid #333; display: inline-block; border-radius: 8px;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
          </div>
        `
      })
    });

    if (!brevoRes.ok) {
      const brevoError = await brevoRes.json();
      console.error("Brevo API Error:", brevoError);
      throw new Error('Account created, but failed to send OTP email.');
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}