"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminPageHeader,
  AdminStats,
  AdminTable,
  AdminBoxCategoriesSkeleton,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ColorPicker } from "@/components/ui/color-picker";
import { FolderOpen, Edit, Trash2, Plus, Upload, Image as ImageIcon, Palette } from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/toast";
import { boxCategoriesAPI, type BoxCategory, type CreateBoxCategoryData, type UpdateBoxCategoryData } from "@/lib/api/box-categories";

export default function AdminBoxCategories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<BoxCategory | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<BoxCategory | null>(null);
  const [categories, setCategories] = useState<BoxCategory[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  // Form state for add/edit
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    photo: "",
    order: "",
    color: "#3b82f6",
  });

  // Fetch categories from API
  const fetchCategories = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const response = await boxCategoriesAPI.getAllBoxCategories();
      // Sort by order
      const sortedCategories = response.sort((a, b) => a.order - b.order);
      setCategories(sortedCategories);
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setIsInitialLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async () => {
    try {
      setIsLoading(true);

      const createCategoryData: CreateBoxCategoryData = {
        name: formData.name,
        description: formData.description || undefined,
        photo: formData.photo || undefined,
        order: formData.order ? parseInt(formData.order) : 0,
        color: formData.color,
      };

      await boxCategoriesAPI.createBoxCategory(createCategoryData);
      toast({
        title: "Success",
        description: "Category created successfully",
      });
      setIsAddModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editingCategory) return;

    try {
      setIsLoading(true);

      const updateCategoryData: UpdateBoxCategoryData = {
        name: formData.name,
        description: formData.description || undefined,
        photo: formData.photo || undefined,
        order: formData.order ? parseInt(formData.order) : 0,
        color: formData.color,
      };

      await boxCategoriesAPI.updateBoxCategory(editingCategory.id, updateCategoryData);
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      setIsEditModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      setIsLoading(true);
      await boxCategoriesAPI.deleteBoxCategory(categoryToDelete.id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
      setDeleteConfirmOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
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
      photo: "",
      order: "",
      color: "#3b82f6",
    });
  };

  const openEditModal = (category: BoxCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      photo: category.photo || "",
      order: category.order.toString(),
      color: category.color || "#3b82f6",
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: BoxCategory) => {
    setCategoryToDelete(category);
    setDeleteConfirmOpen(true);
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      setUploadingPhoto(true);
      const response = await boxCategoriesAPI.uploadPhoto(file);
      setFormData({ ...formData, photo: response.uploadUrl });
      toast({
        title: "Success",
        description: "Photo uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const toggleDescriptionExpansion = (categoryId: string) => {
    setExpandedDescriptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [categories, searchTerm]);

  const stats = [
    {
      label: "Total Categories",
      value: categories.length,
      icon: <FolderOpen className="h-8 w-8 text-blue-600" />,
    },
    {
      label: "With Photos",
      value: categories.filter((cat) => cat.photo).length,
      icon: <ImageIcon className="h-8 w-8 text-green-600" />,
    },
    {
      label: "With Colors",
      value: categories.filter((cat) => cat.color).length,
      icon: <Palette className="h-8 w-8 text-purple-600" />,
    },
    {
      label: "Active Categories",
      value: categories.length, // All categories are active by default
      icon: <FolderOpen className="h-8 w-8 text-orange-600" />,
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
      key: "category",
      label: "Category",
      className: "w-1/2",
      render: (value: any, row: BoxCategory) => (
        <div className="flex items-start space-x-4">
          {row.photo ? (
            <Image
              src={row.photo}
              alt={row.name}
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
            <p className="admin-text-primary font-bold truncate">{row.name}</p>
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
              <p className="admin-text-tertiary text-sm italic">No description</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "color",
      label: "Color",
      className: "w-1/6",
      render: (value: string | null) => (
        <div className="flex items-center space-x-2">
          <div
            className="w-6 h-6 rounded border border-slate-300 dark:border-slate-600"
            style={{ backgroundColor: value || "#3b82f6" }}
          />
          <span className="admin-text-tertiary text-sm">
            {value || "Default"}
          </span>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Created",
      className: "w-1/6",
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
      onClick: (category: BoxCategory) => openEditModal(category),
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (category: BoxCategory) => openDeleteModal(category),
      variant: "destructive" as const,
    },
  ];

  if (isInitialLoading) {
    return (
      <AdminRoute>
        <AdminBoxCategoriesSkeleton />
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto w-full">
          <AdminPageHeader
            title="Box Categories"
            description="Manage box categories and their properties"
            actions={
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  <FolderOpen className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Category</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            }
          />

          <AdminTable
            title={`Categories (${filteredCategories.length})`}
            description="Manage box categories, colors, and display order"
            data={filteredCategories}
            columns={columns}
            actions={actions}
            emptyMessage="No categories found"
            loading={isInitialLoading}
            searchPlaceholder="Search categories by name or description..."
          />

          {/* Add Category Modal */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter category description"
                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Photo
                    </label>
                    <div className="space-y-2">
                        <Input
                        value={formData.photo}
                        onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                        placeholder="Enter photo URL"
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                        />
                        <div className="flex items-center space-x-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(file);
                            }}
                            className="hidden"
                            id="photo-upload"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('photo-upload')?.click()}
                            disabled={uploadingPhoto}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                        </Button>
                        </div>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    placeholder="Enter display order"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category Color
                  </label>
                  <ColorPicker
                    value={formData.color}
                    onChange={(color) => setFormData({ ...formData, color })}
                  />
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
                  onClick={handleAddCategory} 
                  disabled={isLoading || !formData.name.trim()}
                  className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md text-sm sm:text-base"
                >
                  {isLoading ? "Creating..." : "Create"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Category Modal */}
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter category name"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter category description"
                    className="flex min-h-[80px] w-full rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                  />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Photo
                    </label>
                    <div className="space-y-2">
                        <Input
                        value={formData.photo}
                        onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                        placeholder="Enter photo URL"
                        className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                        />
                        <div className="flex items-center space-x-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handlePhotoUpload(file);
                            }}
                            className="hidden"
                            id="edit-photo-upload"
                        />
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById('edit-photo-upload')?.click()}
                            disabled={uploadingPhoto}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                        </Button>
                        </div>
                    </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Display Order
                  </label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    placeholder="Enter display order"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category Color
                  </label>
                  <ColorPicker
                    value={formData.color}
                    onChange={(color) => setFormData({ ...formData, color })}
                  />
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
                  onClick={handleEditCategory} 
                  disabled={isLoading || !formData.name.trim()}
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
                <DialogTitle>Delete Category</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
                </p>
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                  Warning: This may affect boxes that use this category.
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setCategoryToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteCategory}
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
