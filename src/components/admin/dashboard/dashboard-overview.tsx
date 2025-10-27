"use client";

import React from "react";
import { AdminVerticalStats, AdminRevenueChart } from "@/components/admin";
// Define types locally for dashboard components
interface DailyMetricsData {
  date: string;
  revenue: number;
  openBoxCount: number;
  newUsersCount: number;
  formattedDate: string;
}

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface DashboardOverviewProps {
  stats: StatItem[];
  dailyMetricsData: DailyMetricsData[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  dailyMetricsData,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      {/* Daily Overview Chart - Takes 3/4 of the width */}
      <div className="lg:col-span-3">
        <AdminRevenueChart data={dailyMetricsData} />
      </div>
      
      {/* Vertical Stats - Takes 1/4 of the width */}
      <div className="lg:col-span-1">
        <AdminVerticalStats stats={stats} />
      </div>
    </div>
  );
};
