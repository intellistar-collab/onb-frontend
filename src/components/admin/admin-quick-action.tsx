"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminQuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

export const AdminQuickAction: React.FC<AdminQuickActionProps> = ({
  icon,
  label,
  onClick,
  className,
}) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "admin-quick-action",
        "min-h-[70px] sm:min-h-[80px] lg:min-h-[100px] w-full",
        "flex flex-col items-center justify-center space-y-1 sm:space-y-2",
        "hover:scale-105 transform transition-all duration-200",
        "shadow-sm hover:shadow-md",
        "p-2 sm:p-3",
        className
      )}
    >
      <div className="admin-text-primary h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">{icon}</div>
      <span className="admin-text-primary text-xs sm:text-sm font-medium text-center leading-tight">{label}</span>
    </Button>
  );
};
