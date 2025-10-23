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

    // Check authentication requirements
    if (requireAuth && !isAuthenticated) {
      const loginUrl = redirectTo || "/login";
      const redirectParam = encodeURIComponent(pathname);
      setHasRedirected(true);
      router.push(`${loginUrl}?redirect=${redirectParam}`);
      return;
    }

    // Check admin requirements
    if (requireAdmin && (!isAuthenticated || !isAdmin)) {
      setHasRedirected(true);
      router.push(redirectTo || "/");
      return;
    }

    // Redirect authenticated users away from auth pages
    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      const redirectPath = isAdmin ? "/admin/dashboard" : "/";
      setHasRedirected(true);
      router.push(redirectPath);
      return;
    }

  }, [isLoading, isAuthenticated, isAdmin, requireAuth, requireAdmin, pathname, router, redirectTo, hasRedirected]);

  // Reset redirect flag when pathname changes
  useEffect(() => {
    setHasRedirected(false);
  }, [pathname]);

  // Show loading state
  if (isLoading || hasRedirected) {
    return <>{children}</>;
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
