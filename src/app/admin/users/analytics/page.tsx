"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader } from "@/components/admin";
import { ReferralAnalytics } from "@/components/admin/user-management/referral-analytics";
import { usersAPI, User } from "@/lib/api/users";
import { calculateReferralAnalytics } from "@/lib/admin/user-analytics";
import { AdminUsersSkeleton } from "@/components/admin";

export default function UsersAnalyticsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const usersData = await usersAPI.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const referralData = useMemo(() => {
    return calculateReferralAnalytics(users);
  }, [users]);

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="p-4 sm:p-6">
          <div className="w-full">
            <AdminPageHeader
              title="User Analytics"
              description="Detailed analytics and insights about users"
            />
            <AdminUsersSkeleton />
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="w-full">
          <AdminPageHeader
            title="User Analytics"
            description="Detailed analytics and insights about users"
          />
          
          <div className="space-y-6">
            {referralData && <ReferralAnalytics referralData={referralData} />}
            
            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="admin-card p-6">
                <h3 className="text-lg font-semibold mb-4">User Status Distribution</h3>
                <div className="space-y-3">
                  {[
                    { status: "ACTIVE", count: users.filter(u => u.status === "ACTIVE").length, color: "bg-green-500" },
                    { status: "PENDING", count: users.filter(u => u.status === "PENDING").length, color: "bg-yellow-500" },
                    { status: "DISABLED", count: users.filter(u => u.status === "DISABLED").length, color: "bg-red-500" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                        <span className="admin-text-primary">{item.status}</span>
                      </div>
                      <span className="font-semibold admin-text-primary">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="admin-card p-6">
                <h3 className="text-lg font-semibold mb-4">Registration Trends</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="admin-text-secondary">This Week</span>
                    <span className="font-semibold admin-text-primary">
                      {users.filter(u => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(u.createdAt) >= weekAgo;
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="admin-text-secondary">This Month</span>
                    <span className="font-semibold admin-text-primary">
                      {users.filter(u => {
                        const monthAgo = new Date();
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return new Date(u.createdAt) >= monthAgo;
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="admin-text-secondary">Total Users</span>
                    <span className="font-semibold admin-text-primary">{users.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}