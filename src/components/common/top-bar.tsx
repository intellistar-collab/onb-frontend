"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown, User, LogOut, Settings, Wallet, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import EnhancedNotificationIndicator from "./enhanced-notification-indicator";
import { useAuth } from "@/contexts/auth-context";
import AuthDialogs from "@/components/auth/auth-dialogs";

const hiddenPaths = ["/signup", "/login"];

const TopBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [newBoxCount, setNewBoxCount] = useState<number>(3);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [authDialogTab, setAuthDialogTab] = useState<"login" | "register">("login");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

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


  const navItems = [
    { name: "HOME", href: "/" },
    { name: "MYSTERY BOXES", href: "/box" },
    { name: "HOW TO PLAY", href: "/how-to-play" },
    { name: "RANKS", href: "ranks" },
    ...(isAdmin ? [{ name: "ADMIN", href: "/admin/dashboard" }] : []),
  ];

  if(hiddenPaths.includes(pathname)) {
    return null;
  }

  return (
    <nav className="text-white sticky top-0 z-50 backdrop-blur-xl border-b border-gray-800/50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-12 sm:h-14 md:h-16 lg:h-18">
          {/* Left Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 font-oswald">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "whitespace-nowrap text-sm md:text-base lg:text-lg xl:text-xl font-medium transition-colors duration-200 flex items-center gap-2 relative",
                  pathname === item.href
                    ? "text-pink-400"
                    : "hover:text-pink-400"
                )}
              >
                {item.name}
                {item.name === "MYSTERY BOXES" && (
                  <div className="ml-0.5">
                    <EnhancedNotificationIndicator 
                      show={newBoxCount > 0} 
                      count={newBoxCount} 
                      variant="sparkle"
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-gray-800 p-1 sm:p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6" suppressHydrationWarning />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6" suppressHydrationWarning />
              )}
            </Button>
          </div>

          <div className="flex-shrink-0">
            <Image 
              src="/logo.svg" 
              height={150} 
              width={150} 
              alt="logo" 
              style={{ width: "auto", height: "auto" }}
              suppressHydrationWarning
            />
          </div>

          {/* Right Side - Desktop */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3 xl:space-x-4 font-oswald">
            {/* Currency Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-gray-800 text-xs md:text-sm lg:text-base px-2 lg:px-3"
                >
                  £ GBP
                  <ChevronDown className="ml-1 h-3 w-3 md:h-4 md:w-4" suppressHydrationWarning />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  £ GBP
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  $ USD
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  € EUR
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-gray-800 text-xs md:text-sm lg:text-base px-2 lg:px-3"
                >
                  EN
                  <ChevronDown className="ml-1 h-3 w-3 md:h-4 md:w-4" suppressHydrationWarning />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-gray-800 border-gray-700">
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700 text-xs md:text-sm">
                  Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-white hover:bg-gray-800 text-xs md:text-sm lg:text-base px-2 lg:px-3 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" suppressHydrationWarning />
                    {user?.name || user?.username || "User"}
                    <ChevronDown className="ml-1 h-3 w-3 md:h-4 md:w-4" suppressHydrationWarning />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700 w-48">
                  <div className="px-3 py-2 text-sm text-gray-300 border-b border-gray-700">
                    <div className="font-medium text-white">{user?.name || user?.username}</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                    {isAdmin && (
                      <div className="text-xs text-pink-400 font-medium">Admin</div>
                    )}
                  </div>
                  
                  {/* Wallet Balance and Score */}
                  <div className="px-3 py-2 border-b border-gray-700">
                    {user?.wallet && user?.score ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-green-400" />
                            <span className="text-xs text-gray-300">Balance</span>
                          </div>
                          <span className="text-sm font-medium text-green-400">
                            ${Number(user.wallet.balance || 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-4 w-4 text-yellow-400" />
                            <span className="text-xs text-gray-300">Score</span>
                          </div>
                          <span className="text-sm font-medium text-yellow-400">
                            {Number(user.score.score || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 text-center py-2">
                        Loading wallet data...
                      </div>
                    )}
                  </div>
                  <DropdownMenuItem 
                    className="text-white hover:bg-gray-700 text-xs md:text-sm cursor-pointer"
                    onClick={() => router.push("/account")}
                  >
                    <User className="mr-2 h-4 w-4" suppressHydrationWarning />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-white hover:bg-gray-700 text-xs md:text-sm cursor-pointer"
                    onClick={() => router.push("/account/settings")}
                  >
                    <Settings className="mr-2 h-4 w-4" suppressHydrationWarning />
                    Settings
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem 
                      className="text-white hover:bg-gray-700 text-xs md:text-sm cursor-pointer"
                      onClick={() => router.push("/admin/dashboard")}
                    >
                      <Settings className="mr-2 h-4 w-4" suppressHydrationWarning />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-gray-700 text-xs md:text-sm cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" suppressHydrationWarning />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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

          {/* Mobile Menu Button Placeholder for Right Side */}
          <div className="md:hidden w-8 sm:w-10"></div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base sm:text-lg font-medium hover:text-pink-400 hover:bg-gray-800 rounded-md transition-colors duration-200 flex items-center justify-between"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="relative inline-flex items-center">
                    {item.name}
                    {item.name === "MYSTERY BOXES" && (
                      <span className="relative inline-flex items-center ml-1">
                        <span className="relative z-10 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[12px] font-extrabold leading-none ring-2 ring-yellow-300 shadow-lg shadow-yellow-500/30 animate-bounce">
                          {newBoxCount > 99 ? '99+' : newBoxCount}
                        </span>
                        <span className="pointer-events-none absolute -inset-1 rounded-full bg-yellow-400/40 animate-ping" />
                      </span>
                    )}
                  </span>
                </Link>
              ))}

              {/* Mobile Currency/Language */}
              <div className="flex items-center space-x-2 px-3 py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-gray-800 text-sm sm:text-base px-2 py-1"
                    >
                      £ GBP
                      <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" suppressHydrationWarning />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      £ GBP
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      $ USD
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      € EUR
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-gray-800 text-sm sm:text-base px-2 py-1"
                    >
                      EN
                      <ChevronDown className="ml-1 h-3 w-3 sm:h-4 sm:w-4" suppressHydrationWarning />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      English
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      Español
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-white hover:bg-gray-700 text-sm">
                      Français
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="px-3 py-2 space-y-2 border-t border-gray-800">
                  <div className="px-3 py-2 text-sm text-gray-300">
                    <div className="font-medium text-white">{user?.name || user?.username}</div>
                    <div className="text-xs text-gray-400">{user?.email}</div>
                    {isAdmin && (
                      <div className="text-xs text-pink-400 font-medium">Admin</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-gray-800 justify-start text-sm sm:text-base py-2"
                    onClick={() => {
                      router.push("/account");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" suppressHydrationWarning />
                    Account
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-gray-800 justify-start text-sm sm:text-base py-2"
                    onClick={() => {
                      router.push("/account/settings");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" suppressHydrationWarning />
                    Settings
                  </Button>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:bg-gray-800 justify-start text-sm sm:text-base py-2"
                      onClick={() => {
                        router.push("/admin/dashboard");
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="mr-2 h-4 w-4" suppressHydrationWarning />
                      Admin Dashboard
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-gray-800 justify-start text-sm sm:text-base py-2"
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" suppressHydrationWarning />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full text-white hover:bg-gray-800 justify-start text-sm sm:text-base py-2"
                    onClick={() => {
                      openAuthDialog();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    SIGN IN
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
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
