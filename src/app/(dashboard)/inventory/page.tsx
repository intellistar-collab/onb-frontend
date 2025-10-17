"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { inventoryAPI, type InventoryItem } from "@/lib/api/inventory";
import { Package, DollarSign, Eye, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";

export default function InventoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sellingItemId, setSellingItemId] = useState<string | null>(null);

  const fetchInventoryItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await inventoryAPI.getInventoryItems();
      setInventoryItems(items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
      toast({
        title: "Error",
        description: "Failed to load inventory items. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  const handleSellItem = async (item: InventoryItem) => {
    try {
      setSellingItemId(item.id);
      const result = await inventoryAPI.sellItem(item.id);
      
      if (result.success) {
        toast({
          title: "Item Sold!",
          description: `${item.itemName} has been sold for ${formatPrice(item.itemPrice)}. The amount has been added to your wallet balance.`,
          variant: "default",
        });
        
        // Remove item from local state
        setInventoryItems(prev => prev.filter(i => i.id !== item.id));
      } else {
        throw new Error(result.message || "Failed to sell item");
      }
    } catch (error) {
      console.error("Error selling item:", error);
      toast({
        title: "Error",
        description: "Failed to sell item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSellingItemId(null);
    }
  };

  const handleDeleteItem = async (item: InventoryItem) => {
    if (!confirm(`Are you sure you want to delete ${item.itemName} from your inventory?`)) {
      return;
    }

    try {
      const result = await inventoryAPI.deleteInventoryItem(item.id);
      
      if (result.success) {
        toast({
          title: "Item Deleted",
          description: `${item.itemName} has been removed from your inventory.`,
          variant: "default",
        });
        
        // Remove item from local state
        setInventoryItems(prev => prev.filter(i => i.id !== item.id));
      } else {
        throw new Error(result.message || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTierColor = (tier: string | undefined) => {
    if (!tier) return 'bg-gray-500 text-white';
    
    switch (tier.toLowerCase()) {
      case 'common':
        return 'bg-gray-500 text-white';
      case 'uncommon':
        return 'bg-green-500 text-white';
      case 'rare':
        return 'bg-blue-500 text-white';
      case 'epic':
        return 'bg-purple-500 text-white';
      case 'legendary':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.itemPrice, 0);
  const totalItems = inventoryItems.length;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 animate-spin text-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">Loading your inventory...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-pricedown text-foreground mb-2 sm:mb-3 md:mb-4">
            My Inventory
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
            Manage your collected items from mystery boxes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <Package className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-blue-500 mx-auto mb-1 sm:mb-2" />
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{totalItems}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Items</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <DollarSign className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-green-500 mx-auto mb-1 sm:mb-2" />
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">{formatPrice(totalValue)}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Value</p>
            </CardContent>
          </Card>
          
          <Card className="sm:col-span-2 md:col-span-1">
            <CardContent className="p-3 sm:p-4 md:p-6 text-center">
              <Eye className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-purple-500 mx-auto mb-1 sm:mb-2" />
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                {inventoryItems.filter(item => item.status === 'KEPT').length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Kept Items</p>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Items */}
        {inventoryItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 sm:p-8 md:p-12 text-center">
              <Package className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No Items Yet</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Your inventory is empty. Open some mystery boxes to start collecting items!
              </p>
              <Button
                onClick={() => router.push('/box')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base"
              >
                Browse Mystery Boxes
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {inventoryItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-2 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={cn(getTierColor(item.itemTier), "text-xs")}>
                      {item.itemTier || 'Common'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3 sm:space-y-4">
                  {/* Item Image */}
                  <div className="w-full h-24 sm:h-28 md:h-32 rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 to-yellow-200">
                    {item.itemImage ? (
                      <Image
                        src={item.itemImage}
                        alt={item.itemName}
                        width={200}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-600">
                        <Package className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground line-clamp-2">
                      {item.itemName}
                    </h3>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-amber-500">
                      {formatPrice(item.itemPrice)}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      From: {item.boxTitle}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Added: {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-1 sm:gap-2">
                    <Button
                      onClick={() => handleSellItem(item)}
                      disabled={sellingItemId === item.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-8 sm:h-9"
                    >
                      {sellingItemId === item.id ? (
                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                      ) : (
                        <>
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Sell</span>
                        </>
                      )}
                    </Button>
                    
                    <Button
                      onClick={() => handleDeleteItem(item)}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-8 sm:h-9 px-2 sm:px-3"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
