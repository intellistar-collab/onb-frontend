"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/common/top-bar";
import ExperienceBanner from "@/components/common/experience-banner";
import Footer from "@/components/common/footer";
import FloatingUsersSidebar from "@/components/common/floating-users-sidebar";
import { ToastProvider } from "@/components/ui/toast";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if we're in the admin panel
  const isAdminRoute = pathname && pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    // For admin routes, only render the children with ToastProvider
    return (
      <ToastProvider>
        {children}
      </ToastProvider>
    );
  }
  
  // For non-admin routes, render the full layout with navigation
  return (
    <ToastProvider>
      <TopBar />
      {children}
      <Footer />
      <FloatingUsersSidebar />
    </ToastProvider>
  );
}
