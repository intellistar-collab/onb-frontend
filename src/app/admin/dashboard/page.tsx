"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader, AdminDashboardSkeleton } from "@/components/admin";
import {
  DashboardOverview,
  DashboardQuickActions,
  DashboardUsersTable,
  DashboardBoxesTable,
} from "@/components/admin/dashboard";
import {
  useUsers,
  useBoxes,
  useBoxCategories,
  useItems,
  type User,
  type Box,
} from "@/hooks";
import { useState, useMemo } from "react";

export default function AdminDashboard() {
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  
  // Core data hooks
  const { users, isLoading: usersLoading, updateUser } = useUsers();
  const { boxes, isLoading: boxesLoading } = useBoxes();
  
  const isLoading = usersLoading || boxesLoading;

  // Dashboard stats calculation
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeBoxes = boxes.filter(box => box.isActive).length;
    const totalRevenue = boxes.reduce((sum, box) => {
      const price = typeof box.price === 'string' ? parseFloat(box.price) : box.price;
      return sum + price;
    }, 0);

    return [
      {
        label: "Total Users",
        value: totalUsers.toLocaleString(),
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        trend: {
          value: "+12%",
          isPositive: true,
        },
      },
      {
        label: "Active Boxes",
        value: activeBoxes.toLocaleString(),
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        trend: {
          value: "+8%",
          isPositive: true,
        },
      },
      {
        label: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        trend: {
          value: "+23%",
          isPositive: true,
        },
      },
    ];
  }, [users, boxes]);

  // Dashboard users (today's users and pending approvals)
  const dashboardUsers = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return users
      .filter(user => {
        const userDate = new Date(user.createdAt);
        userDate.setHours(0, 0, 0, 0);
        const isToday = userDate.getTime() === today.getTime();
        const isPending = user.status === 'PENDING';
        return isToday || isPending;
      })
      .slice(0, 10)
      .map(user => ({
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: new Date(user.createdAt),
      }));
  }, [users]);

  // Dashboard boxes (recent boxes)
  const dashboardBoxes = useMemo(() => {
    return boxes.slice(0, 5).map(box => ({
      id: box.id,
      title: box.title,
      description: box.description,
      price: typeof box.price === 'string' ? parseFloat(box.price) : box.price,
      status: box.isActive ? 'ACTIVE' : 'DRAFT',
      createdAt: new Date(box.createdAt),
      imageUrl: box.imageUrl,
    }));
  }, [boxes]);

  // Daily metrics data for chart
  const dailyMetricsData = useMemo(() => {
    const today = new Date();
    const last10Days = Array.from({ length: 10 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (9 - i)); // Start from 9 days ago to today
      
      // Generate realistic data with some variation
      const baseRevenue = 1200 + (i * 200) + Math.random() * 500;
      const baseBoxes = 40 + (i * 3) + Math.random() * 20;
      const baseUsers = 10 + (i * 2) + Math.random() * 15;
      
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.round(baseRevenue),
        openBoxCount: Math.round(baseBoxes),
        newUsersCount: Math.round(baseUsers),
        formattedDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      };
    });
    
    return last10Days;
  }, []);

  // Toggle description expansion
  const toggleDescriptionExpansion = (boxId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(boxId)) {
        newSet.delete(boxId);
      } else {
        newSet.add(boxId);
      }
      return newSet;
    });
  };

  // Handle user approval/denial
  const handleUserApproval = async (userId: string, action: 'approve' | 'deny') => {
    try {
      const newStatus = action === 'approve' ? 'ACTIVE' : 'DISABLED';
      await updateUser(userId, { status: newStatus });
      } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  if (isLoading) {
    return (
      <AdminRoute>
        <AdminDashboardSkeleton />
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Dashboard Overview"
            description="Welcome back! Here's what's happening with your platform today."
          />

          {/* Chart and Stats Overview */}
          <DashboardOverview 
            stats={stats} 
            dailyMetricsData={dailyMetricsData} 
          />

          {/* Quick Actions */}
          <DashboardQuickActions />

          {/* Recent Activity Tables */}
          <div className="space-y-6">
            <DashboardUsersTable
              users={dashboardUsers}
              isLoading={isLoading}
              onUserApproval={handleUserApproval}
            />

            <DashboardBoxesTable
              boxes={dashboardBoxes}
              expandedDescriptions={expandedDescriptions}
              onToggleDescriptionExpansion={toggleDescriptionExpansion}
            />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}