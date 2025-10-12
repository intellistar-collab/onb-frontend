"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminStats,
  AdminCard,
  AdminTable,
  AdminQuickAction,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { usersAPI, type User } from "@/lib/api/users";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent users
  useEffect(() => {
    const fetchRecentUsers = async () => {
      try {
        setIsLoading(true);
        const usersData = await usersAPI.getAllUsers();
        // Sort by most recent first (newest createdAt first)
        const sortedUsers = usersData.sort((a: User, b: User) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sortedUsers);
      } catch (error) {
        console.error("Failed to fetch recent users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentUsers();
  }, []);

  // Get the 5 most recent users
  const recentUsers = useMemo(() => {
    return users.slice(0, 5).map(user => ({
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    }));
  }, [users]);

  // Mock data
  const stats = [
    {
      label: "Total Users",
      value: 1247,
      icon: <Users className="h-8 w-8 text-blue-600" />,
      trend: { value: "+12% from last month", isPositive: true },
    },
    {
      label: "Active Boxes",
      value: 23,
      icon: <Package className="h-8 w-8 text-green-600" />,
      trend: { value: "+3 new this week", isPositive: true },
    },
    {
      label: "Total Revenue",
      value: "$45,231",
      icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
      trend: { value: "+8% from last month", isPositive: true },
    },
    {
      label: "Conversion Rate",
      value: "3.2%",
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      trend: { value: "+0.5% from last month", isPositive: true },
    },
  ];


  const recentBoxes = [
    {
      id: "1",
      name: "Premium Mystery Box",
      price: 99.99,
      sold: 45,
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Gaming Bundle",
      price: 149.99,
      sold: 23,
      status: "active",
      createdAt: "2024-01-14",
    },
  ];

  const userColumns = [
    {
      key: "user",
      label: "User",
      className: "w-1/3", // 33% width for user column
      render: (value: any, row: any) => (
        <div>
          <p className="admin-text-primary font-medium">{row.name}</p>
          <p className="admin-text-tertiary text-sm">{row.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-1/6", // 16% width for status column
      render: (value: string) => {
        const getStatusConfig = (status: string) => {
          switch (status) {
            case "ACTIVE":
              return {
                dotColor: "bg-green-500",
                textColor: "text-green-700 dark:text-green-400",
                bgColor: "bg-green-50 dark:bg-green-900/20",
                borderColor: "border-green-200 dark:border-green-800",
              };
            case "PENDING":
              return {
                dotColor: "bg-yellow-500",
                textColor: "text-yellow-700 dark:text-yellow-400",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                borderColor: "border-yellow-200 dark:border-yellow-800",
              };
            case "DISABLED":
              return {
                dotColor: "bg-red-500",
                textColor: "text-red-700 dark:text-red-400",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                borderColor: "border-red-200 dark:border-red-800",
              };
            default:
              return {
                dotColor: "bg-gray-500",
                textColor: "text-gray-700 dark:text-gray-400",
                bgColor: "bg-gray-50 dark:bg-gray-900/20",
                borderColor: "border-gray-200 dark:border-gray-800",
              };
          }
        };

        const config = getStatusConfig(value);
        
        return (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.borderColor}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${config.dotColor}`}></div>
            <span className={config.textColor}>{value}</span>
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created",
      className: "w-1/4", // 25% width for created column
      render: (value: Date) => (
        <span className="admin-text-tertiary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const boxColumns = [
    { key: "name", label: "Box Name" },
    { key: "price", label: "Price" },
    { key: "sold", label: "Sold" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
  ];

  const boxActions = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (box: any) => console.log("View box", box),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (box: any) => console.log("Edit box", box),
    },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Dashboard Overview"
            description="Welcome back! Here's what's happening with your platform today."
          />

          {/* Stats Cards */}
          <AdminStats stats={stats} className="mb-8" />

          {/* Quick Actions */}
          <AdminCard
            className="mb-8"
            header={{
              title: "Quick Actions",
              description: "Common administrative tasks",
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <AdminQuickAction
                icon={<Users className="h-6 w-6" />}
                label="Manage Users"
                onClick={() => console.log("Manage Users")}
              />
              <AdminQuickAction
                icon={<Package className="h-6 w-6" />}
                label="Create Box"
                onClick={() => console.log("Create Box")}
              />
              <AdminQuickAction
                icon={<DollarSign className="h-6 w-6" />}
                label="View Reports"
                onClick={() => console.log("View Reports")}
              />
              <AdminQuickAction
                icon={<TrendingUp className="h-6 w-6" />}
                label="Analytics"
                onClick={() => console.log("Analytics")}
              />
            </div>
          </AdminCard>

          {/* Recent Activity */}
          <div className="space-y-6">
            <AdminTable
              title="Recent Users"
              description="Latest user registrations"
              data={recentUsers}
              columns={userColumns}
              emptyMessage="No recent users"
              loading={isLoading}
            />

            <AdminTable
              title="Recent Boxes"
              description="Latest mystery boxes created"
              data={recentBoxes}
              columns={boxColumns}
              actions={boxActions}
              emptyMessage="No recent boxes"
            />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}