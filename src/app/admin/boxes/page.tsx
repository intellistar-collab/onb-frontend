"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminStats,
  AdminTable,
  AdminBoxesSkeleton,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Package, DollarSign, Users, Eye, Edit, Trash2, Plus, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { boxesAPI, type Box, type CreateBoxData, type UpdateBoxData } from "@/lib/api/boxes";
import { boxCategoriesAPI, type BoxCategory } from "@/lib/api/box-categories";
import { formatPrice } from "@/lib/utils";

export default function AdminBoxes() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBox, setEditingBox] = useState<Box | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [boxToDelete, setBoxToDelete] = useState<Box | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [categories, setCategories] = useState<BoxCategory[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Form state for add/edit
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    imageUrl: "",
    backgroundImage: "",
    isActive: true,
    order: "",
    boxCategoryId: "",
  });

  // Fetch boxes and categories from API
  const fetchBoxes = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const response = await boxesAPI.getAllBoxes();
      setBoxes(response);
    } catch (error: any) {
      console.error("Failed to fetch boxes:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch boxes",
        variant: "destructive",
      });
    } finally {
      setIsInitialLoading(false);
    }
  }, [toast]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await boxCategoriesAPI.getAllBoxCategories();
      setCategories(response);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchBoxes();
    fetchCategories();
  }, [fetchBoxes, fetchCategories]);

  const filteredBoxes = useMemo(() => {
    return boxes.filter((box) => {
      const matchesSearch =
        box.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        box.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === "ALL" || 
        (selectedStatus === "ACTIVE" && box.isActive) ||
        (selectedStatus === "INACTIVE" && !box.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [boxes, searchTerm, selectedStatus]);

  const handleAddBox = async () => {
    try {
      setIsLoading(true);

      const createBoxData: CreateBoxData = {
        title: formData.title,
        description: formData.description || undefined,
        location: formData.location,
        price: formData.price, // Keep as string
        imageUrl: formData.imageUrl || undefined,
        backgroundImage: formData.backgroundImage || undefined,
        isActive: formData.isActive,
        order: formData.order ? parseInt(formData.order) : 0,
        boxCategoryId: formData.boxCategoryId,
        // Remove purchasedCount, totalRevenue, totalPayout, exchangeablePayout, retainedProfitPercentage from create
      };

      await boxesAPI.createBox(createBoxData);
      toast({
        title: "Success",
        description: "Box created successfully",
      });
      setIsAddModalOpen(false);
      resetForm();
      fetchBoxes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create box",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBox = async () => {
    if (!editingBox) return;

    try {
      setIsLoading(true);

      const updateBoxData: UpdateBoxData = {
        title: formData.title,
        description: formData.description || undefined,
        location: formData.location,
        price: formData.price, // Keep as string
        imageUrl: formData.imageUrl || undefined,
        backgroundImage: formData.backgroundImage || undefined,
        isActive: formData.isActive,
        order: formData.order ? parseInt(formData.order) : 0,
        boxCategoryId: formData.boxCategoryId,
        // Remove purchasedCount, totalRevenue, totalPayout, exchangeablePayout, retainedProfitPercentage from update
      };

      await boxesAPI.updateBox(editingBox.id, updateBoxData);
      toast({
        title: "Success",
        description: "Box updated successfully",
      });
      setIsEditModalOpen(false);
      resetForm();
      fetchBoxes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update box",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBox = async () => {
    if (!boxToDelete) return;

    try {
      setIsLoading(true);
      await boxesAPI.deleteBox(boxToDelete.id);
      toast({
        title: "Success",
        description: "Box deleted successfully",
      });
      setDeleteConfirmOpen(false);
      setBoxToDelete(null);
      fetchBoxes();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete box",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      price: "",
      imageUrl: "",
      backgroundImage: "",
      isActive: true,
      order: "",
      boxCategoryId: "",
    });
  };

  const openEditModal = (box: Box) => {
    setEditingBox(box);
    setFormData({
      title: box.title,
      description: box.description || "",
      location: box.location,
      price: box.price.toString(),
      imageUrl: box.imageUrl,
      backgroundImage: box.backgroundImage || "",
      isActive: box.isActive,
      order: box.order.toString(),
      boxCategoryId: box.boxCategoryId,
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (box: Box) => {
    setBoxToDelete(box);
    setDeleteConfirmOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const response = await boxesAPI.uploadImage(file);
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

  const handleBoxTitleClick = (boxId: string) => {
    router.push(`/admin/boxes/${boxId}`);
  };

  const stats = [
    {
      label: "Total Boxes",
      value: boxes.length,
      icon: <Package className="h-8 w-8 text-blue-600" />,
    },
    {
      label: "Active Boxes",
      value: boxes.filter((b) => b.isActive).length,
      icon: <Package className="h-8 w-8 text-green-600" />,
    },
    {
      label: "Total Revenue",
      value: formatPrice(boxes.reduce((sum, b) => sum + Number(b.totalRevenue), 0)),
      icon: <DollarSign className="h-8 w-8 text-yellow-600" />,
    },
    {
      label: "Total Sales",
      value: boxes.reduce((sum, b) => sum + Number(b.purchasedCount), 0),
      icon: <Users className="h-8 w-8 text-purple-600" />,
    },
  ];

  const columns = [
    {
      key: "order",
      label: "Order",
      className: "w-16",
      render: (value: number) => (
        <span className="admin-text-primary font-medium">
          {value}
        </span>
      ),
    },
    {
      key: "box",
      label: "Box",
      className: "w-2/5",
      render: (value: any, row: Box) => (
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
              onClick={() => handleBoxTitleClick(row.id)}
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
      render: (value: any, row: Box) => (
        <div className="flex items-center">
          {(row as any).category ? (
            <>
              <div
                className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                style={{ backgroundColor: (row as any).category.color || "#3b82f6" }}
              />
              <span className="admin-text-primary text-sm font-medium truncate">
                {(row as any).category.name}
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
      render: (value: any) => (
        <span className="admin-text-primary font-medium">{formatPrice(value)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-20",
      render: (value: any, row: Box) => {
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.isActive 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}>
            {row.isActive ? "Active" : "Inactive"}
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

  const actions = [
    {
      label: "Edit",
      icon: <Edit className="h-4 w-4" />,
      onClick: (box: Box) => openEditModal(box),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (box: Box) => openDeleteModal(box),
      variant: "destructive" as const,
    },
  ];

  const statusFilterOptions = [
    { value: "ALL", label: "All Status" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
  ];

  if (isInitialLoading) {
    return (
      <AdminRoute>
        <AdminBoxesSkeleton />
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto w-full">
          <AdminPageHeader
            title="Box Management"
            description="Create and manage mystery boxes for your users"
            actions={
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <Package className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Create Box</span>
                  <span className="sm:hidden">Create</span>
                </Button>
              </div>
            }
          />

          <AdminStats stats={stats} className="mb-8" />

          <AdminTable
            title={`Boxes (${filteredBoxes.length})`}
            description="Manage your mystery box catalog and track sales performance"
            data={filteredBoxes}
            columns={columns}
            actions={actions}
            emptyMessage="No boxes found"
            loading={isInitialLoading}
            searchPlaceholder="Search boxes by name, description, or location..."
            statusFilter={{
              value: selectedStatus,
              onChange: setSelectedStatus,
              options: statusFilterOptions,
            }}
          />

          {/* Add Box Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Box</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Box Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter box title"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Location *
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter location"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter box description"
                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Price *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.boxCategoryId}
                      onChange={(e) => setFormData({ ...formData, boxCategoryId: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Box Image
                  </label>
                  <div className="space-y-2">
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Enter image URL"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                        id="box-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('box-image-upload')?.click()}
                        disabled={uploadingImage}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Background Image URL
                  </label>
                  <Input
                    value={formData.backgroundImage}
                    onChange={(e) => setFormData({ ...formData, backgroundImage: e.target.value })}
                    placeholder="Enter background image URL"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Display Order
                    </label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      placeholder="0"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-600"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Active
                    </label>
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
                <Button 
                  onClick={handleAddBox} 
                  disabled={isLoading || !formData.title.trim() || !formData.location.trim() || !formData.price || !formData.boxCategoryId}
                  className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Box Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Box</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Box Title *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter box title"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Location *
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Enter location"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter box description"
                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Price *
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0.00"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.boxCategoryId}
                      onChange={(e) => setFormData({ ...formData, boxCategoryId: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Box Image
                  </label>
                  <div className="space-y-2">
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Enter image URL"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file);
                        }}
                        className="hidden"
                        id="edit-box-image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('edit-box-image-upload')?.click()}
                        disabled={uploadingImage}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadingImage ? "Uploading..." : "Upload Image"}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Display Order
                    </label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      placeholder="0"
                      className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <input
                      type="checkbox"
                      id="editIsActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-slate-300 dark:border-slate-600"
                    />
                    <label htmlFor="editIsActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Active
                    </label>
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
                <Button 
                  onClick={handleEditBox} 
                  disabled={isLoading || !formData.title.trim() || !formData.location.trim() || !formData.price || !formData.boxCategoryId}
                  className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  {isLoading ? "Updating..." : "Update"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Delete Box</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete "{boxToDelete?.title}"? This action cannot be undone.
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Warning: This may affect items and orders associated with this box.
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setBoxToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteBox}
                  disabled={isLoading}
                  className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
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