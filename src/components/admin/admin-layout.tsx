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
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
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
      <div className={`fixed inset-y-0 left-0 z-50 w-72 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 admin-bg-secondary admin-border-primary border-r ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 admin-border-primary border-b admin-bg-tertiary">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <h1 className="admin-text-primary text-xl font-bold">Admin Panel</h1>
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
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  className={`w-full justify-start admin-button-ghost ${
                    isActive ? 'admin-bg-tertiary admin-text-primary' : 'admin-text-secondary'
                  }`}
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 admin-border-primary border-t">
            <div className="admin-card p-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
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
                className="w-full mt-2 admin-button-ghost"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-40 h-16 admin-border-primary border-b admin-bg-secondary admin-shadow px-4">
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
        <main className="flex-1 admin-bg-primary">
          {children}
        </main>
      </div>
    </div>
  );
}