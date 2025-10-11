"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  Users,
  Package,
  Tag,
  Settings,
  BarChart3,
  Menu,
  X,
  User,
  LogOut,
  Sun,
  Moon,
  Bell,
  Search,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Boxes", href: "/admin/boxes", icon: Package },
  { name: "Products", href: "/admin/products", icon: Tag },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20); // Change to solid after 20px scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex admin-bg-primary">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 admin-bg-secondary admin-border-primary border-r overflow-hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 admin-border-primary border-b admin-bg-tertiary">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110 hover:rotate-3">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <h1 className="admin-text-primary text-xl font-bold transition-colors duration-200">Admin Panel</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden admin-button-ghost"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.name} className="relative group">
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full animate-pulse shadow-lg" />
                  )}
                  
                  {/* Hover indicator */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-300 dark:bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  
                  <Button
                    variant="ghost"
                    className={`w-full justify-start transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-95 ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm border-l-4 border-blue-500 ml-0' 
                        : 'admin-button-ghost admin-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                    onClick={() => {
                      router.push(item.href);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className={`mr-3 h-5 w-5 transition-all duration-200 ${
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400 transform scale-110' 
                        : 'text-gray-500 dark:text-gray-400 group-hover:scale-105'
                    }`} />
                    <span className={`font-medium transition-all duration-200 ${
                      isActive 
                        ? 'text-blue-700 dark:text-blue-300 transform translate-x-1' 
                        : 'text-gray-700 dark:text-gray-300 group-hover:translate-x-0.5'
                    }`}>
                      {item.name}
                    </span>
                  </Button>
                </div>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 admin-border-primary border-t">
            <div className="admin-card p-3 transition-all duration-200 hover:shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="admin-text-primary text-sm font-medium truncate">
                    {user?.name || user?.username || "Admin"}
                  </p>
                  <p className="admin-text-tertiary text-xs truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 admin-button-ghost transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:scale-[1.02] group"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Topbar */}
        <header className={`fixed top-0 left-0 lg:left-72 right-0 z-40 h-16 border-b px-4 transition-all duration-300 ease-in-out ${
          isScrolled 
            ? 'admin-bg-secondary backdrop-blur-sm admin-shadow admin-border-primary' 
            : 'bg-transparent border-transparent shadow-none'
        }`}>
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden admin-button-ghost"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="admin-input pl-10 pr-4 py-2 w-64"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {mounted ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="admin-button-ghost"
                >
                  {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="admin-button-ghost"
                  disabled
                >
                  <Moon className="h-5 w-5" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="admin-button-ghost"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="admin-button-ghost">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="admin-bg-secondary admin-border-primary" align="end">
                  <div className="px-3 py-2 text-sm admin-text-secondary border-b admin-border-primary">
                    <div className="font-medium admin-text-primary">
                      {user?.name || user?.username}
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

        {/* Page content */}
        <main className="flex-1 admin-bg-primary overflow-y-auto pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}