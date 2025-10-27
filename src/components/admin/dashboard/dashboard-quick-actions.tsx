"use client";

import React from "react";
import { AdminCard, AdminQuickAction } from "@/components/admin";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export const DashboardQuickActions: React.FC = () => {
  const router = useRouter();

  return (
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
  );
};
