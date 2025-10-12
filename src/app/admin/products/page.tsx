"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminStats,
  AdminTable,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Package, Edit, Trash2, MoreVertical, Plus, Save, X, Eye, Upload, Image as ImageIcon } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import { itemsAPI, type Item, type CreateItemData, type UpdateItemData } from "@/lib/api/items";

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    percentage: "",
    status: "COMMON" as "MOST_WANTED" | "WANTED" | "IN_DEMAND" | "UNCOMMON" | "COMMON",
    boxId: "",
    imageUrl: "",
  });

  // Fetch items from API
  const fetchItems = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const response = await itemsAPI.getAllItems({ limit: 1000 }); // Get all items for now
      setItems(response.data);
    } catch (error: any) {
      console.error("Failed to fetch items:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch items",
        variant: "destructive",
      });
    } finally {
      setIsInitialLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAddItem = async () => {
    try {
      setIsLoading(true);

      const createItemData: CreateItemData = {
        name: formData.name,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        percentage: parseFloat(formData.percentage),
        status: formData.status,
        boxId: formData.boxId,
      };

      await itemsAPI.createItem(createItemData);
      toast({
        title: "Success",
        description: "Item created successfully",
      });
      setIsAddModalOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditItem = async () => {
    if (!editingItem) return;

    try {
      setIsLoading(true);

      const updateItemData: UpdateItemData = {
        name: formData.name,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        percentage: parseFloat(formData.percentage),
        status: formData.status,
        boxId: formData.boxId,
      };

      await itemsAPI.updateItem(editingItem.id, updateItemData);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setIsEditModalOpen(false);
      resetForm();
      fetchItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;

    try {
      setIsLoading(true);
      await itemsAPI.deleteItem(itemToDelete.id);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
      fetchItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      percentage: "",
      status: "COMMON",
      boxId: "",
      imageUrl: "",
    });
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price?.toString() || "",
      percentage: item.percentage.toString(),
      status: item.status,
      boxId: item.boxId,
      imageUrl: item.imageUrl || "",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (item: Item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const response = await itemsAPI.uploadImage(file);
      setFormData({ ...formData, imageUrl: response.uploadUrl });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.box.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, selectedStatus]);

  const stats = [
    {
      label: "Total Items",
      value: items.length,
      icon: <Package className="h-8 w-8 text-blue-600" />,
    },
    {
      label: "Most Wanted",
      value: items.filter((item) => item.status === "MOST_WANTED").length,
      icon: <Package className="h-8 w-8 text-red-600" />,
    },
    {
      label: "In Demand",
      value: items.filter((item) => item.status === "IN_DEMAND").length,
      icon: <Package className="h-8 w-8 text-yellow-600" />,
    },
    {
      label: "Common Items",
      value: items.filter((item) => item.status === "COMMON").length,
      icon: <Package className="h-8 w-8 text-green-600" />,
    },
  ];

  const columns = [
    {
      key: "item",
      label: "Item",
      className: "w-1/4",
      render: (value: any, row: Item) => (
        <div className="flex items-center space-x-3">
          {row.imageUrl ? (
            <img
              src={row.imageUrl}
              alt={row.name}
              className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <ImageIcon className="h-5 w-5 text-slate-400" />
            </div>
          )}
          <div>
            <p className="admin-text-primary font-medium">{row.name}</p>
            <p className="admin-text-tertiary text-sm">{row.box.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-1/6",
      render: (value: string) => {
        const getStatusConfig = (status: string) => {
          switch (status) {
            case "MOST_WANTED":
              return {
                dotColor: "bg-red-500",
                textColor: "text-red-700 dark:text-red-400",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                borderColor: "border-red-200 dark:border-red-800",
              };
            case "WANTED":
              return {
                dotColor: "bg-orange-500",
                textColor: "text-orange-700 dark:text-orange-400",
                bgColor: "bg-orange-50 dark:bg-orange-900/20",
                borderColor: "border-orange-200 dark:border-orange-800",
              };
            case "IN_DEMAND":
              return {
                dotColor: "bg-yellow-500",
                textColor: "text-yellow-700 dark:text-yellow-400",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                borderColor: "border-yellow-200 dark:border-yellow-800",
              };
            case "UNCOMMON":
              return {
                dotColor: "bg-blue-500",
                textColor: "text-blue-700 dark:text-blue-400",
                bgColor: "bg-blue-50 dark:bg-blue-900/20",
                borderColor: "border-blue-200 dark:border-blue-800",
              };
            case "COMMON":
              return {
                dotColor: "bg-green-500",
                textColor: "text-green-700 dark:text-green-400",
                bgColor: "bg-green-50 dark:bg-green-900/20",
                borderColor: "border-green-200 dark:border-green-800",
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
            <span className={config.textColor}>{value.replace('_', ' ')}</span>
          </div>
        );
      },
    },
    {
      key: "price",
      label: "Price",
      className: "w-1/6",
      render: (value: number | null) => (
        <span className="admin-text-primary font-medium">
          {value ? `$${value.toFixed(2)}` : "N/A"}
        </span>
      ),
    },
    {
      key: "percentage",
      label: "Percentage",
      className: "w-1/6",
      render: (value: number) => (
        <span className="admin-text-primary font-medium">
          {value.toFixed(1)}%
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      className: "w-1/6",
      render: (value: Date) => (
        <span className="admin-text-tertiary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item: Item) => openEditModal(item),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: Item) => openDeleteModal(item),
      variant: "destructive" as const,
    },
  ];

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto w-full">
          <AdminPageHeader
            title="Product Management"
            description="Manage your product catalog and inventory"
            actions={
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <Package className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Product</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            }
          />

          <AdminStats stats={stats} className="mb-8" />

          <AdminTable
            title={`Products (${filteredItems.length})`}
            description="Manage your product catalog and track inventory"
            data={filteredItems}
            columns={columns}
            actions={actions}
            emptyMessage="No products found"
            loading={isInitialLoading}
            searchPlaceholder="Search products by name, description, or box..."
            statusFilter={{
              value: selectedStatus,
              onChange: setSelectedStatus,
              options: [
                { value: "ALL", label: "All" },
                { value: "MOST_WANTED", label: "Most Wanted" },
                { value: "WANTED", label: "Wanted" },
                { value: "IN_DEMAND", label: "In Demand" },
                { value: "UNCOMMON", label: "Uncommon" },
                { value: "COMMON", label: "Common" },
              ],
            }}
          />

          {/* Add Product Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Product Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Enter price"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Percentage
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    placeholder="Enter percentage"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MOST_WANTED">Most Wanted</option>
                    <option value="WANTED">Wanted</option>
                    <option value="IN_DEMAND">In Demand</option>
                    <option value="UNCOMMON">Uncommon</option>
                    <option value="COMMON">Common</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Box ID
                  </label>
                  <Input
                    value={formData.boxId}
                    onChange={(e) => setFormData({ ...formData, boxId: e.target.value })}
                    placeholder="Enter box ID"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Image URL
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Enter image URL"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploadingImage}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddItem} disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Product Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Product Name
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Enter price"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Percentage
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.percentage}
                    onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                    placeholder="Enter percentage"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="MOST_WANTED">Most Wanted</option>
                    <option value="WANTED">Wanted</option>
                    <option value="IN_DEMAND">In Demand</option>
                    <option value="UNCOMMON">Uncommon</option>
                    <option value="COMMON">Common</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Box ID
                  </label>
                  <Input
                    value={formData.boxId}
                    onChange={(e) => setFormData({ ...formData, boxId: e.target.value })}
                    placeholder="Enter box ID"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Image URL
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Enter image URL"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                      className="hidden"
                      id="edit-image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('edit-image-upload')?.click()}
                      disabled={uploadingImage}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditItem} disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Product"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Product</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete "{itemToDelete?.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setItemToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteItem}
                  disabled={isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminRoute>
  );
}