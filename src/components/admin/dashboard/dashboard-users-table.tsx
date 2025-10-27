"use client";

import React from "react";
import { AdminTable } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

// Define types locally for dashboard components
interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
}

interface DashboardUsersTableProps {
  users: DashboardUser[];
  isLoading: boolean;
  onUserApproval: (userId: string, action: 'approve' | 'deny') => void;
}

export const DashboardUsersTable: React.FC<DashboardUsersTableProps> = ({
  users,
  isLoading,
  onUserApproval,
}) => {
  const userColumns = [
    {
      key: "user",
      label: "User",
      className: "w-1/2",
      render: (value: any, row: any) => (
        <div>
          <p className="admin-text-primary font-medium">{row.name}</p>
          <p className="admin-text-tertiary text-sm">{row.email}</p>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      className: "w-1/4",
      render: (value: Date) => (
        <span className="admin-text-tertiary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      className: "w-1/4",
      render: (value: any, row: any) => {
        if (row.status === 'PENDING') {
          return (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-green-600 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20"
                onClick={() => onUserApproval(row.id, 'approve')}
              >
                <Check className="h-3 w-3 mr-1" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-8 px-3 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                onClick={() => onUserApproval(row.id, 'deny')}
              >
                <X className="h-3 w-3 mr-1" />
              </Button>
            </div>
          );
        }
        return (
          <span className="admin-text-tertiary text-sm">
            {row.status === 'ACTIVE' ? 'Active' : 'Processed'}
          </span>
        );
      },
    },
  ];

  return (
    <AdminTable
      title="Today's Users & Pending Approvals"
      description="Users registered today or waiting for admin approval"
      data={users}
      columns={userColumns}
      emptyMessage="No new users or pending approvals"
      loading={isLoading}
    />
  );
};
