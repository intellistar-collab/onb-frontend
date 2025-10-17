import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencyOptions } from "@/constants/navigation";
import { cn } from "@/lib/utils";

interface CurrencyDropdownProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "desktop" | "mobile";
}

const sizeClasses = {
  sm: "text-xs",
  md: "text-xs md:text-sm",
  lg: "text-xs md:text-sm lg:text-base",
};

export default function CurrencyDropdown({ 
  className, 
  size = "lg", 
  variant = "desktop" 
}: CurrencyDropdownProps) {
  const isMobile = variant === "mobile";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "text-white hover:bg-gray-800",
            sizeClasses[size],
            isMobile 
              ? "hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20 px-2 py-1 rounded-lg transition-all duration-300 hover:scale-105"
              : "px-2 lg:px-3",
            className
          )}
        >
          <span className="flex items-center gap-2">
            <span className="text-white">£</span>
            GBP
          </span>
          <ChevronDown className="ml-1 h-3 w-3 md:h-4 md:w-4 transition-transform duration-300 group-hover:rotate-180" suppressHydrationWarning />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(
        "border-gray-600 shadow-2xl",
        isMobile ? "bg-gray-800" : "bg-gray-800"
      )}>
        {currencyOptions.map((currency) => (
          <DropdownMenuItem 
            key={currency.code}
            className={cn(
              "text-white text-sm transition-all duration-200",
              isMobile 
                ? "hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-cyan-500/20"
                : "hover:bg-gray-700"
            )}
          >
            {currency.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
