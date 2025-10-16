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
    // Check for authentication cookie/session
    const sessionCookie = request.cookies.get('better-auth.session_token') || 
                         request.cookies.get('session') ||
                         request.cookies.get('auth_token');
    
    // Check if this is a redirect from login page (might be a timing issue)
    const isFromLogin = referer && referer.includes('/login');
    
    // Check for any authentication-related headers or cookies
    const hasAuthHeaders = request.headers.get('authorization') || 
                          request.headers.get('x-auth-token');

    console.log("======Middleware====== Session Cookie: ", sessionCookie)
    console.log("======Middleware====== Session Cookie Value: ", sessionCookie?.value)
    console.log("======Middleware====== Session Cookie Exists: ", !!sessionCookie)
    console.log("======Middleware====== Session Cookie Value Exists: ", !!sessionCookie?.value)
    console.log("======Middleware====== Session Cookie Value: ", sessionCookie?.value)
    console.log("======Middleware====== Session Cookie Value: ", sessionCookie?.value)
    
    if (!sessionCookie || !sessionCookie.value) {
      // If coming from login page or has auth headers, allow access temporarily
      if (isFromLogin || hasAuthHeaders) {
        console.log(`[Middleware] Allowing access temporarily (from login: ${isFromLogin}, auth headers: ${!!hasAuthHeaders})`);
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