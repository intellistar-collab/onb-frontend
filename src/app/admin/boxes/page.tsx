"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminStats,
  AdminSearchFilter,
  AdminTable,
  AdminBadge,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Users, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { useState, useMemo } from "react";

export default function AdminBoxes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Mock box data
  const boxes = [
    {
      id: "1",
      name: "Premium Mystery Box",
      description: "High-value items for premium users",
      price: 99.99,
      items: 5,
      sold: 45,
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Gaming Bundle",
      description: "Gaming accessories and collectibles",
      price: 149.99,
      items: 3,
      sold: 23,
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: "3",
      name: "Mystery Box",
      description: "Surprise items for adventurous users",
      price: 49.99,
      items: 3,
      sold: 8,
      status: "draft",
      createdAt: "2024-01-12",
    },
  ];

  const filteredBoxes = useMemo(() => {
    return boxes.filter((box) => {
      const matchesSearch =
        box.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "ALL" || box.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [boxes, searchTerm, selectedStatus]);

  const stats = [
    {
      label: "Total Boxes",
      value: boxes.length,
      icon: <Package className="h-8 w-8 text-blue-600" />,
    },
    {
      label: "Active Boxes",
      value: boxes.filter((b) => b.status === "active").length,
      icon: <Package className="h-8 w-8 text-green-600" />,
    },
    {
      label: "Total Revenue",
      value: `$${boxes.reduce((sum, b) => sum + b.price * b.sold, 0).toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
    },
    {
      label: "Total Sales",
      value: boxes.reduce((sum, b) => sum + b.sold, 0),
      icon: <Users className="h-8 w-8 text-purple-600" />,
    },
  ];

  const columns = [
    {
      key: "box",
      label: "Box",
      render: (value: any, row: any) => (
        <div>
          <p className="admin-text-primary font-medium">{row.name}</p>
          <p className="admin-text-tertiary text-sm">{row.description}</p>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      render: (value: number) => (
        <span className="admin-text-primary font-medium">${value}</span>
      ),
    },
    {
      key: "items",
      label: "Items",
      render: (value: number) => (
        <span className="admin-text-tertiary">{value} items</span>
      ),
    },
    {
      key: "sold",
      label: "Sold",
      render: (value: number) => (
        <span className="admin-text-tertiary">{value} sold</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variant = value === "active" ? "success" : value === "draft" ? "warning" : "neutral";
        return <AdminBadge variant={variant}>{value.replace("_", " ")}</AdminBadge>;
      },
    },
    {
      key: "createdAt",
      label: "Created",
      render: (value: string) => (
        <span className="admin-text-tertiary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (box: any) => console.log("View box", box),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (box: any) => console.log("Edit box", box),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (box: any) => console.log("Delete box", box),
      variant: "destructive" as const,
    },
    {
      label: "More",
      icon: <MoreVertical className="h-4 w-4" />,
      onClick: (box: any) => console.log("More actions", box),
    },
  ];

  const filterOptions = [
    { value: "active", label: "Active" },
    { value: "sold_out", label: "Sold Out" },
    { value: "draft", label: "Draft" },
    { value: "inactive", label: "Inactive" },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Box Management"
            description="Create and manage mystery boxes for your users"
            actions={
              <Button className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md">
                <Package className="h-4 w-4 mr-2" />
                Create Box
              </Button>
            }
          />

          <AdminStats stats={stats} className="mb-8" />

          <AdminSearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search boxes by name or description..."
            filterValue={selectedStatus}
            onFilterChange={setSelectedStatus}
            filterOptions={filterOptions}
            filterLabel="Status"
            onMoreFilters={() => console.log("More filters")}
          />

          <AdminTable
            title={`Boxes (${filteredBoxes.length})`}
            description="Manage your mystery box catalog and track sales performance"
            data={filteredBoxes}
            columns={columns}
            actions={actions}
            emptyMessage="No boxes found"
          />
        </div>
      </div>
    </AdminRoute>
  );
}