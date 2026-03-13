import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ 
        success: true, 
        message: 'Admin logged out successfully' 
    });

    // Server-side se admin cookie ko expire (delete) kar rahe hain
    response.cookies.set({
      name: 'admin_session',
      value: '',
      path: '/',
      expires: new Date(0), // Sets expiration to the past
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}