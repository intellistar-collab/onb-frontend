"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminUsersSkeleton,
} from "@/components/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersOverview, UsersTable, UsersAnalytics } from "@/components/admin/user-management";
import { calculateUserStats } from "@/lib/admin/user-analytics";
import { Users, BarChart3, Activity } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import { usersAPI, User } from "@/lib/api/users";

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("users");
  const { toast } = useToast();

  // Fetch users from API
  const fetchUsers = useCallback(async (filters = {}) => {
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


  // Handle user profile view

  // Handle user updates
  const handleUserUpdate = async (userId: string, updates: any) => {
    try {
      // This would call the API to update the user
      console.log('Updating user:', userId, updates);
      // await usersAPI.updateUser(userId, updates);
      
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);






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
  const stats = useMemo(() => calculateUserStats(users), [users]);


  if (isInitialLoading) {
    return (
      <AdminRoute>
        <AdminUsersSkeleton />
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="w-full">
          <AdminPageHeader
            title="User Management"
            description="Manage user accounts and permissions"
          />

          {/* Tabbed Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users ({filteredUsers.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <UsersOverview
                users={users}
                stats={stats}
                onViewUsers={() => setActiveTab("users")}
                onViewAnalytics={() => setActiveTab("analytics")}
              />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <UsersTable
                users={filteredUsers}
                isLoading={isInitialLoading}
                selectedStatus={selectedStatus}
                onStatusChange={setSelectedStatus}
                onRefresh={fetchUsers}
              />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <UsersAnalytics
                users={users}
              />
            </TabsContent>
          </Tabs>

        </div>
      </div>

    </AdminRoute>
  );
}