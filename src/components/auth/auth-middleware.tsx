"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ToastProvider } from "@/components/ui/toast";
import AuthDialogs from "./auth-dialogs";

interface AuthMiddlewareProps {
  children: React.ReactNode;
}

const AuthMiddleware: React.FC<AuthMiddlewareProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Pages that don't require authentication
  const publicPages = ['/login', '/signup', '/admin/dashboard'];
  
  // Check if current page is public
  const isPublicPage = publicPages.some(page => pathname?.startsWith(page));

  useEffect(() => {
    // Wait for auth to finish loading
    if (isLoading) return;

    // If it's a public page, don't show auth dialog
    if (isPublicPage) {
      setShowAuthDialog(false);
      setIsInitialized(true);
      return;
    }

    // If user is not authenticated, show auth dialog immediately
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      setIsInitialized(true);
    } else {
      setShowAuthDialog(false);
      setIsInitialized(true);
    }
  }, [isAuthenticated, isLoading, pathname, isPublicPage]);

  const handleAuthSuccess = () => {
    setShowAuthDialog(false);
  };

  // Show loading state while checking authentication
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black/10 backdrop-blur-sm">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth dialog if not authenticated
  if (showAuthDialog) {
    return (
      <ToastProvider>
        <div className="relative">
          {/* Page content behind auth dialog */}
          <div className="pointer-events-none">
            {children}
          </div>
          
          {/* Auth dialog overlay */}
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <AuthDialogs
              isOpen={true}
              onClose={handleAuthSuccess}
              defaultTab="login"
              disableClose={true}
            />
          </div>
        </div>
      </ToastProvider>
    );
  }

  // Show content if authenticated or on public pages
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
};

export default AuthMiddleware;
