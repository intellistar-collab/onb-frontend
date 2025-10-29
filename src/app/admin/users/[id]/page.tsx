"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/ui/user-avatar";
import { ArrowLeft, User as UserIcon, Mail, Calendar, Shield, Wallet, Activity, Settings, Package, TrendingUp, History, BarChart3, Coins, Star, Phone, MapPin, Globe, Users, Award } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import Image from "next/image";
import { usersAPI, User, UserDetails, InventoryItem, WalletTransaction } from "@/lib/api/users";
import { useUserOperations } from "@/lib/admin/user-operations";
import { formatRelativeTime, formatPrice, formatDate } from "@/lib/utils";

interface UserDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserDetailPage({ params }: UserDetailPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsTotal, setTransactionsTotal] = useState(0);
  
  const { approveUser, disableUser } = useUserOperations();

  // Fetch user details
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const resolvedParams = await params;
      const userData = await usersAPI.getUserDetails(resolvedParams.id);
      setUser(userData);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch user details",
        variant: "destructive",
      });
      router.push("/admin/users/list");
    } finally {
      setIsLoading(false);
    }
  }, [params, toast, router]);

  // Fetch user inventory
  const fetchInventory = useCallback(async () => {
    if (!user) return;
    try {
      const inventoryData = await usersAPI.getUserInventory(user.id);
      setInventory(inventoryData);
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
    }
  }, [user]);

  // Fetch user transactions
  const fetchTransactions = useCallback(async (page = 1) => {
    if (!user) return;
    try {
      const transactionsData = await usersAPI.getUserTransactions(user.id, page, 10);
      setTransactions(transactionsData.transactions);
      setTransactionsTotal(transactionsData.total);
      setTransactionsPage(page);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) {
      fetchInventory();
      fetchTransactions();
    }
  }, [user, fetchInventory, fetchTransactions]);

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
          dotColor: "bg-emerald-500",
          textColor: "text-emerald-800 dark:text-emerald-300",
          bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
          borderColor: "border-emerald-300 dark:border-emerald-700",
        };
      case "PENDING":
        return {
          dotColor: "bg-amber-500",
          textColor: "text-amber-800 dark:text-amber-300",
          bgColor: "bg-amber-100 dark:bg-amber-900/30",
          borderColor: "border-amber-300 dark:border-amber-700",
        };
      case "DISABLED":
        return {
          dotColor: "bg-red-500",
          textColor: "text-red-800 dark:text-red-300",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          borderColor: "border-red-300 dark:border-red-700",
        };
      default:
        return {
          dotColor: "bg-slate-500",
          textColor: "text-slate-800 dark:text-slate-300",
          bgColor: "bg-slate-100 dark:bg-slate-800/30",
          borderColor: "border-slate-300 dark:border-slate-600",
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
              <Button onClick={() => router.push("/admin/users/list")}>
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
  
  
  
  const statusConfig = getStatusConfig(user.status);

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.push("/admin/users/list")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
          </div>

          {/* User Info Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <UserAvatar 
                    src={user.avatar} 
                    alt={fullName || user.username || ""} 
                    size="xl" 
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold admin-text-primary">{fullName}</h2>
                      <Badge 
                        variant={user.role === 'ADMIN' ? 'default' : user.role === 'SUPER_ADMIN' ? 'destructive' : 'secondary'}
                        className={`font-semibold ${
                          user.role === 'ADMIN' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : user.role === 'SUPER_ADMIN'
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}
                      >
                        {user.role}
                      </Badge>
                  </div>
                    <p className="admin-text-secondary mb-3">{user.email}</p>
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border-2 shadow-sm ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
                      <div className={`w-2.5 h-2.5 rounded-full mr-2.5 ${statusConfig.dotColor} animate-pulse`}></div>
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
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserIcon className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Full Name</label>
                          <p className="admin-text-primary font-semibold">{fullName}</p>
                        </div>
                    </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Username</label>
                          <p className="admin-text-primary font-mono">{user.username}</p>
                        </div>
                    </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</label>
                      <p className="admin-text-primary">{user.email}</p>
                    </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone Number</label>
                          <p className="admin-text-primary">{user.mobile || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Date of Birth</label>
                          <p className="admin-text-primary">{formatDate(user.dob)}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Gender</label>
                          <p className="admin-text-primary">{user.gender || "Not specified"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Address Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Street Address</label>
                          <p className="admin-text-primary">
                            {user.streetNumberOrName && user.street 
                              ? `${user.streetNumberOrName} ${user.street}` 
                              : user.address || "Not provided"}
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">City</label>
                          <p className="admin-text-primary">{user.city || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">State/Province</label>
                          <p className="admin-text-primary">{user.state || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">ZIP/Postal Code</label>
                          <p className="admin-text-primary">{user.zipCode || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Country</label>
                          <p className="admin-text-primary">{user.country || "Not provided"}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <div className="flex-1">
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Location</label>
                          <p className="admin-text-primary">{user.location || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">User ID</label>
                      <p className="admin-text-primary font-mono text-sm">{user.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Role</label>
                      <div className="mt-1">
                        <Badge 
                          variant={user.role === 'ADMIN' ? 'default' : user.role === 'SUPER_ADMIN' ? 'destructive' : 'secondary'}
                          className={`font-semibold ${
                            user.role === 'ADMIN' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                              : user.role === 'SUPER_ADMIN'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</label>
                      <div className="mt-1">
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border-2 ${statusConfig.bgColor} ${statusConfig.borderColor} shadow-sm`}>
                          <div className={`w-2.5 h-2.5 rounded-full mr-2.5 ${statusConfig.dotColor} animate-pulse`}></div>
                          <span className={statusConfig.textColor}>{user.status}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Created At</label>
                      <p className="admin-text-primary">{formatDate(user.createdAt, "Not available")}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Updated</label>
                      <p className="admin-text-primary">{formatDate(user.updatedAt, "Not available")}</p>
                    </div>
                    {user.lastLogin && (
                      <div>
                        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Last Login</label>
                        <p className="admin-text-primary">{formatDate(user.lastLogin, "Not available")}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Additional Information Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {/* Referral & Tracking Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Referral & Tracking
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Referral Source</label>
                      <p className="admin-text-primary">{user.referralSource || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Affiliate Code</label>
                      <p className="admin-text-primary">{user.affiliateCode || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Campaign</label>
                      <p className="admin-text-primary">{user.campaign || "Not specified"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">UTM Source</label>
                      <p className="admin-text-primary">{user.utmSource || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">UTM Medium</label>
                      <p className="admin-text-primary">{user.utmMedium || "Not provided"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">UTM Campaign</label>
                      <p className="admin-text-primary">{user.utmCampaign || "Not provided"}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">{user.referralCount || 0}</p>
                        <p className="text-sm text-blue-600/80">Referrals</p>
                      </div>
                      <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                        <Coins className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">{user.tokensSpent || 0}</p>
                        <p className="text-sm text-purple-600/80">Tokens Spent</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                      <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <p className="text-3xl font-bold text-green-600">
                        {formatPrice(user.totalWinnings || 0)}
                      </p>
                      <p className="text-sm text-green-600/80">Total Winnings</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg">
                      <Calendar className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                      <p className="text-xl font-bold text-amber-600">
                        {formatRelativeTime(new Date(user.createdAt))}
                      </p>
                      <p className="text-sm text-amber-600/80">Account Age</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Wallet Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6">
                      <h3 className="text-4xl font-bold admin-text-primary mb-2">
                        {formatPrice(user.wallet?.balance || 0)}
                      </h3>
                      <p className="text-sm admin-text-secondary">Current Balance</p>
                      <div className="mt-4 text-xs admin-text-tertiary">
                        Wallet created: {formatRelativeTime(new Date(user.wallet?.createdAt || user.createdAt))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      Financial Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Total Spent</span>
                        <span className="admin-text-primary font-semibold">
                          {formatPrice(user.analytics?.totalSpent || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Total Winnings</span>
                        <span className="admin-text-primary font-semibold text-green-600">
                          {formatPrice(user.analytics?.totalWinnings || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Net Profit/Loss</span>
                        <span className={`font-semibold ${
                          (user.analytics?.totalWinnings || 0) - (user.analytics?.totalSpent || 0) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {formatPrice((user.analytics?.totalWinnings || 0) - (user.analytics?.totalSpent || 0))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Average Box Value</span>
                        <span className="admin-text-primary font-semibold">
                          {formatPrice(user.analytics?.averageBoxValue || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      User Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Total Boxes Opened</span>
                        <span className="admin-text-primary font-semibold">
                          {user.analytics?.totalBoxesOpened || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Total Spent</span>
                        <span className="admin-text-primary font-semibold">
                          {formatPrice(user.analytics?.totalSpent || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Total Winnings</span>
                        <span className="admin-text-primary font-semibold text-green-600">
                          {formatPrice(user.analytics?.totalWinnings || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Average Box Value</span>
                        <span className="admin-text-primary font-semibold">
                          {formatPrice(user.analytics?.averageBoxValue || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Favorite Category</span>
                        <span className="admin-text-primary font-semibold">
                          {user.analytics?.favoriteBoxCategory || "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">User Score</span>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="admin-text-primary font-semibold">
                            {user.score?.score || 0}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Score Source</span>
                        <span className="admin-text-primary font-semibold">
                          {user.score?.source || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Last Activity</span>
                        <span className="admin-text-primary font-semibold">
                          {formatRelativeTime(new Date(user.analytics?.lastActivity || user.updatedAt))}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="admin-text-secondary">Referral Count</span>
                        <span className="admin-text-primary font-semibold">
                          {user.referralCount || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    User Inventory ({inventory.length} items)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {inventory.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                      <p className="admin-text-secondary">No items in inventory</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {inventory.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 mb-3">
                            {item.itemImage && (
                              <Image
                                src={item.itemImage}
                                alt={item.itemName}
                                width={40}
                                height={40}
                                className="rounded"
                              />
                            )}
                            <div className="flex-1">
                              <h4 className="admin-text-primary font-semibold text-sm">
                                {item.itemName}
                              </h4>
                              <p className="admin-text-secondary text-xs">
                                From: {item.boxTitle}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="admin-text-secondary">Price:</span>
                              <span className="admin-text-primary font-semibold">
                                {formatPrice(item.itemPrice)}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="admin-text-secondary">Status:</span>
                              <Badge variant={item.status === 'KEPT' ? 'default' : 'secondary'}>
                                {item.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="admin-text-secondary">Tier:</span>
                              <span className="admin-text-primary">{item.itemTier || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="admin-text-secondary">Odds:</span>
                              <span className="admin-text-primary">{item.itemOdds}</span>
                            </div>
                            <div className="text-xs admin-text-tertiary">
                              {formatRelativeTime(new Date(item.createdAt))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Transaction History ({transactionsTotal} total)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                      <p className="admin-text-secondary">No transactions found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              transaction.type === 'CREDIT' ? 'bg-green-500' : 'bg-red-500'
                            }`}></div>
                            <div>
                              <p className="admin-text-primary font-semibold">
                                {transaction.reason}
                              </p>
                              <p className="admin-text-tertiary text-sm">
                                {formatRelativeTime(new Date(transaction.createdAt))}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.type === 'CREDIT' ? '+' : '-'}{formatPrice(transaction.amount)}
                            </p>
                            <p className="admin-text-tertiary text-sm">
                              {transaction.type}
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Pagination */}
                      {transactionsTotal > 10 && (
                        <div className="flex justify-center gap-2 mt-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchTransactions(transactionsPage - 1)}
                            disabled={transactionsPage === 1}
                          >
                            Previous
                          </Button>
                          <span className="admin-text-secondary text-sm px-4 py-2">
                            Page {transactionsPage} of {Math.ceil(transactionsTotal / 10)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fetchTransactions(transactionsPage + 1)}
                            disabled={transactionsPage >= Math.ceil(transactionsTotal / 10)}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                  </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user.recentActivity && user.recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {user.recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                          <div className="flex-1">
                            <p className="admin-text-primary font-semibold">
                              {activity.action}
                            </p>
                            <p className="admin-text-secondary text-sm">
                              {activity.details}
                            </p>
                            <p className="admin-text-tertiary text-xs mt-1">
                              {formatRelativeTime(new Date(activity.createdAt))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                      <p className="admin-text-secondary">No recent activity</p>
                  </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </AdminRoute>
  );
}
