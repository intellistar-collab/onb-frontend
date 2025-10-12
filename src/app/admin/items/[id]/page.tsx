"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import {
  AdminCard,
  AdminPageHeader,
  AdminStats,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Package, 
  DollarSign, 
  Eye, 
  TrendingUp,
  Edit, 
  Upload, 
  ImageIcon,
  ChevronDown,
  Info,
  BarChart3,
  Star
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { itemsAPI, type Item, type UpdateItemData } from "@/lib/api/items";

export default function ItemDetailPage() {
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  // Form state for editing
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    percentage: "",
    status: "COMMON" as "MOST_WANTED" | "WANTED" | "IN_DEMAND" | "UNCOMMON" | "COMMON",
    boxId: "",
    imageUrl: "",
  });

  // Fetch item data
  const fetchItem = useCallback(async () => {
    if (!itemId) return;
    
    try {
      setIsLoading(true);
      const itemData = await itemsAPI.getItemById(itemId);
      setItem(itemData);
      
      // Set form data for editing
      setFormData({
        name: itemData.name,
        description: itemData.description || "",
        price: itemData.price?.toString() || "",
        percentage: itemData.percentage.toString(),
        status: itemData.status,
        boxId: itemData.boxId || "",
        imageUrl: itemData.imageUrl || "",
      });
    } catch (error: any) {
      console.error("Failed to fetch item:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch item",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [itemId, toast]);

  useEffect(() => {
    setIsMounted(true);
    fetchItem();
  }, [fetchItem]);

  const handleEditItem = async () => {
    if (!item) return;

    try {
      const updateItemData: UpdateItemData = {
        name: formData.name,
        description: formData.description || undefined,
        imageUrl: formData.imageUrl || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        percentage: parseFloat(formData.percentage),
        status: formData.status,
        boxId: formData.boxId || null,
      };

      const updatedItem = await itemsAPI.updateItem(item.id, updateItemData);
      setItem(updatedItem);
      toast({
        title: "Success",
        description: "Item updated successfully",
      });
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const handleDeleteItem = async () => {
    if (!item) return;

    try {
      await itemsAPI.deleteItem(item.id);
      toast({
        title: "Success",
        description: "Item deleted successfully",
      });
      router.push("/admin/items");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete item",
        variant: "destructive",
      });
    }
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

  // Calculate stats
  const stats = useMemo(() => {
    if (!item) return [];

    return [
      {
        label: "Views",
        value: item.viewCount,
        icon: <Eye className="h-8 w-8 text-blue-600" />,
      },
      {
        label: "Clicks",
        value: item.clickCount,
        icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      },
      {
        label: "Price",
        value: item.price ? `$${Number(item.price).toFixed(2)}` : "N/A",
        icon: <DollarSign className="h-8 w-8 text-purple-600" />,
      },
      {
        label: "Percentage",
        value: `${item.percentage}%`,
        icon: <Star className="h-8 w-8 text-orange-600" />,
      },
    ];
  }, [item]);

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="admin-text-secondary">Loading item...</p>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (!item) {
    return (
      <AdminRoute>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="admin-text-secondary">Item not found</p>
              <Button
                onClick={() => router.push("/admin/items")}
                className="mt-4"
              >
                Back to Items
              </Button>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  const statusColors = {
    MOST_WANTED: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    WANTED: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
    IN_DEMAND: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    UNCOMMON: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    COMMON: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  };

  return (
    <AdminRoute>
      <div className="w-full">
        <div className="w-full px-4 sm:px-6">
          {/* Header */}
          <AdminPageHeader
            title={item.name}
            description={`Item ID: ${item.id}`}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8 w-full">
            <Button
              onClick={() => router.push("/admin/items")}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Items</span>
            </Button>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center space-x-2"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Item
              </Button>
              <Button
                onClick={() => setDeleteConfirmOpen(true)}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <Package className="h-4 w-4 mr-2" />
                Delete Item
              </Button>
            </div>
          </div>

          {/* Item Stats Card */}
          <div className="admin-card p-6 mb-6 w-full" suppressHydrationWarning>
            <AdminStats stats={stats} />
          </div>

          {/* Accordion Sections */}
          <div className="space-y-4 w-full">
            {/* Item Information Section */}
            <details open className="group w-full">
              <summary className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 list-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-semibold admin-text-primary">Item Information</h2>
                  </div>
                  <ChevronDown className="h-5 w-5 text-slate-500 transition-transform duration-200 group-open:rotate-180" />
                </div>
              </summary>
              <div className="admin-card p-6 mt-2 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Name</label>
                        <p className="admin-text-primary text-lg font-semibold">{item.name}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Status</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColors[item.status]}`}>
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Price</label>
                        <p className="admin-text-primary text-lg font-bold text-green-600 dark:text-green-400">
                          {item.price ? `$${Number(item.price).toFixed(2)}` : "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Percentage</label>
                        <p className="admin-text-primary text-lg font-semibold">{item.percentage}%</p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Views</label>
                        <p className="admin-text-primary text-lg font-semibold">{item.viewCount}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Clicks</label>
                        <p className="admin-text-primary text-lg font-semibold">{item.clickCount}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Box</label>
                        <p className="admin-text-primary text-lg font-semibold">
                          {item.box ? item.box.title : "Not assigned"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Created</label>
                        <p className="admin-text-primary text-lg font-semibold">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    {item.description && (
                      <div className="mt-6">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Description</label>
                        <p className="admin-text-primary">{item.description}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold admin-text-primary mb-4">Item Image</h3>
                    <div className="relative w-full h-64 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-16 h-16 text-slate-400 mx-auto mb-2" />
                            <p className="admin-text-tertiary">No image</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

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
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleEditItem}
                    disabled={!formData.name || !formData.percentage}
                  >
                    Update Item
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
                  Are you sure you want to delete the item "{item.name}"? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setDeleteConfirmOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteItem}
                  >
                    Delete
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
