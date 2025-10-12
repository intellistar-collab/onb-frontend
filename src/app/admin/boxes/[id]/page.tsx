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
  Users, 
  Edit, 
  Plus, 
  Trash2, 
  Upload, 
  ImageIcon,
  Eye,
  EyeOff,
  Grid3X3,
  List,
  Tag,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Info,
  BarChart3,
  Package2
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { boxesAPI, type Box, type UpdateBoxData } from "@/lib/api/boxes";
import { itemsAPI, type Item, type CreateItemData, type UpdateItemData } from "@/lib/api/items";

export default function BoxDetailPage() {
  const router = useRouter();
  const params = useParams();
  const boxId = params.id as string;
  
  // State
  const [box, setBox] = useState<Box | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Item | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0); // For slider
  const [isPickRateModalOpen, setIsPickRateModalOpen] = useState(false); // For pick rate modal
  const [isMounted, setIsMounted] = useState(false); // For hydration fix
  const { toast } = useToast();

  // Form state for box edit
  const [boxFormData, setBoxFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    order: "",
    isActive: true,
    boxCategoryId: "",
  });

  // Form state for item add/edit
  const [itemFormData, setItemFormData] = useState({
    name: "",
    description: "",
    price: "",
    percentage: "",
    status: "COMMON" as const,
    imageUrl: "",
  });

  // Fetch box data
  const fetchBox = useCallback(async () => {
    try {
      const boxData = await boxesAPI.getBoxById(boxId);
      setBox(boxData);
      setBoxFormData({
        title: boxData.title,
        description: boxData.description || "",
        price: boxData.price.toString(),
        location: boxData.location,
        order: boxData.order.toString(),
        isActive: boxData.isActive,
        boxCategoryId: boxData.boxCategoryId || "",
      });
    } catch (error: any) {
      console.error("Failed to fetch box:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch box details",
        variant: "destructive",
      });
    }
  }, [boxId, toast]);

  // Fetch items data
  const fetchItems = useCallback(async () => {
    try {
      // Use backend filtering by boxId instead of fetching all items
      const response = await itemsAPI.getItemsByBoxId(boxId);
      console.log("Items API response for boxId", boxId, ":", response);
      
      // Handle paginated response from backend
      let items: Item[] = [];
      if (response && typeof response === 'object') {
        if (Array.isArray(response)) {
          // Direct array response
          items = response;
        } else if ('data' in response && Array.isArray((response as any).data)) {
          // Paginated response with data property
          items = (response as any).data;
        } else {
          console.error("Items API returned unexpected format:", response);
          setItems([]);
          setAllItems([]);
          toast({
            title: "Error",
            description: "Items API returned unexpected data format",
            variant: "destructive",
          });
          return;
        }
      } else {
        console.error("Items API did not return valid data:", response);
        setItems([]);
        setAllItems([]);
        toast({
          title: "Error",
          description: "Items API returned invalid data",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Items found for boxId", boxId, ":", items.length, "items");
      console.log("Items:", items.map(item => ({ id: item.id, name: item.name, boxId: item.boxId })));
      
      setItems(items);
      setAllItems(items); // Store items for consistency
    } catch (error: any) {
      console.error("Failed to fetch items:", error);
      // If the API fails, set empty arrays to prevent crashes
      setItems([]);
      setAllItems([]);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch items. Using empty data.",
        variant: "destructive",
      });
    }
  }, [boxId, toast]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchBox(), fetchItems()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchBox, fetchItems]);

  // Hydration fix
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Slider functions
  const itemsPerSlide = 5;
  const totalSlides = Math.ceil(items.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentSlideItems = () => {
    // During SSR, always show first slide to prevent hydration mismatch
    const slideIndex = isMounted ? currentSlide : 0;
    const startIndex = slideIndex * itemsPerSlide;
    return items.slice(startIndex, startIndex + itemsPerSlide);
  };

  // Pick rate modal functions
  const openPickRateModal = (item: Item) => {
    setEditingItem(item);
    setIsPickRateModalOpen(true);
  };

  const stats = [
    {
      label: "Total Items",
      value: items.length,
      icon: <Package className="h-8 w-8 text-blue-600" />,
    },
    {
      label: "Total Value",
      value: `$${items.reduce((sum, item) => sum + Number(item.price || 0), 0).toFixed(2)}`,
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
    },
    {
      label: "Total Views",
      value: items.reduce((sum, item) => sum + item.viewCount, 0),
      icon: <Eye className="h-8 w-8 text-purple-600" />,
    },
    {
      label: "Total Clicks",
      value: items.reduce((sum, item) => sum + item.clickCount, 0),
      icon: <Users className="h-8 w-8 text-orange-600" />,
    },
  ];

  if (isLoading) {
    return (
      <AdminRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="admin-text-tertiary">Loading box details...</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (!box) {
    return (
      <AdminRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold admin-text-primary mb-2">Box Not Found</h2>
            <p className="admin-text-tertiary mb-4">The box you're looking for doesn't exist.</p>
            <Button onClick={() => router.push("/admin/boxes")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Boxes
            </Button>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="w-full">
        <div className="w-full px-4 sm:px-6">
          {/* Header */}
          <AdminPageHeader
            title={box.title}
            description={`Box ID: ${box.id}`}
          />

          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-8 w-full">
            <Button
              onClick={() => router.push("/admin/boxes")}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Boxes</span>
            </Button>
            <Button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center space-x-2"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Box
            </Button>
          </div>

          {/* Box Stats Card */}
          <div className="admin-card p-6 mb-6 w-full" suppressHydrationWarning>
            <AdminStats stats={stats} />
          </div>

          {/* Accordion Sections */}
          <div className="space-y-4 w-full">
            {/* Box Information Section */}
            <details open className="group w-full">
              <summary className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 list-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h2 className="text-lg font-semibold admin-text-primary">Box Information</h2>
                  </div>
                  <ChevronDown className="h-5 w-5 text-slate-500 transition-transform duration-200 group-open:rotate-180" />
                </div>
              </summary>
              <div className="admin-card p-6 mt-2 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Title</label>
                        <p className="admin-text-primary text-lg font-semibold">{box.title}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Price</label>
                        <p className="admin-text-primary text-lg font-bold text-green-600 dark:text-green-400">${Number(box.price).toFixed(2)}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Location</label>
                        <p className="admin-text-primary text-base flex items-center">
                          <span className="mr-2">📍</span>
                          {box.location}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Category</label>
                        <div className="flex items-center space-x-2">
                          {(box as any).category?.color && (
                            <div 
                              className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 shadow-sm"
                              style={{ backgroundColor: (box as any).category.color }}
                            />
                          )}
                          <p className="admin-text-primary text-base font-medium">{(box as any).category?.name || "No category"}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Status</label>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          box.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {box.isActive ? "✓ Active" : "✗ Inactive"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Order</label>
                        <p className="admin-text-primary text-base font-medium">#{box.order}</p>
                      </div>
                      <div className="md:col-span-2 space-y-1">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Description</label>
                        <p className="admin-text-primary text-base leading-relaxed">{box.description || "No description provided"}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold admin-text-primary mb-4">Box Image</h3>
                    {box.imageUrl ? (
                      <Image
                        src={box.imageUrl}
                        alt={box.title}
                        width={300}
                        height={200}
                        className="w-full h-48 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                      />
                    ) : (
                      <div className="w-full h-48 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </details>


            {/* Assigned Items Section */}
            <details className="group w-full">
              <summary className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 list-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Package2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <h2 className="text-lg font-semibold admin-text-primary">Assigned Items</h2>
                      <p className="text-sm admin-text-tertiary">{items.length} items assigned to this box</p>
                    </div>
                  </div>
                  <ChevronDown className="h-5 w-5 text-slate-500 transition-transform duration-200 group-open:rotate-180" />
                </div>
              </summary>
              <div className="admin-card p-6 mt-2 w-full">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold admin-text-primary">Items in this Box</h3>
                    <p className="admin-text-tertiary mt-1">{items.length} items assigned to this box</p>
                  </div>
                  {isMounted && items.length > itemsPerSlide && (
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevSlide}
                        disabled={currentSlide === 0}
                        className="h-9 w-9 p-0 rounded-lg border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </Button>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {currentSlide + 1}
                        </span>
                        <span className="text-sm text-slate-400 dark:text-slate-500">/</span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {totalSlides}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextSlide}
                        disabled={currentSlide === totalSlides - 1}
                        className="h-9 w-9 p-0 rounded-lg border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                      </Button>
                    </div>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="admin-text-tertiary">Loading items...</p>
                    </div>
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium admin-text-primary mb-2">No Items Assigned</h3>
                    <p className="admin-text-tertiary">This box doesn't have any items assigned to it yet.</p>
                  </div>
                ) : (
                  /* Slider View */
                  <div className="relative" suppressHydrationWarning>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                      {getCurrentSlideItems().map((item) => (
                        <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                          {/* Item Image */}
                          <div className="relative h-40 overflow-hidden">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.name}
                                width={200}
                                height={160}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                <ImageIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
                              </div>
                            )}
                            {/* Status Badge Overlay */}
                            <div className="absolute top-3 right-3">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                item.status === 'MOST_WANTED' ? 'bg-red-500 text-white' :
                                item.status === 'WANTED' ? 'bg-orange-500 text-white' :
                                item.status === 'IN_DEMAND' ? 'bg-yellow-500 text-white' :
                                item.status === 'UNCOMMON' ? 'bg-blue-500 text-white' :
                                'bg-slate-500 text-white'
                              }`}>
                                {item.status.replace("_", " ")}
                              </span>
                            </div>
                          </div>

                          {/* Item Content */}
                          <div className="p-5">
                            {/* Title and Description */}
                            <div className="mb-4">
                              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-1">{item.name}</h3>
                              {item.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">{item.description}</p>
                              )}
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Price</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">
                                  {item.price ? `$${Number(item.price).toFixed(2)}` : "N/A"}
                                </p>
                              </div>
                              <div className="text-center p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Rate</p>
                                <p className="text-lg font-bold text-slate-900 dark:text-white">{item.percentage}%</p>
                              </div>
                            </div>

                            {/* Engagement Stats */}
                            <div className="flex justify-between items-center mb-4 text-sm">
                              <div className="flex items-center text-slate-600 dark:text-slate-300">
                                <Eye className="h-4 w-4 mr-1" />
                                <span className="font-medium">{item.viewCount}</span>
                              </div>
                              <div className="flex items-center text-slate-600 dark:text-slate-300">
                                <Users className="h-4 w-4 mr-1" />
                                <span className="font-medium">{item.clickCount}</span>
                              </div>
                            </div>

                            {/* Action Button */}
                            <Button
                              onClick={() => openPickRateModal(item)}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-all duration-200 hover:shadow-md"
                              size="sm"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Set Pick Rate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </details>
          </div>

          {/* Pick Rate Modal */}
          <Dialog open={isPickRateModalOpen} onOpenChange={setIsPickRateModalOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Set Pick Rate</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {editingItem && (
                  <div className="text-center">
                    <p className="admin-text-primary mb-2">
                      Setting pick rate for: <strong>{editingItem.name}</strong>
                    </p>
                    <p className="admin-text-tertiary text-sm">
                      This feature will be implemented soon.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsPickRateModalOpen(false)}>
                  Close
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminRoute>
  );
}
