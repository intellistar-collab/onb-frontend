import { User, LogOut, Settings, Wallet, Trophy, Package, ChevronDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";
import WalletScoreSkeleton from "./wallet-score-skeleton";
import UserAvatar from "@/components/ui/user-avatar";

interface UserMenuProps {
  user: any;
  isAdmin: boolean;
  isLoading: boolean;
  onLogout: (redirectTo?: string | false) => void;
  variant?: "desktop" | "mobile";
  className?: string;
}

export default function UserMenu({ 
  user, 
  isAdmin, 
  isLoading, 
  onLogout, 
  variant = "desktop",
  className 
}: UserMenuProps) {
  const router = useRouter();
  const isMobile = variant === "mobile";
  
  // Get wallet and score data from user object
  const wallet = user?.wallet;
  const score = user?.score;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className={cn(
          "bg-muted rounded-full animate-pulse",
          isMobile ? "h-6 w-6" : "h-8 w-8"
        )} />
        <div className={cn(
          "bg-muted rounded-full animate-pulse",
          isMobile ? "h-3 w-3" : "h-4 w-4"
        )} />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "text-white hover:bg-gray-800 flex items-center gap-2",
            isMobile 
              ? "text-xs px-2 gap-1" 
              : "text-xs md:text-sm lg:text-base px-2 lg:px-3",
            className
          )}
        >
          <User className="h-4 w-4" suppressHydrationWarning />
          <ChevronDown className={cn(
            "transition-transform duration-300 group-hover:rotate-180",
            isMobile ? "h-3 w-3" : "ml-1 h-3 w-3 md:h-4 md:w-4"
          )} suppressHydrationWarning />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black border-gray-600 w-48">
        <div className="px-3 py-3 text-sm text-gray-300 border-b border-gray-600">
          {/* User Avatar */}
          <div className="flex items-center gap-3 mb-2">
            <UserAvatar
              src={user?.avatar}
              alt={user?.firstName || user?.username || 'User'}
              fallback="U"
              size="md"
              showBorder={true}
            />
            <div className="flex-1">
              <div className="font-medium text-white">
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}` 
                  : user?.firstName || user?.username || "User"
                }
              </div>
              <div className="text-xs text-gray-400">@{user?.username}</div>
            </div>
          </div>
          {isAdmin && (
            <div className="text-xs text-pink-400 font-medium">👑 Admin</div>
          )}
        </div>
        
        {/* Wallet Balance and Score */}
        <div className="px-3 py-2 border-b border-gray-600">
          {wallet && score ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-gray-300">Balance</span>
                </div>
                <span className="text-sm font-medium text-green-400">
                  {formatPrice(wallet.balance || 0, "$")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-gray-300">Score</span>
                </div>
                <span className="text-sm font-medium text-yellow-400">
                  {Number(score.score || 0).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center py-2">
              No wallet data available
            </div>
          )}
        </div>
        
        <DropdownMenuItem 
          className={cn(
            "text-white cursor-pointer",
            isMobile ? "hover:bg-gray-800 text-xs" : "hover:bg-gray-700 text-xs md:text-sm"
          )}
          onClick={() => router.push("/account")}
        >
          <User className="mr-2 h-4 w-4" suppressHydrationWarning />
          Account
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className={cn(
            "text-white cursor-pointer",
            isMobile ? "hover:bg-gray-800 text-xs" : "hover:bg-gray-700 text-xs md:text-sm"
          )}
          onClick={() => router.push("/inventory")}
        >
          <Package className="mr-2 h-4 w-4" suppressHydrationWarning />
          Inventory
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          className={cn(
            "text-white cursor-pointer",
            isMobile ? "hover:bg-gray-800 text-xs" : "hover:bg-gray-700 text-xs md:text-sm"
          )}
          onClick={() => router.push("/account/settings")}
        >
          <Settings className="mr-2 h-4 w-4" suppressHydrationWarning />
          Settings
        </DropdownMenuItem>
        
        {isAdmin && (
          <DropdownMenuItem 
            className={cn(
              "text-white cursor-pointer",
              isMobile ? "hover:bg-gray-800 text-xs" : "hover:bg-gray-700 text-xs md:text-sm"
            )}
            onClick={() => router.push("/admin/dashboard")}
          >
            <Settings className="mr-2 h-4 w-4" suppressHydrationWarning />
            Admin Dashboard
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator className="bg-gray-700" />
        
        <DropdownMenuItem 
          className={cn(
            "text-white cursor-pointer",
            isMobile ? "hover:bg-gray-800 text-xs" : "hover:bg-gray-700 text-xs md:text-sm"
          )}
          onClick={() => onLogout(false)}
        >
          <LogOut className="mr-2 h-4 w-4" suppressHydrationWarning />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
