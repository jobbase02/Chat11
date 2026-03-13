import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname

  // ==========================================
  // 1. ADMIN AUTH LOGIC (NEW)
  // ==========================================
  if (path.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session')?.value;

    // A. Agar admin already logged in hai aur /admin/auth par ja raha hai
    if (path === '/admin/auth') {
      if (adminSession) {
        url.pathname = '/admin/dashboard';
        return NextResponse.redirect(url);
      }
      return NextResponse.next(); // Not logged in, let them see login page
    }

    // B. Agar koi bina login kiye /admin ya /admin/* par aane ki koshish kare
    if (!adminSession) {
      url.pathname = '/admin/auth';
      return NextResponse.redirect(url);
    }

    // C. Agar logged in hai aur exact '/admin' type kare, toh dashboard bhej do
    if (path === '/admin') {
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }

    // Baaki /admin/dashboard wagerah ke liye pass hone do
    return NextResponse.next();
  }


  // ==========================================
  // 2. REGULAR USER AUTH LOGIC (UNTOUCHED)
  // ==========================================
  const session = request.cookies.get('chat11_session')?.value

  // A. Protected Route: Agar user logged in NAHI hai aur /dashboard pe ja raha hai
  if (path.startsWith('/dashboard') && !session) {
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // B. Auth Route: Agar user ALREADY logged in hai aur /auth (ya login/signup) pe ja raha hai
  if (path.startsWith('/auth') && session) {
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// 3. Matcher: Kin paths pe middleware chalega
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}