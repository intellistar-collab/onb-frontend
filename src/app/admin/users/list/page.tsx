"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader, AdminTable } from "@/components/admin";
import { UserSearchFilters } from "@/components/admin/user-management/user-search-filters";
import { AddUserModal, EditUserModal, DeleteUserModal } from "@/components/admin/user-management/dialogs";
import { Button } from "@/components/ui/button";
import { Users, Edit, Trash2, CheckCircle, XCircle, FolderOpen } from "lucide-react";
import { usersAPI, User } from "@/lib/api/users";
import { useUserOperations } from "@/lib/admin/user-operations";
import { formatRelativeTime } from "@/lib/utils";
import UserAvatar from "@/components/ui/user-avatar";
import Link from "next/link";

export default function UsersListPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchFilters, setSearchFilters] = useState<any>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  const { approveUser, disableUser } = useUserOperations();

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

  // Filter users based on status and search filters
  const filteredUsers = users.filter(user => {
    const statusMatch = selectedStatus === "all" || user.status === selectedStatus;
    const searchMatch = Object.keys(searchFilters).length === 0 || 
      Object.entries(searchFilters).every(([key, value]) => {
        if (!value) return true;
        const userValue = (user as any)[key];
        return userValue && userValue.toString().toLowerCase().includes(value.toString().toLowerCase());
      });
    return statusMatch && searchMatch;
  });

  // Define columns for the table
  const columns = [
    {
      key: "user",
      label: "User",
      className: "w-1/4",
      render: (value: any, row: User) => {
        const fullName = [row.firstName, row.lastName].filter(Boolean).join(" ") || row.username;

        return (
          <div className="flex items-center gap-3">
            <UserAvatar 
              src={row.avatar} 
              alt={fullName || row.username || ""} 
              size="md" 
            />
            <div className="flex-1 min-w-0">
              <Link 
                href={`/admin/users/${row.id}`}
                className="font-medium admin-text-primary hover:text-blue-400 transition-colors"
              >
                {fullName || row.username}
              </Link>
              <p className="text-sm admin-text-secondary truncate">{row.email}</p>
            </div>
          </div>
        );
      }
    },
    {
      key: "status",
      label: "Status",
      className: "w-1/8",
      render: (value: any, row: User) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          row.status === "ACTIVE" 
            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
            : row.status === "PENDING"
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: "role",
      label: "Role",
      className: "w-1/8",
      render: (value: any, row: User) => (
        <span className="admin-text-primary capitalize">{row.role?.toLowerCase() || "User"}</span>
      )
    },
    {
      key: "createdAt",
      label: "Joined",
      className: "w-1/6",
      render: (value: any, row: User) => {
        const createdDate = new Date(row.createdAt);

        return (
          <div className="flex flex-col">
            <span className="admin-text-primary text-sm font-medium">
              {formatRelativeTime(createdDate)}
            </span>
            <span className="admin-text-tertiary text-xs">
              {createdDate.toLocaleDateString()}
            </span>
          </div>
        );
      }
    }
  ];

  // Define actions for the table
  const actions = [
    {
      label: "Approve",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      variant: "ghost" as const,
      className: "hover:bg-green-50 dark:hover:bg-green-900/20",
      onClick: (row: User) => {
        if (row.status === "PENDING") {
          approveUser(row, () => fetchUsers());
        }
      },
      show: (row: User) => row.status === "PENDING"
    },
    {
      label: "Re-enable",
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      variant: "ghost" as const,
      className: "hover:bg-green-50 dark:hover:bg-green-900/20",
      onClick: (row: User) => {
        if (row.status === "DISABLED") {
          approveUser(row, () => fetchUsers());
        }
      },
      show: (row: User) => row.status === "DISABLED"
    },
    {
      label: "Disable",
      icon: <XCircle className="h-4 w-4 text-orange-600" />,
      variant: "ghost" as const,
      className: "hover:bg-orange-50 dark:hover:bg-orange-900/20",
      onClick: (row: User) => {
        if (row.status === "ACTIVE") {
          disableUser(row, () => fetchUsers());
        }
      },
      show: (row: User) => row.status === "ACTIVE"
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4 text-blue-600" />,
      variant: "ghost" as const,
      className: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
      onClick: (row: User) => {
        setEditingUser(row);
        setIsEditModalOpen(true);
      }
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4 text-red-600" />,
      variant: "ghost" as const,
      className: "hover:bg-red-50 dark:hover:bg-red-900/20",
      onClick: (row: User) => {
        setUserToDelete(row);
        setDeleteConfirmOpen(true);
      }
    }
  ];

  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
    fetchUsers();
  };

  const handleDeleteSuccess = () => {
    setDeleteConfirmOpen(false);
    setUserToDelete(null);
    fetchUsers();
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchUsers();
  };

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="w-full">
          <AdminPageHeader
            title="User Management"
            description="Manage user accounts and permissions"
            actions={
                <div className="flex gap-2">
                    <Button
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                      <FolderOpen className="h-4 w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Add User</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            }
          />
          
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="admin-card p-6">              
              <UserSearchFilters
                onSearch={(filters) => {
                  setSearchFilters(filters);
                  setSelectedStatus(filters.status || "all");
                }}
                onClear={() => {
                  setSearchFilters({});
                  setSelectedStatus("all");
                }}
                isLoading={isLoading}
              />
            </div>

            {/* Users Table */}
            <div className="admin-card p-6">
              <AdminTable
                title="Users"
                data={filteredUsers}
                columns={columns}
                actions={actions}
                loading={isLoading}
                emptyMessage="No users found"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={handleEditSuccess}
        user={editingUser}
      />

      <DeleteUserModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
        onSuccess={handleDeleteSuccess}
        user={userToDelete}
      />
    </AdminRoute>
  );
}