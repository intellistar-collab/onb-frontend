"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AdminLoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8", 
  lg: "h-12 w-12",
};

export const AdminLoading: React.FC<AdminLoadingProps> = ({
  size = "md",
  className,
  text,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      <div
        className={cn(
          "admin-loading-spinner",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="admin-text-tertiary text-sm mt-2">{text}</p>
      )}
    </div>
  );
};

// Full page loading overlay
export const AdminPageLoading: React.FC<{ text?: string }> = ({ text = "Loading..." }) => {
  return (
    <div className="admin-loading-overlay">
      <div className="admin-loading-content">
        <div className="admin-loading-spinner-large animate-spin" />
        <p className="admin-text-secondary text-lg font-medium">{text}</p>
      </div>
    </div>
  );
};

// Inline loading for components
export const AdminInlineLoading: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-center py-4", className)}>
      <div className="admin-loading-spinner h-6 w-6 animate-spin" />
    </div>
  );
};
