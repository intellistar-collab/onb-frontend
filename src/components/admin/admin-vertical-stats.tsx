"use client";

import React from "react";
import { AdminCard } from "./admin-card";
import { cn } from "@/lib/utils";

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface AdminVerticalStatsProps {
  stats: StatItem[];
  className?: string;
}

export const AdminVerticalStats: React.FC<AdminVerticalStatsProps> = ({ stats, className }) => {
  return (
    <div className={cn("flex flex-col gap-3 h-full", className)}>
      {stats.map((stat, index) => (
        <AdminCard key={index} className="flex items-center justify-center hover:shadow-lg transition-shadow py-4 px-4 flex-1">
          <div className="flex flex-col items-center text-center space-y-2 h-full justify-center">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20">
                {stat.icon}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 w-full flex flex-col justify-center">
              <p className="admin-text-secondary text-xs font-medium mb-1">
                {stat.label}
              </p>
              <p className="admin-text-primary text-xl font-bold mb-1">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
              {stat.trend && (
                <p className={cn(
                  "text-xs font-medium",
                  stat.trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                )}>
                  {stat.trend.value}
                </p>
              )}
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
};
