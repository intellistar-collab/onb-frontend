"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminCard,
  AdminDashboardSkeleton,
} from "@/components/admin";
import {
  UserAnalytics,
  BoxAnalytics,
  FinancialAnalytics,
  PrizeAnalytics,
  SessionAnalytics,
  QuickAlerts,
} from "@/components/admin/admin-analytics";
import { DashboardAnalyticsService } from "@/lib/analytics/dashboard-analytics";
import { useState, useEffect } from "react";
import { usersAPI, type User } from "@/lib/api/users";
import { boxesAPI, type Box } from "@/lib/api/boxes";

export default function AdminAnalytics() {
  const [users, setUsers] = useState<User[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [analytics, setAnalytics] = useState<any>(null);

  // Fetch users and boxes for analytics
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users
        const usersData = await usersAPI.getAllUsers();
        const sortedUsers = usersData.sort((a: User, b: User) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sortedUsers);

        // Fetch boxes
        const boxesData = await boxesAPI.getAllBoxes();
        const sortedBoxes = boxesData.sort((a: Box, b: Box) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBoxes(sortedBoxes);

        // Calculate comprehensive analytics
        const analyticsData = await DashboardAnalyticsService.getDashboardAnalytics(
          sortedUsers,
          sortedBoxes
        );
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <AdminRoute>
        <AdminDashboardSkeleton />
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Analytics Dashboard"
            description="Comprehensive insights into your platform's performance and user behavior."
          />

          {/* Comprehensive Analytics */}
          {analytics && (
            <div className="space-y-8">
              <UserAnalytics
                totalUsers={analytics.totalUsers}
                newUsersToday={analytics.newUsersToday}
                newUsersThisWeek={analytics.newUsersThisWeek}
                newUsersThisMonth={analytics.newUsersThisMonth}
                deactivatedUsers={analytics.deactivatedUsers}
                deletedUsers={analytics.deletedUsers}
              />

              <BoxAnalytics
                totalBoxesOpened={analytics.totalBoxesOpened}
                boxesOpenedToday={analytics.boxesOpenedToday}
                boxesOpenedThisWeek={analytics.boxesOpenedThisWeek}
                boxesOpenedThisMonth={analytics.boxesOpenedThisMonth}
              />

              <FinancialAnalytics
                averageSpendPerUser={analytics.averageSpendPerUser}
                totalRevenue={analytics.totalRevenue}
                revenueToday={analytics.revenueToday}
                revenueThisWeek={analytics.revenueThisWeek}
                revenueThisMonth={analytics.revenueThisMonth}
                totalProfit={analytics.totalProfit}
                profitToday={analytics.profitToday}
                profitThisWeek={analytics.profitThisWeek}
                profitThisMonth={analytics.profitThisMonth}
                profitMargin={analytics.profitMargin}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <PrizeAnalytics
                  totalPrizesWon={analytics.totalPrizesWon}
                  totalPrizesExchanged={analytics.totalPrizesExchanged}
                  exchangeFeeRevenue={analytics.exchangeFeeRevenue}
                />

                <SessionAnalytics
                  activeSessions={analytics.activeSessions}
                  concurrentUsers={analytics.concurrentUsers}
                />
              </div>

              <QuickAlerts
                pendingWithdrawals={analytics.pendingWithdrawals}
                lowStockAlerts={analytics.lowStockAlerts}
                systemAlerts={analytics.systemAlerts}
              />
            </div>
          )}
        </div>
      </div>
    </AdminRoute>
  );
}
