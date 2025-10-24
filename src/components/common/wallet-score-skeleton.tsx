"use client";

import { cn } from "@/lib/utils";

interface WalletScoreSkeletonProps {
  variant?: "compact" | "full";
  className?: string;
}

export default function WalletScoreSkeleton({ 
  variant = "compact", 
  className 
}: WalletScoreSkeletonProps) {
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-4 text-sm", className)}>
        {/* Wallet skeleton */}
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
        {/* Score skeleton */}
        <div className="flex items-center gap-1">
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-4 w-10 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Wallet skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-3 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
        <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
      {/* Score skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          <div className="h-3 w-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
        </div>
        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      </div>
    </div>
  );
}

