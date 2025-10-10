"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    if (isLoading) return;

    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      const loginUrl = redirectTo || "/login";
      const url = new URL(loginUrl, window.location.origin);
      url.searchParams.set("redirect", pathname);
      router.push(url.toString());
      return;
    }

    // If admin access is required but user is not admin
    if (requireAdmin && (!isAuthenticated || !isAdmin)) {
      router.push(redirectTo || "/");
      return;
    }

    // If user is authenticated but trying to access auth pages
    if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
      // Redirect admin users to admin dashboard, others to home
      const redirectPath = isAdmin ? "/admin/dashboard" : "/";
      router.push(redirectPath);
      return;
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAuth, requireAdmin, pathname, router, redirectTo]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  // If admin access is required but user is not admin
  if (requireAdmin && (!isAuthenticated || !isAdmin)) {
    return null; // Will redirect in useEffect
  }

  // If user is authenticated but trying to access auth pages
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return null; // Will redirect in useEffect
  }

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
  <AuthGuard>{children}</AuthGuard>
);
