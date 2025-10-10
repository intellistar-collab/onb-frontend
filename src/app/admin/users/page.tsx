"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminStats,
  AdminSearchFilter,
  AdminTable,
  AdminBadge,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Users, Shield, Edit, Trash2, MoreVertical } from "lucide-react";
import { useState, useMemo } from "react";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const users = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      role: "ADMIN",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2024-01-20",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      role: "USER",
      status: "active",
      createdAt: "2024-01-14",
      lastLogin: "2024-01-19",
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "MODERATOR",
      status: "inactive",
      createdAt: "2024-01-13",
      lastLogin: "2024-01-18",
    },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "ALL" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <Users className="h-8 w-8 text-blue-600" />,
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "active").length,
      icon: <Shield className="h-8 w-8 text-green-600" />,
    },
    {
      label: "Admins",
      value: users.filter((u) => u.role === "ADMIN").length,
      icon: <Users className="h-8 w-8 text-purple-600" />,
    },
    {
      label: "Moderators",
      value: users.filter((u) => u.role === "MODERATOR").length,
      icon: <Users className="h-8 w-8 text-orange-600" />,
    },
  ];

  const columns = [
    {
      key: "user",
      label: "User",
      render: (value: any, row: any) => (
        <div>
          <p className="admin-text-primary font-medium">{row.name}</p>
          <p className="admin-text-tertiary text-sm">{row.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value: string) => {
        const variant = value === "ADMIN" ? "error" : value === "MODERATOR" ? "warning" : "info";
        return <AdminBadge variant={variant}>{value}</AdminBadge>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variant = value === "active" ? "success" : "neutral";
        return <AdminBadge variant={variant}>{value}</AdminBadge>;
      },
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: string) => (
        <span className="admin-text-tertiary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "lastLogin",
      label: "Last Login",
      render: (value: string) => (
        <span className="admin-text-tertiary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (user: any) => console.log("Edit user", user),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (user: any) => console.log("Delete user", user),
      variant: "destructive" as const,
    },
    {
      label: "More",
      icon: <MoreVertical className="h-4 w-4" />,
      onClick: (user: any) => console.log("More actions", user),
    },
  ];

  const filterOptions = [
    { value: "ADMIN", label: "Admin" },
    { value: "MODERATOR", label: "Moderator" },
    { value: "USER", label: "User" },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="User Management"
            description="Manage user accounts and permissions"
            actions={
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 2000);
                  }}
                  className="admin-button-secondary"
                >
                  Test Loading
                </Button>
                <Button className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md">
                  <Users className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            }
          />

          <AdminStats stats={stats} className="mb-8" />

          <AdminSearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search users by name or email..."
            filterValue={selectedRole}
            onFilterChange={setSelectedRole}
            filterOptions={filterOptions}
            filterLabel="Role"
            onMoreFilters={() => console.log("More filters")}
          />

          <AdminTable
            title={`Users (${filteredUsers.length})`}
            description="Manage user accounts, roles, and permissions"
            data={filteredUsers}
            columns={columns}
            actions={actions}
            emptyMessage="No users found"
            loading={isLoading}
          />
        </div>
      </div>
    </AdminRoute>
  );
}