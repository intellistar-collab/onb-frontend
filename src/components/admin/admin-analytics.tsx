"use client";

import React from "react";
import { AdminCard } from "./admin-card";
import { cn } from "@/lib/utils";
import { 
  Users, 
  UserPlus, 
  UserMinus, 
  Package, 
  DollarSign, 
  TrendingUp, 
  Award, 
  RefreshCw,
  AlertTriangle,
  Activity,
  Eye,
  Clock
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className 
}) => {
  return (
    <AdminCard className={cn("hover:shadow-lg transition-shadow", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="admin-text-secondary text-sm font-medium mb-1">{title}</p>
          <p className="admin-text-primary text-2xl font-bold mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && (
            <p className="admin-text-tertiary text-xs">{subtitle}</p>
          )}
          {trend && (
            <p className={cn(
              "text-xs font-medium mt-1",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}>
              {trend.value}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          {icon}
        </div>
      </div>
    </AdminCard>
  );
};

interface UserAnalyticsProps {
  totalUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  deactivatedUsers: number;
  deletedUsers: number;
}

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({
  totalUsers,
  newUsersToday,
  newUsersThisWeek,
  newUsersThisMonth,
  deactivatedUsers,
  deletedUsers,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="admin-text-primary text-lg font-semibold">User Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Total Users"
          value={totalUsers}
          subtitle="All registered users"
          icon={<Users className="h-8 w-8 text-blue-600" />}
          trend={{ value: `${newUsersThisMonth} new this month`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="New Users Today"
          value={newUsersToday}
          subtitle="Registered today"
          icon={<UserPlus className="h-8 w-8 text-green-600" />}
          trend={{ value: `${newUsersThisWeek} this week`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="Deactivated Users"
          value={deactivatedUsers}
          subtitle="Disabled accounts"
          icon={<UserMinus className="h-8 w-8 text-red-600" />}
          trend={{ value: `${deletedUsers} deleted`, isPositive: false }}
        />
      </div>
    </div>
  );
};

interface BoxAnalyticsProps {
  totalBoxesOpened: number;
  boxesOpenedToday: number;
  boxesOpenedThisWeek: number;
  boxesOpenedThisMonth: number;
}

export const BoxAnalytics: React.FC<BoxAnalyticsProps> = ({
  totalBoxesOpened,
  boxesOpenedToday,
  boxesOpenedThisWeek,
  boxesOpenedThisMonth,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="admin-text-primary text-lg font-semibold">Box Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Total Boxes Opened"
          value={totalBoxesOpened}
          subtitle="All time"
          icon={<Package className="h-8 w-8 text-purple-600" />}
          trend={{ value: `${boxesOpenedThisMonth} this month`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="Opened Today"
          value={boxesOpenedToday}
          subtitle="Last 24 hours"
          icon={<RefreshCw className="h-8 w-8 text-blue-600" />}
          trend={{ value: `${boxesOpenedThisWeek} this week`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="This Week"
          value={boxesOpenedThisWeek}
          subtitle="Last 7 days"
          icon={<TrendingUp className="h-8 w-8 text-green-600" />}
          trend={{ value: `${boxesOpenedThisMonth} this month`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="This Month"
          value={boxesOpenedThisMonth}
          subtitle="Last 30 days"
          icon={<Activity className="h-8 w-8 text-orange-600" />}
        />
      </div>
    </div>
  );
};

interface FinancialAnalyticsProps {
  averageSpendPerUser: number;
  totalRevenue: number;
  revenueToday: number;
  revenueThisWeek: number;
  revenueThisMonth: number;
  totalProfit: number;
  profitToday: number;
  profitThisWeek: number;
  profitThisMonth: number;
  profitMargin: number;
}

export const FinancialAnalytics: React.FC<FinancialAnalyticsProps> = ({
  averageSpendPerUser,
  totalRevenue,
  revenueToday,
  revenueThisWeek,
  revenueThisMonth,
  totalProfit,
  profitToday,
  profitThisWeek,
  profitThisMonth,
  profitMargin,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="admin-text-primary text-lg font-semibold">Financial Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Total Revenue"
          value={formatPrice(totalRevenue)}
          subtitle="All time revenue"
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
          trend={{ value: `${formatPrice(revenueThisMonth)} this month`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="Average Spend per User"
          value={formatPrice(averageSpendPerUser)}
          subtitle="Per user average"
          icon={<Users className="h-8 w-8 text-blue-600" />}
        />
        
        <AnalyticsCard
          title="Total Profit"
          value={formatPrice(totalProfit)}
          subtitle={`${profitMargin.toFixed(1)}% margin`}
          icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
          trend={{ value: `${formatPrice(profitThisMonth)} this month`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="Revenue Today"
          value={formatPrice(revenueToday)}
          subtitle="Last 24 hours"
          icon={<Clock className="h-8 w-8 text-orange-600" />}
          trend={{ value: `${formatPrice(revenueThisWeek)} this week`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="Profit Today"
          value={formatPrice(profitToday)}
          subtitle="Last 24 hours"
          icon={<Award className="h-8 w-8 text-yellow-600" />}
          trend={{ value: `${formatPrice(profitThisWeek)} this week`, isPositive: true }}
        />
      </div>
    </div>
  );
};

interface PrizeAnalyticsProps {
  totalPrizesWon: number;
  totalPrizesExchanged: number;
  exchangeFeeRevenue: number;
}

export const PrizeAnalytics: React.FC<PrizeAnalyticsProps> = ({
  totalPrizesWon,
  totalPrizesExchanged,
  exchangeFeeRevenue,
}) => {
  const exchangeRate = totalPrizesWon > 0 ? (totalPrizesExchanged / totalPrizesWon) * 100 : 0;

  return (
    <div className="space-y-6">
      <h3 className="admin-text-primary text-lg font-semibold">Prize Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnalyticsCard
          title="Total Prizes Won"
          value={totalPrizesWon}
          subtitle="All time"
          icon={<Award className="h-8 w-8 text-yellow-600" />}
          trend={{ value: `${totalPrizesExchanged} exchanged`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="Prizes Exchanged"
          value={totalPrizesExchanged}
          subtitle={`${exchangeRate.toFixed(1)}% exchange rate`}
          icon={<RefreshCw className="h-8 w-8 text-green-600" />}
        />
        
        <AnalyticsCard
          title="Exchange Fee Revenue"
          value={formatPrice(exchangeFeeRevenue)}
          subtitle="20% exchange fee"
          icon={<DollarSign className="h-8 w-8 text-purple-600" />}
        />
      </div>
    </div>
  );
};

interface SessionAnalyticsProps {
  activeSessions: number;
  concurrentUsers: number;
}

export const SessionAnalytics: React.FC<SessionAnalyticsProps> = ({
  activeSessions,
  concurrentUsers,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="admin-text-primary text-lg font-semibold">Session Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalyticsCard
          title="Active Sessions"
          value={activeSessions}
          subtitle="Currently online"
          icon={<Activity className="h-8 w-8 text-blue-600" />}
          trend={{ value: `${concurrentUsers} concurrent users`, isPositive: true }}
        />
        
        <AnalyticsCard
          title="Concurrent Users"
          value={concurrentUsers}
          subtitle="Peak usage"
          icon={<Eye className="h-8 w-8 text-green-600" />}
        />
      </div>
    </div>
  );
};

interface QuickAlertsProps {
  pendingWithdrawals: number;
  lowStockAlerts: number;
  systemAlerts: string[];
}

export const QuickAlerts: React.FC<QuickAlertsProps> = ({
  pendingWithdrawals,
  lowStockAlerts,
  systemAlerts,
}) => {
  return (
    <div className="space-y-6">
      <h3 className="admin-text-primary text-lg font-semibold">Quick Alerts</h3>
      <AdminCard>
        <div className="space-y-4">
          {systemAlerts.length > 0 ? (
            systemAlerts.map((alert, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="admin-text-primary text-sm">{alert}</p>
              </div>
            ))
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="h-5 w-5 rounded-full bg-green-500" />
              <p className="admin-text-primary text-sm">All systems operational</p>
            </div>
          )}
        </div>
      </AdminCard>
    </div>
  );
};
