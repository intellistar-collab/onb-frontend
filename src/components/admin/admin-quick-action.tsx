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
        "bg-slate-100 border border-slate-200",
        "dark:bg-slate-800 dark:border-slate-700",
        "flex flex-col items-center justify-center space-y-1 sm:space-y-2",
        "hover:bg-slate-200 dark:hover:bg-slate-700",
        "hover:scale-105 transform transition-all duration-200",
        "text-slate-700 dark:text-slate-200 font-medium",
        "shadow-sm hover:shadow-md",
        "p-2 sm:p-3",
        className
      )}
    >
      <div className="text-slate-600 dark:text-slate-300 h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">{icon}</div>
      <span className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium text-center leading-tight">{label}</span>
    </Button>
  );
};
