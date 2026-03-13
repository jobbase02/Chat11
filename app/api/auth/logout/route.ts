import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    // Clear the cookie from the server side by setting its expiration to the past
    response.cookies.set({
      name: 'chat11_session',
      value: '',
      path: '/',
      expires: new Date(0), // Expire immediately
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}