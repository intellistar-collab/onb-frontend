"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Wallet, 
  Coins, 
  Trophy, 
  History, 
  CreditCard, 
  Shield, 
  Flag,
  Ban,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  MapPin
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useToast } from "@/components/ui/toast";

interface UserProfileModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (userId: string, updates: any) => Promise<void>;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [balanceAdjustment, setBalanceAdjustment] = useState({
    amount: "",
    type: "CREDIT" as "CREDIT" | "DEBIT",
    reason: "",
  });
  const [accountActions, setAccountActions] = useState({
    status: user?.status || "ACTIVE",
    banReason: "",
    flagReason: "",
  });
  const { toast } = useToast();

  const handleBalanceAdjustment = async () => {
    if (!balanceAdjustment.amount || !balanceAdjustment.reason) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await onUpdate(user.id, {
        balanceAdjustment: {
          amount: parseFloat(balanceAdjustment.amount),
          type: balanceAdjustment.type,
          reason: balanceAdjustment.reason,
        },
      });
      
      toast({
        title: "Success",
        description: "Balance adjusted successfully",
      });
      
      setBalanceAdjustment({ amount: "", type: "CREDIT", reason: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to adjust balance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountAction = async () => {
    try {
      setIsLoading(true);
      await onUpdate(user.id, {
        accountAction: {
          status: accountActions.status,
          reason: accountActions.status === "BANNED" ? accountActions.banReason : accountActions.flagReason,
        },
      });
      
      toast({
        title: "Success",
        description: "Account status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update account status",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-6 w-6" />
            User Profile: {user.username}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="wallet">Wallet</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Username</Label>
                    <p className="admin-text-primary">{user.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="admin-text-primary">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Full Name</Label>
                    <p className="admin-text-primary">
                      {user.firstName && user.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : "Not provided"
                      }
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="mt-1">
                      <Badge 
                        variant={user.status === "ACTIVE" ? "default" : "destructive"}
                        className={user.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Account Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="admin-card p-4">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm admin-text-secondary">Wallet Balance</p>
                        <p className="text-lg font-bold admin-text-primary">
                          {formatPrice(user.wallet?.balance || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="admin-card p-4">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      <div>
                        <p className="text-sm admin-text-secondary">Total Winnings</p>
                        <p className="text-lg font-bold admin-text-primary">
                          {formatPrice(user.totalWinnings || 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="admin-card p-4">
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm admin-text-secondary">Tokens Spent</p>
                        <p className="text-lg font-bold admin-text-primary">
                          {user.tokensSpent || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="admin-card p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="text-sm admin-text-secondary">Referrals</p>
                        <p className="text-lg font-bold admin-text-primary">
                          {user.referralCount || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referral Information */}
            {user.referralSource && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Referral Information</h3>
                <div className="admin-card p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Referral Source</Label>
                      <p className="admin-text-primary">{user.referralSource}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Affiliate Code</Label>
                      <p className="admin-text-primary">{user.affiliateCode || "None"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Campaign</Label>
                      <p className="admin-text-primary">{user.campaign || "None"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">UTM Source</Label>
                      <p className="admin-text-primary">{user.utmSource || "None"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Wallet Tab */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Wallet Management</h3>
              
              {/* Current Balance */}
              <div className="admin-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold">Current Balance</h4>
                    <p className="text-3xl font-bold text-green-600">
                      {formatPrice(user.wallet?.balance || 0)}
                    </p>
                  </div>
                  <Wallet className="h-12 w-12 text-green-600" />
                </div>
              </div>

              {/* Balance Adjustment */}
              <div className="admin-card p-6">
                <h4 className="text-lg font-semibold mb-4">Adjust Balance</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={balanceAdjustment.amount}
                        onChange={(e) => setBalanceAdjustment(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="Enter amount"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        value={balanceAdjustment.type}
                        onChange={(e) => setBalanceAdjustment(prev => ({ ...prev, type: e.target.value as "CREDIT" | "DEBIT" }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="CREDIT">Credit (Add)</option>
                        <option value="DEBIT">Debit (Subtract)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      value={balanceAdjustment.reason}
                      onChange={(e) => setBalanceAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                      placeholder="Enter reason for balance adjustment"
                      rows={3}
                    />
                  </div>
                  <Button 
                    onClick={handleBalanceAdjustment}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? "Processing..." : "Adjust Balance"}
                  </Button>
                </div>
              </div>

              {/* Transaction History */}
              <div className="admin-card p-6">
                <h4 className="text-lg font-semibold mb-4">Recent Transactions</h4>
                <div className="space-y-2">
                  {user.transactions?.slice(0, 5).map((transaction: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${transaction.type === 'CREDIT' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="admin-text-primary">{transaction.type}</span>
                        <span className="admin-text-secondary">{transaction.reason}</span>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'CREDIT' ? '+' : '-'}{formatPrice(transaction.amount)}
                        </p>
                        <p className="text-xs admin-text-tertiary">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )) || (
                    <p className="admin-text-secondary text-center py-4">No transactions found</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Activity Logs</h3>
              
              {/* Login History */}
              <div className="admin-card p-6">
                <h4 className="text-lg font-semibold mb-4">Login History</h4>
                <div className="space-y-2">
                  {user.loginHistory?.slice(0, 10).map((login: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="admin-text-primary">Successful Login</span>
                        <span className="admin-text-secondary">{login.ipAddress}</span>
                        <span className="admin-text-secondary">{login.userAgent}</span>
                      </div>
                      <span className="text-sm admin-text-tertiary">
                        {new Date(login.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )) || (
                    <p className="admin-text-secondary text-center py-4">No login history found</p>
                  )}
                </div>
              </div>

              {/* Activity Logs */}
              <div className="admin-card p-6">
                <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
                <div className="space-y-2">
                  {user.activityLogs?.slice(0, 10).map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <History className="h-4 w-4 text-blue-500" />
                        <span className="admin-text-primary">{activity.action}</span>
                        <span className="admin-text-secondary">{activity.details}</span>
                      </div>
                      <span className="text-sm admin-text-tertiary">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                  )) || (
                    <p className="admin-text-secondary text-center py-4">No activity logs found</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Management Tab */}
          <TabsContent value="management" className="space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Account Management</h3>
              
              {/* Account Status */}
              <div className="admin-card p-6">
                <h4 className="text-lg font-semibold mb-4">Account Status</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={accountActions.status}
                      onChange={(e) => setAccountActions(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="SUSPENDED">Suspended</option>
                      <option value="BANNED">Banned</option>
                      <option value="FLAGGED">Flagged</option>
                    </select>
                  </div>
                  
                  {accountActions.status === "BANNED" && (
                    <div>
                      <Label htmlFor="banReason">Ban Reason</Label>
                      <Textarea
                        id="banReason"
                        value={accountActions.banReason}
                        onChange={(e) => setAccountActions(prev => ({ ...prev, banReason: e.target.value }))}
                        placeholder="Enter reason for ban"
                        rows={3}
                      />
                    </div>
                  )}
                  
                  {accountActions.status === "FLAGGED" && (
                    <div>
                      <Label htmlFor="flagReason">Flag Reason</Label>
                      <Textarea
                        id="flagReason"
                        value={accountActions.flagReason}
                        onChange={(e) => setAccountActions(prev => ({ ...prev, flagReason: e.target.value }))}
                        placeholder="Enter reason for flag"
                        rows={3}
                      />
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleAccountAction}
                    disabled={isLoading}
                    variant={accountActions.status === "BANNED" ? "destructive" : "default"}
                    className="w-full"
                  >
                    {isLoading ? "Processing..." : `Update Account Status`}
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="admin-card p-6">
                <h4 className="text-lg font-semibold mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Reset Password
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Flag className="h-4 w-4" />
                    Flag Account
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Ban className="h-4 w-4" />
                    Ban Account
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Send Warning
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
