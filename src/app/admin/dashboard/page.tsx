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

export default function AdminDashboard() {
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

  const recentUsers = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "USER",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "ADMIN",
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "USER",
      status: "inactive",
      createdAt: "2024-01-13",
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
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Joined" },
  ];

  const boxColumns = [
    { key: "name", label: "Box Name" },
    { key: "price", label: "Price" },
    { key: "sold", label: "Sold" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
  ];

  const userActions = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (user: any) => console.log("View user", user),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (user: any) => console.log("Edit user", user),
    },
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
            actions={
              <Button className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Create New
              </Button>
            }
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              actions={userActions}
              emptyMessage="No recent users"
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