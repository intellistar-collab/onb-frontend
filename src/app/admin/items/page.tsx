"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminStats,
  AdminTable,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Package, 
  Edit, 
  Trash2, 
  Plus, 
  Upload, 
  Image as ImageIcon,
  Eye,
  EyeOff,
  DollarSign,
  TrendingUp,
  Star
} from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import { itemsAPI, type Item, type CreateItemData, type UpdateItemData } from "@/lib/api/items";
import Image from "next/image";

export default function AdminItems() {
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
      const response = await itemsAPI.getAllItems();
      setItems(response);
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
        boxId: formData.boxId || null,
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

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
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
        boxId: formData.boxId || null,
      };

      await itemsAPI.updateItem(editingItem.id, updateItemData);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setIsEditModalOpen(false);
      setEditingItem(null);
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

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price?.toString() || "",
      percentage: item.percentage.toString(),
      status: item.status,
      boxId: item.boxId || "",
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
      setFormData(prev => ({ ...prev, imageUrl: response.uploadUrl }));
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

  // Filter items based on search and status
  const filteredItems = useMemo(() => {
    if (!items || !Array.isArray(items)) {
      return [];
    }
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "ALL" || item.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [items, searchTerm, selectedStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    if (!items || !Array.isArray(items)) {
      return [
        { label: "Total Items", value: 0, icon: <Package className="h-8 w-8 text-blue-600" /> },
        { label: "Most Wanted", value: 0, icon: <Star className="h-8 w-8 text-yellow-600" /> },
        { label: "Total Views", value: 0, icon: <Eye className="h-8 w-8 text-green-600" /> },
        { label: "Total Clicks", value: 0, icon: <TrendingUp className="h-8 w-8 text-purple-600" /> },
      ];
    }
    const totalItems = items.length;
    const mostWantedItems = items.filter(item => item.status === "MOST_WANTED").length;
    const totalViews = items.reduce((sum, item) => sum + item.viewCount, 0);
    const totalClicks = items.reduce((sum, item) => sum + item.clickCount, 0);

    return [
      {
        label: "Total Items",
        value: totalItems,
        icon: <Package className="h-8 w-8 text-blue-600" />,
      },
      {
        label: "Most Wanted",
        value: mostWantedItems,
        icon: <Star className="h-8 w-8 text-yellow-600" />,
      },
      {
        label: "Total Views",
        value: totalViews,
        icon: <Eye className="h-8 w-8 text-green-600" />,
      },
      {
        label: "Total Clicks",
        value: totalClicks,
        icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      },
    ];
  }, [items]);

  // Table columns
  const columns = [
      {
        key: "order",
        label: "Order",
        width: "w-4",
        render: (value: any, row: Item) => {
          const index = filteredItems.findIndex(item => item.id === row.id);
        return (
          <span className="admin-text-secondary font-medium text-xs">{index + 1}</span>
        );
        },
      },
    {
      key: "item",
      label: "Item",
      width: "w-40",
      render: (value: any, row: Item) => (
        <div className="flex items-center space-x-3">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700">
            {row.imageUrl ? (
              <Image
                src={row.imageUrl}
                alt={row.name}
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-slate-400" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="admin-text-primary font-bold truncate">{row.name}</h3>
            {row.description && (
              <p className="admin-text-tertiary text-sm truncate" title={row.description}>
                {row.description}
              </p>
            )}
            {row.box && (
              <p className="admin-text-tertiary text-xs">
                Box: {row.box.title}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      width: "w-20",
      render: (value: any, row: Item) => (
        <span className="admin-text-primary font-medium text-sm">
          {row.price ? `$${Number(row.price).toFixed(2)}` : "N/A"}
        </span>
      ),
    },
    {
      key: "percentage",
      label: "Percentage",
      width: "w-20",
      render: (value: any, row: Item) => (
        <span className="admin-text-primary font-medium text-sm">
          {row.percentage}%
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      width: "w-28",
      render: (value: any, row: Item) => {
        const statusColors = {
          MOST_WANTED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
          WANTED: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
          IN_DEMAND: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
          UNCOMMON: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
          COMMON: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
        };

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[row.status]}`}>
            {row.status.replace("_", " ")}
          </span>
        );
      },
    },
    {
      key: "created",
      label: "Created",
      width: "w-24",
      render: (value: any, row: Item) => (
        <span className="admin-text-secondary text-xs">
          {new Date(row.createdAt).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}
        </span>
      ),
    },
  ];

  // Table actions
  const actions = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (item: Item) => openEditModal(item),
      className: "text-blue-600 hover:text-blue-700",
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (item: Item) => openDeleteModal(item),
      className: "text-red-600 hover:text-red-700",
    },
  ];

  // Status filter options
  const statusOptions = [
    { value: "ALL", label: "All Items", color: "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300" },
    { value: "MOST_WANTED", label: "Most Wanted", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" },
    { value: "WANTED", label: "Wanted", color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400" },
    { value: "IN_DEMAND", label: "In Demand", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" },
    { value: "UNCOMMON", label: "Uncommon", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" },
    { value: "COMMON", label: "Common", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" },
  ];

  if (isInitialLoading) {
    return (
      <AdminRoute>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="admin-text-secondary">Loading items...</p>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="w-full">
          {/* Header */}
          <AdminPageHeader
            title="Items Management"
            description="Manage all items in the system"
            actions={
              <div className="flex gap-2">
                <Button
                  onClick={openAddModal}
                  className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <Plus className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Create Item</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </div>
            }
          />

          {/* Stats Cards */}
          <div className="mb-8">
            <AdminStats stats={stats} />
          </div>

          {/* Table */}
          <AdminTable
            title="Items"
            description={`${filteredItems.length} items found`}
            data={filteredItems}
            columns={columns}
            actions={actions}
            statusFilter={{
              value: selectedStatus,
              onChange: setSelectedStatus,
              options: statusOptions.map(option => ({
                value: option.value,
                label: option.label
              }))
            }}
            showPagination={true}
            pageSize={10}
          />

          {/* Add Item Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter item description"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 admin-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium admin-text-primary mb-2">
                      Price
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-primary mb-2">
                      Percentage *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.percentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
                      placeholder="0.00"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 admin-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="COMMON">Common</option>
                    <option value="UNCOMMON">Uncommon</option>
                    <option value="IN_DEMAND">In Demand</option>
                    <option value="WANTED">Wanted</option>
                    <option value="MOST_WANTED">Most Wanted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Box ID
                  </label>
                  <Input
                    value={formData.boxId}
                    onChange={(e) => setFormData(prev => ({ ...prev, boxId: e.target.value }))}
                    placeholder="Enter box ID (optional)"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Image URL
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="Enter image URL"
                      className="flex-1"
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
                      onClick={() => document.getElementById('image-upload')?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
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
                  <Button
                    className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                    onClick={handleAddItem}
                    disabled={isLoading || !formData.name || !formData.percentage}
                  >
                    {isLoading ? "Creating..." : "Create Item"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Item Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter item description"
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 admin-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium admin-text-primary mb-2">
                      Price
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="0.00"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium admin-text-primary mb-2">
                      Percentage *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.percentage}
                      onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
                      placeholder="0.00"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Status *
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 admin-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="COMMON">Common</option>
                    <option value="UNCOMMON">Uncommon</option>
                    <option value="IN_DEMAND">In Demand</option>
                    <option value="WANTED">Wanted</option>
                    <option value="MOST_WANTED">Most Wanted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Box ID
                  </label>
                  <Input
                    value={formData.boxId}
                    onChange={(e) => setFormData(prev => ({ ...prev, boxId: e.target.value }))}
                    placeholder="Enter box ID (optional)"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium admin-text-primary mb-2">
                    Image URL
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      placeholder="Enter image URL"
                      className="flex-1"
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
                      onClick={() => document.getElementById('edit-image-upload')?.click()}
                      disabled={uploadingImage}
                    >
                      {uploadingImage ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                    onClick={handleEditItem}
                    disabled={isLoading || !formData.name || !formData.percentage}
                  >
                    {isLoading ? "Updating..." : "Update Item"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Delete Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="admin-text-primary">
                  Are you sure you want to delete the item "{itemToDelete?.name}"? This action cannot be undone.
                </p>
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
                    className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                    onClick={handleDeleteItem}
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminRoute>
  );
}