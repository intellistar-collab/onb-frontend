"use client";

import AccountSidebar from "./account-sidebar";
import { AccountMobileNav } from "./account-mobile-nav";
import { ReactNode } from "react";

export function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none" />
      <div className="relative">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Hidden on mobile, shows as mini on desktop */}
            {/* <div className="hidden lg:block flex-shrink-0">
              <AccountSidebar />
            </div> */}

            {/* Mobile Navigation - Only visible on mobile */}
            {/* <AccountMobileNav /> */}

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
