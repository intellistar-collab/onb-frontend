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
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
      {stats.map((stat, index) => (
        <AdminCard key={index} className="hover:shadow-lg transition-shadow">
          <div className="flex items-center sm:flex-col sm:items-center sm:text-center sm:space-y-3">
            <div className="flex-shrink-0">
              {stat.icon}
            </div>
            <div className="ml-4 sm:ml-0">
              <p className="admin-text-secondary text-sm font-medium">
                {stat.label}
              </p>
              <p className="admin-text-primary text-2xl font-bold">
                {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
              </p>
              {stat.trend && (
                <p className={cn(
                  "text-xs font-medium",
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
