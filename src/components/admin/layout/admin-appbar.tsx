"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  LogOut,
  Sun,
  Moon,
  Bell,
  Search,
  Settings,
} from "lucide-react";

interface AdminAppBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  isSearchVisible?: boolean;
  isThemeToggleVisible?: boolean;
}

export const AdminAppBar: React.FC<AdminAppBarProps> = ({
  sidebarOpen,
  onToggleSidebar,
  isSearchVisible = false,
  isThemeToggleVisible = false,
}) => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Event handlers
  const handleLogout = async () => {
    await logout("/"); // Admin users should go to home after logout
  };

  const handleThemeToggle = () => {
    toggleTheme();
  };

  const handleSidebarToggle = () => {
    onToggleSidebar();
  };

  return (
    <header className={`fixed top-0 left-0 lg:left-72 right-0 z-40 h-16 border-b px-4 transition-all duration-300 ease-in-out ${
      isScrolled 
        ? 'admin-bg-secondary backdrop-blur-sm admin-shadow admin-border-primary' 
        : 'admin-bg-primary/95 backdrop-blur-sm shadow-xl border-slate-200/20 dark:border-slate-700/20'
    }`}>
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden admin-button-ghost"
            onClick={handleSidebarToggle}
          >
            <Menu className="h-5 w-5" suppressHydrationWarning />
          </Button>
          
          {isSearchVisible && (
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" suppressHydrationWarning />
                <input
                  type="text"
                  placeholder="Search..."
                  className="admin-input pl-10 pr-4 py-2 w-64"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {isThemeToggleVisible && (
            mounted ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleThemeToggle}
                className="admin-button-ghost"
              >
                {isDarkMode ? <Sun className="h-5 w-5" suppressHydrationWarning /> : <Moon className="h-5 w-5" suppressHydrationWarning />}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="admin-button-ghost"
                disabled
              >
                <Moon className="h-5 w-5" suppressHydrationWarning />
              </Button>
            )
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="admin-button-ghost"
          >
            <Bell className="h-5 w-5" suppressHydrationWarning />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="admin-button-ghost">
                <User className="h-5 w-5" suppressHydrationWarning />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="admin-bg-secondary admin-border-primary" align="end">
              <div className="px-3 py-2 text-sm admin-text-secondary border-b admin-border-primary">
                <div className="font-medium admin-text-primary">
                  {user?.username}
                </div>
                <div className="text-xs admin-text-tertiary">
                  {user?.email}
                </div>
              </div>
              <DropdownMenuItem className="admin-text-primary admin-hover-bg">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="admin-text-primary admin-hover-bg">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="admin-border-primary" />
              <DropdownMenuItem 
                className="admin-text-primary admin-hover-bg"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
