
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'admin-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow requests to /admin/login to pass through without checks
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // Protect all other routes under /admin
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(COOKIE_NAME);

    if (!sessionCookie || sessionCookie.value !== 'true') {
      // Redirect to login page if the cookie is not present or invalid
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}
