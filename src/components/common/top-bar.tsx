"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import AuthDialogs from "@/components/auth/auth-dialogs";
import { hiddenPaths } from "@/constants/navigation";
import Logo from "./logo";
import DesktopNavigation from "./desktop-navigation";
import CurrencyDropdown from "./currency-dropdown";
import LanguageDropdown from "./language-dropdown";
import UserMenu from "./user-menu";
import MobileMenu from "./mobile-menu";

const TopBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false);
  const [newBoxCount, setNewBoxCount] = useState<number>(3);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<"login" | "register">("login");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout, isLoading } = useAuth();

  React.useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem('newBoxCount') : null;
      const parsed = stored ? parseInt(stored, 10) : NaN;
      if (!Number.isNaN(parsed) && parsed >= 0) setNewBoxCount(parsed);
    } catch {}
  }, []);

  const openAuthDialog = () => {
    setAuthDialogTab("login");
    setIsAuthDialogOpen(true);
  };

  const closeAuthDialog = () => {
    setAuthDialogTab("login");
    setIsAuthDialogOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuClosing(true);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMobileMenuClosing(false);
    }, 300); // Match the animation duration
  };



  if(hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <nav className="text-white sticky top-0 z-50 backdrop-blur-xl border-b border-gray-800/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 lg:h-18">
          {/* Left Navigation - Desktop */}
          <DesktopNavigation 
            isAdmin={isAdmin} 
            newBoxCount={newBoxCount} 
          />

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => isMobileMenuOpen ? closeMobileMenu() : setIsMobileMenuOpen(true)}
              className="text-white hover:bg-gray-800 p-1 sm:p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" suppressHydrationWarning />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" suppressHydrationWarning />
              )}
            </Button>
          </div>

          {/* Logo */}
          <Logo />

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4 font-oswald">
            <CurrencyDropdown />
            <LanguageDropdown />
            
            {isAuthenticated ? (
              <UserMenu 
                user={user}
                isAdmin={isAdmin}
                isLoading={isLoading}
                onLogout={logout}
                variant="desktop"
              />
            ) : (
              <div className="bg-gray-500/40 rounded-md p-1 gap-2">
                <Button 
                  variant="ghost" 
                  className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium"
                  onClick={openAuthDialog}
                >
                  SIGN IN
                </Button>
              </div>
            )}
          </div>

          {/* Mobile User Menu */}
          <div className="md:hidden flex items-center">
            {isAuthenticated ? (
              <UserMenu 
                user={user}
                isAdmin={isAdmin}
                isLoading={isLoading}
                onLogout={logout}
                variant="mobile"
              />
            ) : (
              <Button 
                variant="ghost" 
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-medium text-xs px-3 py-1"
                onClick={openAuthDialog}
              >
                SIGN IN
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <MobileMenu 
          isOpen={isMobileMenuOpen}
          isClosing={isMobileMenuClosing}
          isAdmin={isAdmin}
          newBoxCount={newBoxCount}
          onClose={closeMobileMenu}
        />
      </div>
      
      {/* Auth Dialogs */}
      <AuthDialogs 
        isOpen={isAuthDialogOpen} 
        onClose={closeAuthDialog} 
        defaultTab={authDialogTab}
      />
      
    </nav>
  );
};

export default TopBar;
