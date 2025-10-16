"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = false,
  requireAdmin = false,
  redirectTo,
}) => {
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);

  // Simple, single-purpose redirect logic
  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;
    
    // Don't redirect multiple times
    if (hasRedirected) return;

    console.log("🔍 AuthGuard check:", { 
      isLoading, 
      isAuthenticated, 
      isAdmin, 
      requireAuth, 
      requireAdmin, 
      pathname 
    });

    // Check authentication requirements
    if (requireAuth && !isAuthenticated) {
      console.log("❌ Auth required but not authenticated, redirecting to login");
      const loginUrl = redirectTo || "/login";
      const redirectParam = encodeURIComponent(pathname);
      setHasRedirected(true);
      router.push(`${loginUrl}?redirect=${redirectParam}`);
      return;
    }

    // Check admin requirements
    if (requireAdmin && (!isAuthenticated || !isAdmin)) {
      console.log("❌ Admin required but not admin, redirecting");
      setHasRedirected(true);
      router.push(redirectTo || "/");
      return;
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      console.log("✅ Authenticated user on auth page, redirecting");
      const redirectPath = isAdmin ? "/admin/dashboard" : "/";
      setHasRedirected(true);
      router.push(redirectPath);
      return;
    }

    console.log("✅ AuthGuard check passed");
  }, [isLoading, isAuthenticated, isAdmin, requireAuth, requireAdmin, pathname, router, redirectTo, hasRedirected]);

  // Reset redirect flag when pathname changes
  useEffect(() => {
    setHasRedirected(false);
  }, [pathname]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (hasRedirected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show content if all checks pass
  return <>{children}</>;
};

// Convenience components for common use cases
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requireAuth>{children}</AuthGuard>
);

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard requireAuth requireAdmin>{children}</AuthGuard>
);

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);
