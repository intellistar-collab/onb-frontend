"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  Tag,
  Settings,
  BarChart3,
  X,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Activity,
  List,
  TrendingUp,
  Trophy,
  DollarSign,
  UserCheck,
  Box,
} from "lucide-react";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  onCloseSidebar: () => void;
}

const navigationItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { 
    name: "Users", 
    icon: Users, 
    children: [
      { name: "Overview", href: "/admin/users/overview", icon: Activity },
      { name: "User List", href: "/admin/users/list", icon: List },
      { name: "Analytics", href: "/admin/users/analytics", icon: BarChart3 },
    ]
  },
  { name: "Box Categories", href: "/admin/box-categories", icon: FolderOpen },
  { name: "Boxes", href: "/admin/boxes", icon: Package },
  { name: "Items", href: "/admin/items", icon: Tag },
  { name: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
  { 
    name: "Analytics", 
    icon: TrendingUp, 
    children: [
      { name: "Overview", href: "/admin/analytics/overview", icon: BarChart3 },
      { name: "Revenue", href: "/admin/analytics/revenue", icon: DollarSign },
      { name: "Users", href: "/admin/analytics/users", icon: UserCheck },
      { name: "Boxes", href: "/admin/analytics/boxes", icon: Box },
    ]
  },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  sidebarOpen,
  onCloseSidebar,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  // Auto-expand menus when a child route is active
  useEffect(() => {
    const activeMenu = navigationItems.find(item => 
      item.children?.some(child => pathname === child.href)
    );
    if (activeMenu && !expandedMenus.includes(activeMenu.name)) {
      setExpandedMenus(prev => [...prev, activeMenu.name]);
    }
  }, [pathname, expandedMenus]);

  // Event handlers
  const handleMenuToggle = (menuName: string) => {
    // Find the menu item to check if it has active children
    const menuItem = navigationItems.find(item => item.name === menuName);
    const hasActiveChild = menuItem?.children?.some(child => pathname === child.href);
    
    // Don't collapse if there's an active child
    if (hasActiveChild) {
      return;
    }
    
    setExpandedMenus(prev => 
      prev.includes(menuName) 
        ? prev.filter(name => name !== menuName)
        : [...prev, menuName]
    );
  };

  const handleMenuClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    const hasChildren = item.children && item.children.length > 0;
    
    if (hasChildren) {
      handleMenuToggle(item.name);
    } else if (item.href) {
      router.push(item.href);
      onCloseSidebar();
    }
  };

  const handleChildMenuClick = (child: any) => {
    router.push(child.href);
    onCloseSidebar();
  };

  const handleOverlayClick = () => {
    onCloseSidebar();
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 admin-bg-primary admin-border-primary border-r overflow-hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between h-16 px-6 admin-border-primary border-b admin-bg-primary">
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
              onClick={handleOverlayClick}
            >
              <X className="h-5 w-5" suppressHydrationWarning />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto admin-bg-primary">
            {navigationItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus.includes(item.name);
              const isActive = pathname === item.href || (hasChildren && item.children.some(child => pathname === child.href));
              
              return (
                <div key={item.name} className="relative group">
                  
                  <Button
                    variant="ghost"
                    className={`w-full justify-start transition-all duration-200 ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={(e) => handleMenuClick(e, item)}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className={`mr-3 h-5 w-5 ${
                        isActive 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} suppressHydrationWarning />
                      <span className={`font-medium flex-1 ${
                        isActive 
                          ? 'text-blue-700 dark:text-blue-300' 
                          : 'text-gray-600 dark:text-gray-300'
                      }`}>
                        {item.name}
                      </span>
                    </div>
                    {hasChildren && (
                      <div className="ml-auto">
                        {isExpanded ? (
                          <ChevronUp className={`h-4 w-4 ${
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                          }`} />
                        ) : (
                          <ChevronDown className={`h-4 w-4 ${
                            isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                          }`} />
                        )}
                      </div>
                    )}
                  </Button>
                  
                  {/* Children menu */}
                  {hasChildren && isExpanded && (
                    <div className="ml-6 mt-2 space-y-1">
                      {item.children.map((child) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <div key={child.name} className="relative group">
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`w-full justify-start transition-all duration-200 ${
                                isChildActive 
                                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                              onClick={() => handleChildMenuClick(child)}
                            >
                              <child.icon className={`mr-3 h-4 w-4 ${
                                isChildActive 
                                  ? 'text-blue-600 dark:text-blue-400' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`} suppressHydrationWarning />
                              <span className={`text-sm font-medium ${
                                isChildActive 
                                  ? 'text-blue-700 dark:text-blue-300' 
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {child.name}
                              </span>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="mt-auto p-4 admin-border-primary border-t">
            <p className="text-[11px] admin-text-tertiary text-center">
              © {new Date().getFullYear()} OneNightBox. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
