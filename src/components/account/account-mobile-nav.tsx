"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AccountMobileNav() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/account",
      label: "Account",
      icon: "👤"
    },
    {
      href: "/account/wallet",
      label: "Wallet",
      icon: "💳"
    },
    {
      href: "/account/packs",
      label: "Packs",
      icon: "📦"
    },
    {
      href: "/account/referrals",
      label: "Referrals",
      icon: "👥"
    },
    {
      href: "/account/community",
      label: "Community",
      icon: "🌟"
    },
    {
      href: "/account/support",
      label: "Support",
      icon: "🛟"
    }
  ];

  return (
    <div className="lg:hidden mb-6">
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4">
        <h3 className="font-semibold text-foreground mb-3">Quick Navigation</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 hover:scale-105"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
