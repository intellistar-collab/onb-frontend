"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AdminStats, AdminBadge } from "@/components/admin";
import { Plus, Users, BarChart3 } from "lucide-react";
import { User } from "@/lib/api/users";

interface UsersOverviewProps {
  users: User[];
  stats: Array<{
    label: string;
    value: number;
    icon: string;
    color: string;
  }>;
  onViewUsers: () => void;
  onViewAnalytics: () => void;
}

export const UsersOverview: React.FC<UsersOverviewProps> = ({
  users,
  stats,
  onViewUsers,
  onViewAnalytics,
}) => {
  return (
    <div className="space-y-6">
      <AdminStats stats={stats} />
      
      {/* Quick Actions */}
      <div className="admin-card p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            variant="outline"
            onClick={onViewUsers}
            className="flex items-center gap-2 h-12"
          >
            <Users className="h-4 w-4" />
            View All Users
          </Button>
          <Button 
            variant="outline"
            onClick={onViewAnalytics}
            className="flex items-center gap-2 h-12"
          >
            <BarChart3 className="h-4 w-4" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent User Activity</h3>
        <div className="space-y-3">
          {users.slice(0, 5).map((user, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium admin-text-primary">{user.username}</p>
                  <p className="text-sm admin-text-secondary">{user.email}</p>
                </div>
              </div>
              <div className="text-right">
                <AdminBadge 
                  variant={
                    user.status === "ACTIVE" ? "success" : 
                    user.status === "PENDING" ? "warning" : 
                    "error"
                  }
                >
                  {user.status}
                </AdminBadge>
                <p className="text-xs admin-text-tertiary mt-1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
