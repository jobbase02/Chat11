import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, username, email, password, role } = await req.json();

    // 1. Basic Validation
    if (!name || !username || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // 2. Hash Password Securely (Compatible with pgcrypto)
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // 3. Insert into Supabase Table
    const { error } = await supabase
      .from('admins')
      .insert([
        { 
          name, 
          username, 
          email, 
          password_hash, 
          role 
        }
      ]);

    // 4. Handle Errors (like duplicate email/username)
    if (error) {
      if (error.code === '23505') { // PostgreSQL unique constraint violation code
        return NextResponse.json({ error: 'Email or Username already exists!' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Admin account created successfully!' });

  } catch (error: any) {
    console.error("Create Admin Error:", error);
    return NextResponse.json({ error: 'Failed to create admin account' }, { status: 500 });
  }
}