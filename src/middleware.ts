import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
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
    
    if (!sessionCookie || !sessionCookie.value) {
      // Redirect to login page if not authenticated
      const loginUrl = new URL('/login', request.url);
      // Add the current path as a redirect parameter so user can return after login
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
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