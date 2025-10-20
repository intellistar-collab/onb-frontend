"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminStats,
  AdminTable,
  AdminBadge,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Shield, Edit, Trash2, MoreVertical, Plus, Save, X, CheckCircle, UserX, UserCheck } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import Image from "next/image";
import { usersAPI, User, CreateUserData, UpdateUserData } from "@/lib/api/users";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "PENDING",
    password: "",
    confirmPassword: "",
  });

  // Fetch users from API
  const fetchUsers = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const usersData = await usersAPI.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsInitialLoading(false);
    }
  }, [toast]);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // CRUD Functions
  const handleAddUser = async () => {
    try {
      setIsLoading(true);
      
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        return;
      }
      
      // Validate password strength
      if (formData.password.length < 6) {
        toast({
          title: "Error",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return;
      }
      
      const createUserData: CreateUserData = {
        email: formData.email,
        username: formData.name,
        role: "USER", // Explicitly set to USER (backend will also set this)
        status: formData.status,
        password: formData.password,
      };
      
      await usersAPI.createUser(createUserData);
      
      toast({
        title: "Success",
        description: "User added successfully",
      });
      
      setIsAddModalOpen(false);
      resetForm();
      // Refresh the users list
      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;
    
    try {
      setIsLoading(true);
      
      // Validate password if provided
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match",
            variant: "destructive",
          });
          return;
        }
        
        if (formData.password.length < 6) {
          toast({
            title: "Error",
            description: "Password must be at least 6 characters long",
            variant: "destructive",
          });
          return;
        }
      }
      
      const updateUserData: UpdateUserData = {
        email: formData.email,
        username: formData.name,
        status: formData.status,
      };
      
      // Only include password if it's provided
      if (formData.password) {
        (updateUserData as any).password = formData.password;
      }
      
      await usersAPI.updateUser(editingUser.id, updateUserData);
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
      setIsEditModalOpen(false);
      setEditingUser(null);
      resetForm();
      // Refresh the users list
      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setIsLoading(true);
      
      await usersAPI.deleteUser(userToDelete.id);
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      // Refresh the users list
      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveUser = async (user: User) => {
    try {
      setIsLoading(true);
      
      await usersAPI.updateUser(user.id, { status: "ACTIVE" });
      
      toast({
        title: "Success",
        description: "User approved successfully",
      });
      
      // Refresh the users list
      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableUser = async (user: User) => {
    try {
      setIsLoading(true);
      
      await usersAPI.updateUser(user.id, { status: "DISABLED" });
      
      toast({
        title: "Success",
        description: "User disabled successfully",
      });
      
      // Refresh the users list
      await fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to disable user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      status: "PENDING",
      password: "",
      confirmPassword: "",
    });
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.username,
      email: user.email,
      status: user.status,
      password: "",
      confirmPassword: "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
  };


  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "" || user.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, selectedStatus]);

  // Calculate stats based on user status
  const stats = [
    {
      label: "Total Users",
      value: users.length,
      icon: <Users className="h-8 w-8 text-blue-600" />,
    },
    {
      label: "Active Users",
      value: users.filter((u) => u.status === "ACTIVE").length,
      icon: <Users className="h-8 w-8 text-green-600" />,
    },
    {
      label: "Pending Users",
      value: users.filter((u) => u.status === "PENDING").length,
      icon: <Users className="h-8 w-8 text-yellow-600" />,
    },
    {
      label: "Disabled Users",
      value: users.filter((u) => u.status === "DISABLED").length,
      icon: <Users className="h-8 w-8 text-red-600" />,
    },
  ];

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
          <div className="flex items-center gap-3">
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
              <p className="admin-text-primary font-medium truncate">{fullName}</p>
              <p className="admin-text-tertiary text-xs truncate">{row.email}</p>
            </div>
          </div>
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

  const actions = [
    {
      label: "Approve",
      icon: <UserCheck className="h-4 w-4" />,
      onClick: (user: User) => handleApproveUser(user),
      show: (user: User) => user.status === "PENDING", // Only for PENDING users
    },
    {
      label: "Disable",
      icon: <UserX className="h-4 w-4" />,
      onClick: (user: User) => handleDisableUser(user),
      show: (user: User) => user.status === "PENDING" || user.status === "ACTIVE", // PENDING and ACTIVE users can be disabled
    },
    {
      label: "Re-enable",
      icon: <UserCheck className="h-4 w-4" />,
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

  const filterOptions = [
    { value: "MODERATOR", label: "Moderator" },
    { value: "USER", label: "User" },
  ];

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto w-full">
          <AdminPageHeader
            title="User Management"
            description="Manage user accounts and permissions"
            actions={
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <Users className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add User</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            }
          />

          <AdminStats stats={stats} className="mb-8" />

          <AdminTable
            title={`Users (${filteredUsers.length})`}
            description="Manage user accounts, status, and permissions"
            data={filteredUsers}
            columns={columns}
            actions={actions}
            emptyMessage="No users found"
            loading={isInitialLoading}
            searchPlaceholder="Search users by name or email..."
            statusFilter={{
              value: selectedStatus,
              onChange: setSelectedStatus,
              options: [
                { value: "ALL", label: "All" },
                { value: "PENDING", label: "Pending" },
                { value: "ACTIVE", label: "Active" },
                { value: "DISABLED", label: "Disabled" },
              ],
            }}
          />

          {/* Add User Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter user name"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      resetForm();
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddUser}
                    disabled={isLoading || !formData.name || !formData.email || !formData.password}
                    className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                  >
                    {isLoading ? "Adding..." : "Add User"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit User Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter user name"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email address"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Password (leave blank to keep current)
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="DISABLED">Disabled</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingUser(null);
                      resetForm();
                    }}
                    disabled={isLoading}
                    className="admin-button-secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditUser}
                    disabled={isLoading || !formData.name || !formData.email}
                    className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                  >
                    {isLoading ? "Updating..." : "Update User"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete user <strong>{userToDelete?.username}</strong>? 
                  This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setDeleteConfirmOpen(false);
                      setUserToDelete(null);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteUser}
                    disabled={isLoading}
                    className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                  >
                    {isLoading ? "Deleting..." : "Delete User"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminRoute>
  );
}