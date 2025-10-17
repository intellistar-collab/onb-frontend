import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getNavigationItems, type NavigationItem } from "@/constants/navigation";
import EnhancedNotificationIndicator from "./enhanced-notification-indicator";

interface DesktopNavigationProps {
  isAdmin: boolean;
  newBoxCount: number;
  className?: string;
}

export default function DesktopNavigation({ 
  isAdmin, 
  newBoxCount, 
  className 
}: DesktopNavigationProps) {
  const pathname = usePathname();
  const navItems = getNavigationItems(isAdmin);

  return (
    <div className={cn(
      "hidden md:flex items-center gap-2 lg:gap-4 xl:gap-6 font-oswald",
      className
    )}>
      {navItems.map((item: NavigationItem) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "whitespace-nowrap text-sm md:text-base lg:text-lg xl:text-xl font-medium transition-colors duration-200 flex items-center gap-2 relative",
            pathname === item.href
              ? "text-pink-400"
              : "hover:text-pink-400"
          )}
        >
          {item.name}
          {item.name === "MYSTERY BOXES" && (
            <div className="ml-0.5">
              <EnhancedNotificationIndicator 
                show={newBoxCount > 0} 
                count={newBoxCount} 
                variant="sparkle"
              />
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
