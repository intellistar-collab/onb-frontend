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
import { Package, DollarSign, Tag, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { useState, useMemo } from "react";

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Mock product data
  const products = [
    {
      id: "1",
      name: "Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation",
      price: 199.99,
      category: "Electronics",
      stock: 50,
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Gaming Mouse",
      description: "Precision gaming mouse with RGB lighting",
      price: 79.99,
      category: "Gaming",
      stock: 25,
      status: "active",
      createdAt: "2024-01-14",
    },
    {
      id: "3",
      name: "Coffee Mug",
      description: "Ceramic coffee mug with custom design",
      price: 15.99,
      category: "Lifestyle",
      stock: 0,
      status: "out_of_stock",
      createdAt: "2024-01-13",
    },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "ALL" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: <Package className="h-8 w-8 text-blue-600" />,
    },
    {
      label: "Active Products",
      value: products.filter((p) => p.status === "active").length,
      icon: <Tag className="h-8 w-8 text-green-600" />,
    },
    {
      label: "Total Value",
      value: `$${products.reduce((sum, p) => sum + p.price * p.stock, 0).toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
    },
    {
      label: "Categories",
      value: new Set(products.map((p) => p.category)).size,
      icon: <Package className="h-8 w-8 text-purple-600" />,
    },
  ];

  const columns = [
    {
      key: "product",
      label: "Product",
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
      key: "category",
      label: "Category",
      render: (value: string) => (
        <AdminBadge variant="info">{value}</AdminBadge>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      render: (value: number) => (
        <span className={`font-medium ${value > 0 ? 'admin-text-primary' : 'text-red-600'}`}>
          {value}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => {
        const variant = value === "active" ? "success" : "error";
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
      onClick: (product: any) => console.log("View product", product),
    },
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (product: any) => console.log("Edit product", product),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (product: any) => console.log("Delete product", product),
      variant: "destructive" as const,
    },
    {
      label: "More",
      icon: <MoreVertical className="h-4 w-4" />,
      onClick: (product: any) => console.log("More actions", product),
    },
  ];

  const filterOptions = [
    { value: "Electronics", label: "Electronics" },
    { value: "Gaming", label: "Gaming" },
    { value: "Lifestyle", label: "Lifestyle" },
    { value: "Accessories", label: "Accessories" },
  ];

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Product Management"
            description="Manage your product catalog and inventory"
            actions={
              <Button className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md">
                <Package className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            }
          />

          <AdminStats stats={stats} className="mb-8" />

          <AdminSearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Search products by name or description..."
            filterValue={selectedCategory}
            onFilterChange={setSelectedCategory}
            filterOptions={filterOptions}
            filterLabel="Category"
            onMoreFilters={() => console.log("More filters")}
          />

          <AdminTable
            title={`Products (${filteredProducts.length})`}
            description="Manage your product catalog and track inventory"
            data={filteredProducts}
            columns={columns}
            actions={actions}
            emptyMessage="No products found"
          />
        </div>
      </div>
    </AdminRoute>
  );
}