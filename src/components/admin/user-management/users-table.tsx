"use client";

import React, { useState, useCallback } from "react";
import { AdminTable } from "@/components/admin";
import { UserSearchFilters } from "@/components/admin/user-management/user-search-filters";
import { AddUserModal, EditUserModal, DeleteUserModal } from "@/components/admin/user-management/dialogs";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { User } from "@/lib/api/users";
import { useUserOperations } from "@/lib/admin/user-operations";
import Image from "next/image";
import Link from "next/link";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  onRefresh: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  selectedStatus,
  onStatusChange,
  onRefresh,
}) => {
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const { approveUser, disableUser } = useUserOperations();

  // Define columns for the table
  const columns = [
    {
      key: "user",
      label: "User",
      className: "w-1/3", // 33% width for user column
      render: (value: any, row: User) => {
        const fullName = [row.firstName, row.lastName].filter(Boolean).join(" ") || row.username;
        const initialsSource = fullName || row.username || row.email;
        const initials = (initialsSource || "?")
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map(part => part[0]?.toUpperCase() || "")
          .join("");
        const hasAvatar = Boolean(row.avatar);
        return (
          <Link href={`/admin/users/${row.id}`} className="flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
              {hasAvatar ? (
                <Image
                  src={row.avatar as string}
                  alt={fullName}
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <span className="text-xs font-semibold text-white/80">
                  {initials || "?"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="text-blue-400 font-medium truncate hover:text-blue-600 dark:hover:text-blue-600 transition-colors">{fullName}</p>
              <p className="text-xs truncate">{row.email}</p>
            </div>
          </Link>
        );
      },
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
    {
      key: "updatedAt",
      label: "Last Updated",
      className: "w-1/4", // 25% width for updated column
      render: (value: Date) => (
        <span className="admin-text-tertiary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  // Define actions for the table
  const actions = [
    {
      label: "Approve",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (user: User) => handleApproveUser(user),
      show: (user: User) => user.status === "PENDING", // Only for PENDING users
    },
    {
      label: "Disable",
      icon: <XCircle className="h-4 w-4" />,
      onClick: (user: User) => handleDisableUser(user),
      show: (user: User) => user.status === "PENDING" || user.status === "ACTIVE", // PENDING and ACTIVE users can be disabled
    },
    {
      label: "Re-enable",
      icon: <CheckCircle className="h-4 w-4" />,
      onClick: (user: User) => handleApproveUser(user), // Re-enable is same as approve
      show: (user: User) => user.status === "DISABLED", // Only for DISABLED users
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (user: User) => openEditModal(user),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (user: User) => openDeleteModal(user),
      variant: "destructive" as const,
    },
  ];

  const handleSearch = useCallback((filters: any) => {
    setSearchFilters(filters);
    // Apply filters to users list
    // This would typically call an API with filters
    console.log('Searching with filters:', filters);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchFilters({});
    onRefresh();
  }, [onRefresh]);

  const handleAddUserSuccess = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const handleEditUserSuccess = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const handleDeleteUserSuccess = useCallback(() => {
    onRefresh();
  }, [onRefresh]);

  const openEditModal = useCallback((user: User) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  }, []);

  const openDeleteModal = useCallback((user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  }, []);

  const handleApproveUser = useCallback(async (user: User) => {
    await approveUser(user, async () => {
      await onRefresh();
    });
  }, [approveUser, onRefresh]);

  const handleDisableUser = useCallback(async (user: User) => {
    await disableUser(user, async () => {
      await onRefresh();
    });
  }, [disableUser, onRefresh]);

  return (
    <div className="space-y-6">
      {/* Add User Button */}
      <div className="flex justify-end">
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
        >
          <Users className="h-4 w-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Add User</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Enhanced Search and Filters */}
      <UserSearchFilters
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isLoading={isLoading}
      />

      <AdminTable
        title={`Users (${users.length})`}
        description="Manage user accounts, status, and permissions"
        data={users}
        columns={columns}
        actions={actions}
        emptyMessage="No users found"
        loading={isLoading}
        searchPlaceholder="Search users by name or email..."
        statusFilter={{
          value: selectedStatus,
          onChange: onStatusChange,
          options: [
            { value: "ALL", label: "All" },
            { value: "PENDING", label: "Pending" },
            { value: "ACTIVE", label: "Active" },
            { value: "DISABLED", label: "Disabled" },
          ],
        }}
      />

      {/* Dialog Components */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddUserSuccess}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={handleEditUserSuccess}
        user={editingUser}
      />

      <DeleteUserModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
        onSuccess={handleDeleteUserSuccess}
        user={userToDelete}
      />
    </div>
  );
};
