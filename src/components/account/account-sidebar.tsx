"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AccountSidebar() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/account",
      label: "Account Stats",
      icon: "👤",
      description: "Profile and statistics"
    },
    {
      href: "/account/wallet",
      label: "Wallet",
      icon: "💰",
      description: "Manage tokens and payments"
    },
    {
      href: "/account/packs",
      label: "Packs",
      icon: "📦",
      description: "Your items and rewards"
    },
    {
      href: "/account/referrals",
      label: "Referrals",
      icon: "🤝",
      description: "Invite friends and earn"
    },
    {
      href: "/account/community",
      label: "ONB Community",
      icon: "🌟",
      description: "Connect with players"
    },
    {
      href: "/account/support",
      label: "Support",
      icon: "🛟",
      description: "Get help and assistance"
    }
  ];

  return (
    <div className="bg-card rounded-lg border border-border shadow-lg p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-1">Account Menu</h3>
        <p className="text-sm text-muted-foreground">Manage your ONB account</p>
      </div>
      
      <nav className="space-y-1">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <div className={cn(
                  "font-medium text-sm",
                  isActive ? "text-primary-foreground" : "text-foreground"
                )}>
                  {item.label}
                </div>
                <div className={cn(
                  "text-xs truncate",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {item.description}
                </div>
              </div>
              {isActive && (
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-6 pt-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span>
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
