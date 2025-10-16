import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const referer = request.headers.get('referer');
  const isRecentLogin = searchParams.get('_recent_login') === 'true';
  
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
    // Check for authentication cookie/session
    const sessionCookie = request.cookies.get('better-auth.session_token') || 
                         request.cookies.get('session');
    
    // Debug logging for production issues
    console.log(`[Middleware] Checking route: ${pathname}`);
    console.log(`[Middleware] Referer: ${referer}`);
    console.log(`[Middleware] Recent login flag: ${isRecentLogin}`);
    console.log(`[Middleware] Session cookie exists: ${!!sessionCookie}`);
    console.log(`[Middleware] Session cookie value: ${sessionCookie?.value ? 'present' : 'missing'}`);
    
    // Check if this is a redirect from login page (might be a timing issue)
    const isFromLogin = referer && referer.includes('/login');
    
    // Check for any authentication-related headers or cookies
    const hasAuthHeaders = request.headers.get('authorization') || 
                          request.headers.get('x-auth-token');
    
    if (!sessionCookie || !sessionCookie.value) {
      // If coming from login page, has auth headers, or is recent login, allow access temporarily
      if (isFromLogin || hasAuthHeaders || isRecentLogin) {
        console.log(`[Middleware] Allowing access temporarily (from login: ${isFromLogin}, auth headers: ${!!hasAuthHeaders}, recent login: ${isRecentLogin})`);
        // Allow access but let client-side auth handle the actual protection
        return NextResponse.next();
      }
      
      console.log(`[Middleware] Redirecting to login for protected route: ${pathname}`);
      // Redirect to login page if not authenticated
      const loginUrl = new URL('/login', request.url);
      // Add the current path as a redirect parameter so user can return after login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    console.log(`[Middleware] Allowing access to protected route: ${pathname}`);
    // For admin routes, we'll let the client-side AuthGuard handle role checking
    // since we can't easily verify the user's role from the cookie in middleware
  }
  
  // If this is a recent login redirect, clean up the query parameter
  if (isRecentLogin) {
    const cleanUrl = new URL(request.url);
    cleanUrl.searchParams.delete('_recent_login');
    return NextResponse.redirect(cleanUrl);
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