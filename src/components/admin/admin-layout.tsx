"use client";

import React, { useState } from "react";
import { AdminAppBar, AdminSidebar } from "./layout";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Event handlers
  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Immediate dark theme script - runs before content renders */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Apply dark theme immediately for admin pages
              document.documentElement.setAttribute('data-theme', 'dark');
              document.documentElement.classList.add('dark');
            })();
          `,
        }}
      />
      <div className="min-h-screen flex admin-bg-primary">
        <AdminSidebar 
          sidebarOpen={sidebarOpen} 
          onCloseSidebar={handleCloseSidebar} 
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden lg:ml-72">
          <AdminAppBar 
            sidebarOpen={sidebarOpen} 
            onToggleSidebar={handleToggleSidebar} 
          />

          {/* Page content */}
          <main className="flex-1 admin-bg-primary overflow-y-auto pt-16">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}