import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const protectedPrefixes = [
    '/dashboard',
    '/feedback',
    '/memory',
    '/memory-graph',
    '/insights',
    '/trends',
    '/reports',
    '/admin',
    '/workspace',
    '/integrations',
    '/settings',
  ];

  const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

  if (isProtected) {
    const token = req.cookies.get('sb-access-token')?.value;
    const bypassAuth = process.env.NEXT_PUBLIC_ENV === 'development' || !process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!token && !bypassAuth) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/admin')) {
      const userRole = req.cookies.get('user-role')?.value || 'user';
      if (userRole !== 'admin' && userRole !== 'owner' && !bypassAuth) {
        const homeUrl = new URL('/dashboard', req.url);
        return NextResponse.redirect(homeUrl);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|auth_illustration.png).*)',
  ],
};
