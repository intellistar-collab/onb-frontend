"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
// Simple loading component to avoid admin CSS dependencies
const SimpleLoading = ({ text = "Loading..." }: { text?: string }) => (
  <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 h-12 w-12" />
      <p className="text-gray-600 text-lg font-bold mt-4">{text}</p>
    </div>
  </div>
);

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
      const redirectParam = encodeURIComponent(pathname);
      router.push(`${loginUrl}?redirect=${redirectParam}`);
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
    return <SimpleLoading text="Authenticating..." />;
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

export const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useAuth();
  
  // For public routes, don't wait for auth check to complete
  if (isLoading) {
    return <>{children}</>;
  }
  
  return <>{children}</>;
};
