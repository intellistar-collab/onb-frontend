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

interface AdminStatsProps {
  stats: StatItem[];
  className?: string;
}


export const AdminStats: React.FC<AdminStatsProps> = ({ stats, className }) => {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6", className)}>
      {stats.map((stat, index) => (
        <AdminCard key={index} className="hover:shadow-lg transition-shadow py-3 sm:py-6">
          <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
            <div className="flex-1">
              <p className="admin-text-secondary text-xs sm:text-sm font-medium mb-1">
                {stat.label}
              </p>
              <p className="admin-text-primary text-lg sm:text-2xl font-bold">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
              {stat.trend && (
                <p className={cn(
                  "text-xs font-medium mt-1",
                  stat.trend.isPositive ? "text-green-600" : "text-red-600"
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
