"use client";

import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface AdminBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const badgeVariants: Record<BadgeVariant, string> = {
  success: "admin-badge-success",
  warning: "admin-badge-warning",
  error: "admin-badge-error",
  info: "admin-badge-info",
  neutral: "admin-badge-neutral",
};

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  children,
  variant = "neutral",
  className,
}) => {
  return (
    <span className={cn("admin-badge", badgeVariants[variant], className)}>
      {children}
    </span>
  );
};
