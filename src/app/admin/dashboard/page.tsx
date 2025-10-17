"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminStats,
  AdminCard,
  AdminTable,
  AdminQuickAction,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Image as ImageIcon,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usersAPI, type User } from "@/lib/api/users";
import { boxesAPI, type Box } from "@/lib/api/boxes";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const router = useRouter();

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

  // Fetch recent users and boxes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch users
        const usersData = await usersAPI.getAllUsers();
        // Sort by most recent first (newest createdAt first)
        const sortedUsers = usersData.sort((a: User, b: User) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setUsers(sortedUsers);

        // Fetch boxes
        const boxesData = await boxesAPI.getAllBoxes();
        // Sort by most recent first (newest createdAt first)
        const sortedBoxes = boxesData.sort((a: Box, b: Box) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setBoxes(sortedBoxes);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get the 5 most recent users
  const recentUsers = useMemo(() => {
    return users.slice(0, 5).map(user => ({
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    }));
  }, [users]);

  // Get the 5 most recent boxes
  const recentBoxes = useMemo(() => {
    return boxes.slice(0, 5).map(box => ({
      id: box.id,
      title: box.title,
      description: box.description,
      location: box.location,
      price: box.price,
      status: box.isActive ? "ACTIVE" : "INACTIVE",
      createdAt: box.createdAt,
      boxCategory: (box as any).category,
      imageUrl: box.imageUrl,
    }));
  }, [boxes]);

  // Real data stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeBoxes = boxes.filter(box => box.isActive).length;
    const totalRevenue = boxes.reduce((sum, box) => {
      const price = Number(box.price || 0);
      const sold = Number(box.purchasedCount || 0);
      return sum + (price * sold);
    }, 0);
    const totalBoxes = boxes.length;

    return [
      {
        label: "Total Users",
        value: totalUsers,
        icon: <Users className="h-8 w-8 text-blue-600" />,
        trend: { value: `${users.length} registered users`, isPositive: true },
      },
      {
        label: "Active Boxes",
        value: activeBoxes,
        icon: <Package className="h-8 w-8 text-green-600" />,
        trend: { value: `${totalBoxes} total boxes`, isPositive: true },
      },
      {
        label: "Total Revenue",
        value: formatPrice(totalRevenue),
        icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
        trend: { value: "From box sales", isPositive: true },
      },
      {
        label: "Total Boxes",
        value: totalBoxes,
        icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
        trend: { value: `${activeBoxes} active`, isPositive: true },
      },
    ];
  }, [users, boxes]);



  const userColumns = [
    {
      key: "user",
      label: "User",
      className: "w-1/3", // 33% width for user column
      render: (value: any, row: any) => (
        <div>
          <p className="admin-text-primary font-medium">{row.name}</p>
          <p className="admin-text-tertiary text-sm">{row.email}</p>
        </div>
      ),
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
  ];

  const boxColumns = [
    {
      key: "order",
      label: "Order",
      className: "w-16",
      render: (value: any, row: any) => (
        <span className="admin-text-primary font-medium">
          {recentBoxes.findIndex(box => box.id === row.id) + 1}
        </span>
      ),
    },
    {
      key: "box",
      label: "Box",
      className: "w-2/5",
      render: (value: any, row: any) => (
        <div className="flex items-start space-x-4">
          {row.imageUrl ? (
            <Image
              src={row.imageUrl}
              alt={row.title}
              width={80}
              height={80}
              className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-slate-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p 
              className="admin-text-primary font-bold truncate cursor-pointer text-blue-600 dark:text-blue-600 transition-colors"
              onClick={() => router.push(`/admin/boxes/${row.id}`)}
              title="Click to view box details and manage items"
            >
              {row.title}
            </p>
            {row.description ? (
              <div className="relative group mt-2">
                <p 
                  className="admin-text-tertiary text-sm cursor-pointer transition-colors"
                  onClick={() => toggleDescriptionExpansion(row.id)}
                  title="Click to expand/collapse description"
                >
                  {expandedDescriptions.has(row.id) || row.description.length <= 50
                    ? row.description
                    : `${row.description.substring(0, 50)}...`
                  }
                  {row.description.length > 50 && (
                    <span className="text-blue-500 ml-1">
                      {expandedDescriptions.has(row.id) ? " (less)" : " (more)"}
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p className="admin-text-tertiary text-sm italic mt-2">No description</p>
            )}
            <p className="admin-text-tertiary text-xs mt-1">📍 {row.location}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      className: "w-1/6",
      render: (value: any, row: any) => (
        <div className="flex items-center">
          {row.boxCategory ? (
            <>
              <div
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: row.boxCategory.color || "#3b82f6" }}
              />
              <span className="admin-text-primary text-sm font-medium truncate">
                {row.boxCategory.name}
              </span>
            </>
          ) : (
            <span className="admin-text-tertiary text-sm italic">No category</span>
          )}
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      className: "w-20",
      render: (value: string) => (
        <span className="admin-text-primary font-medium">
          {value ? formatPrice(value) : "N/A"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-20",
      render: (value: string) => {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            value === "ACTIVE"
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}>
            {value === "ACTIVE" ? "Active" : "Inactive"}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created",
      className: "w-24",
      render: (value: Date) => (
        <span className="admin-text-tertiary text-sm">
          {new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      ),
    },
  ];

  const boxActions = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (box: any) => router.push(`/admin/boxes/${box.id}`),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (box: any) => router.push(`/admin/boxes/${box.id}`),
    },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Dashboard Overview"
            description="Welcome back! Here's what's happening with your platform today."
          />

          {/* Stats Cards */}
          <AdminStats stats={stats} className="mb-8" />

          {/* Quick Actions */}
          <AdminCard
            className="mb-8"
            header={{
              title: "Quick Actions",
              description: "Common administrative tasks",
            }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <AdminQuickAction
                icon={<Users className="h-6 w-6" />}
                label="Manage Users"
                onClick={() => router.push("/admin/users")}
              />
              <AdminQuickAction
                icon={<Package className="h-6 w-6" />}
                label="Manage Boxes"
                onClick={() => router.push("/admin/boxes")}
              />
              <AdminQuickAction
                icon={<DollarSign className="h-6 w-6" />}
                label="Manage Items"
                onClick={() => router.push("/admin/items")}
              />
              <AdminQuickAction
                icon={<TrendingUp className="h-6 w-6" />}
                label="Box Categories"
                onClick={() => router.push("/admin/box-categories")}
              />
            </div>
          </AdminCard>

          {/* Recent Activity */}
          <div className="space-y-6">
            <AdminTable
              title="Recent Users"
              description="Latest user registrations"
              data={recentUsers}
              columns={userColumns}
              emptyMessage="No recent users"
              loading={isLoading}
            />

            <AdminTable
              title="Recent Boxes"
              description="Latest mystery boxes created"
              data={recentBoxes}
              columns={boxColumns}
              actions={boxActions}
              emptyMessage="No recent boxes"
            />
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}