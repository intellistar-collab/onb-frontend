"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, User as UserIcon, Mail, Calendar, Shield, Wallet, Activity, Settings } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import Image from "next/image";
import { usersAPI, User } from "@/lib/api/users";
import { useUserOperations } from "@/lib/admin/user-operations";

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  const { approveUser, disableUser } = useUserOperations();

  // Fetch user details
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const resolvedParams = await params;
      const userData = await usersAPI.getUserById(resolvedParams.id);
      setUser(userData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch user details",
        variant: "destructive",
      });
      router.push("/admin/users");
    } finally {
      setIsLoading(false);
    }
  }, [params, toast, router]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleApproveUser = async () => {
    if (!user) return;
    await approveUser(user, async () => {
      await fetchUser();
    });
  };

  const handleDisableUser = async () => {
    if (!user) return;
    await disableUser(user, async () => {
      await fetchUser();
    });
  };

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

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (!user) {
    return (
      <AdminRoute>
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">User Not Found</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">The user you're looking for doesn't exist.</p>
              <Button onClick={() => router.push("/admin/users")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Users
              </Button>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;
  const initialsSource = fullName || user.username || user.email;
  const initials = (initialsSource || "?")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() || "")
    .join("");
  const hasAvatar = Boolean(user.avatar);
  const statusConfig = getStatusConfig(user.status);

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/users")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
            <div className="flex-1">
              <AdminPageHeader
                title={`${fullName}`}
                description={`User ID: ${user.id}`}
              />
            </div>
          </div>

          {/* User Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5 flex items-center justify-center">
                    {hasAvatar ? (
                      <Image
                        src={user.avatar as string}
                        alt={fullName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-lg font-semibold text-white/80">
                        {initials || "?"}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold admin-text-primary">{fullName}</h2>
                    <p className="admin-text-secondary">{user.email}</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border mt-2 ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${statusConfig.dotColor}`}></div>
                      <span className={statusConfig.textColor}>{user.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {user.status === "PENDING" && (
                    <Button onClick={handleApproveUser} className="bg-green-600 hover:bg-green-700">
                      <Shield className="h-4 w-4 mr-2" />
                      Approve User
                    </Button>
                  )}
                  {(user.status === "PENDING" || user.status === "ACTIVE") && (
                    <Button 
                      variant="outline" 
                      onClick={handleDisableUser}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Disable User
                    </Button>
                  )}
                  {user.status === "DISABLED" && (
                    <Button onClick={handleApproveUser} className="bg-green-600 hover:bg-green-700">
                      <Shield className="h-4 w-4 mr-2" />
                      Re-enable User
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Full Name</label>
                      <p className="admin-text-primary">{fullName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Username</label>
                      <p className="admin-text-primary">{user.username}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
                      <p className="admin-text-primary">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Role</label>
                      <Badge variant="secondary">{user.role}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</label>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${statusConfig.dotColor}`}></div>
                        <span className={statusConfig.textColor}>{user.status}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">User ID</label>
                      <p className="admin-text-primary font-mono text-sm">{user.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Created At</label>
                      <p className="admin-text-primary">{new Date(user.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Updated</label>
                      <p className="admin-text-primary">{new Date(user.updatedAt).toLocaleString()}</p>
                    </div>
                    {user.lastLogin && (
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Login</label>
                        <p className="admin-text-primary">{new Date(user.lastLogin).toLocaleString()}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="text-2xl font-bold admin-text-primary">
                        ${user.wallet?.balance?.toFixed(2) || "0.00"}
                      </h3>
                      <p className="text-sm admin-text-secondary">Current Balance</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="text-2xl font-bold admin-text-primary">
                        {user.tokensSpent || 0}
                      </h3>
                      <p className="text-sm admin-text-secondary">Tokens Spent</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="text-2xl font-bold admin-text-primary">
                        {user.totalWinnings || 0}
                      </h3>
                      <p className="text-sm admin-text-secondary">Total Winnings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    User Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <p className="admin-text-secondary">Activity logs will be displayed here</p>
                    <p className="text-sm admin-text-tertiary">This feature is coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    User Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Settings className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                    <p className="admin-text-secondary">User settings will be displayed here</p>
                    <p className="text-sm admin-text-tertiary">This feature is coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminRoute>
  );
}
