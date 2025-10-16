import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const referer = request.headers.get('referer');
  
  // Define protected routes
  const protectedRoutes = ['/account', '/admin'];
  const adminRoutes = ['/admin'];
  const authRoutes = ['/login', '/signup'];
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    pathname === route
  );
  
  if (isProtectedRoute) {
    // Let client-side auth handle all protection
    // This prevents cookie domain issues and timing problems
    console.log(`🔍 Protected route accessed: ${pathname} - letting client-side auth handle protection`);
  }
  
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};