"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Wallet, 
  Package, 
  Users, 
  Star, 
  LifeBuoy,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AccountSidebar() {
  const pathname = usePathname();

  const navigationItems = [
    {
      href: "/account",
      label: "Account Stats",
      icon: User,
      description: "Profile and statistics"
    },
    {
      href: "/account/wallet",
      label: "Wallet",
      icon: Wallet,
      description: "Manage tokens and payments"
    },
    {
      href: "/account/packs",
      label: "Packs",
      icon: Package,
      description: "Your items and rewards"
    },
    {
      href: "/account/referrals",
      label: "Referrals",
      icon: Users,
      description: "Invite friends and earn"
    },
    {
      href: "/account/community",
      label: "ONB Community",
      icon: Star,
      description: "Connect with players"
    },
    {
      href: "/account/support",
      label: "Support",
      icon: LifeBuoy,
      description: "Get help and assistance"
    }
  ];

  return (
    <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 shadow-lg w-14 h-fit sticky top-6">
      <div className="p-2">
        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href;
            
            return (
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 relative",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105"
                  )}
                >
                  {/* Icon */}
                  <item.icon className="w-5 h-5" />
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-secondary animate-pulse" />
                  )}
                </Link>

                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-xl whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:translate-x-1">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover rotate-45" />
                </div>
              </div>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-border/50">
          <div className="relative group">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg shadow-xl whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:translate-x-1">
              <div className="font-medium">Back to Home</div>
              <div className="text-xs text-muted-foreground mt-0.5">Return to main page</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-popover rotate-45" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
