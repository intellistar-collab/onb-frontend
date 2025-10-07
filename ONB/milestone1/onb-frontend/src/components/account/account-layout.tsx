"use client";

import AccountSidebar from "./account-sidebar";
import { AccountMobileNav } from "./account-mobile-nav";
import { ReactNode } from "react";

interface AccountLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: string;
}

export function AccountLayout({ children, title, description, icon }: AccountLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none" />
      
      <div className="relative">
        {/* Page Header */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <span className="text-2xl">{icon}</span>
              </div>
              <div>
                <h1 className="text-3xl font-rage text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Hidden on mobile, shows as mini on desktop */}
            <div className="hidden lg:block flex-shrink-0">
              <AccountSidebar />
            </div>

            {/* Mobile Navigation - Only visible on mobile */}
            <AccountMobileNav />

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
