"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, cn } from "@/lib/utils";
import { inventoryAPI, type InventoryItem } from "@/lib/api/inventory";
import { 
  Package, 
  DollarSign, 
  Eye, 
  Trash2, 
  Loader2, 
  TrendingUp, 
  Star, 
  Filter,
  Search,
  Grid3X3,
  List,
  SortAsc,
  Trophy,
  Zap,
  Crown,
  Gem,
  Sparkles,
  ShoppingBag,
  Archive
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";

// Fallback image component
const ItemImage = ({ src, alt, className, TierIcon, width, height }: { 
  src: string; 
  alt: string; 
  className?: string;
  TierIcon?: React.ComponentType<any>;
  width?: number;
  height?: number;
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (imageError || !src) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        {TierIcon ? <TierIcon className="h-12 w-12 text-muted-foreground" /> : <Package className="h-12 w-12 text-muted-foreground" />}
      </div>
    );
  }

  // Use specific dimensions if provided, otherwise use fill
  if (width && height) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`object-contain ${className}`}
        onError={() => {
          console.error("Image failed to load:", src);
          setImageError(true);
        }}
        onLoad={() => {
          console.log("Image loaded successfully:", src);
          setImageLoaded(true);
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-contain ${className}`}
      onError={() => {
        console.error("Image failed to load:", src);
        setImageError(true);
      }}
      onLoad={() => {
        console.log("Image loaded successfully:", src);
        setImageLoaded(true);
      }}
    />
  );
};

// Constants for consistent styling
const INVENTORY_CONSTANTS = {
  TIER_COLORS: {
    common: 'from-gray-400 to-gray-600 text-black-900',
    uncommon: 'from-green-400 to-green-600 text-green-900',
    rare: 'from-blue-400 to-blue-600 text-blue-900',
    epic: 'from-purple-400 to-purple-600 text-purple-900',
    legendary: 'from-amber-400 to-yellow-600 text-amber-900',
  },
  TIER_ICONS: {
    common: Package,
    uncommon: Star,
    rare: Gem,
    epic: Crown,
    legendary: Trophy,
  },
  VIEW_MODES: {
    GRID: 'grid',
    LIST: 'list',
  },
  SORT_OPTIONS: {
    NAME: 'name',
    PRICE: 'price',
    DATE: 'date',
    TIER: 'tier',
  },
  STATUS_TABS: {
    ALL: 'all',
    KEPT: 'KEPT',
    SOLD: 'SOLD'
  }
} as const;

export default function InventoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, refreshUser } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sellingItemId, setSellingItemId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date' | 'tier'>('date');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'KEPT' | 'SOLD'>('all');

  const fetchInventoryItems = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await inventoryAPI.getInventoryItems();
      console.log("Fetched inventory items:", items);
      console.log("First item details:", items[0]);
      
      // Debug: Check if items have image URLs and price values
      items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          name: item.itemName,
          imageUrl: item.itemImage,
          hasImage: !!item.itemImage,
          imageType: typeof item.itemImage,
          price: item.itemPrice,
          priceType: typeof item.itemPrice,
          parsedPrice: parseFloat(item.itemPrice.toString()) || 0
        });
      });
      
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

  // Filter and sort items
  const filteredAndSortedItems = useCallback(() => {
    let filtered = inventoryItems;

    // Filter by status tab
    if (activeTab !== 'all') {
      filtered = filtered.filter(item => item.status === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.boxTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tier
    if (filterTier !== 'all') {
      filtered = filtered.filter(item => item.itemTier?.toLowerCase() === filterTier);
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.itemName.localeCompare(b.itemName);
        case 'price':
          return b.itemPrice - a.itemPrice;
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'tier':
          const tierOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
          const aTier = tierOrder[a.itemTier?.toLowerCase() as keyof typeof tierOrder] || 0;
          const bTier = tierOrder[b.itemTier?.toLowerCase() as keyof typeof tierOrder] || 0;
          return bTier - aTier;
        default:
          return 0;
      }
    });

    return filtered;
  }, [inventoryItems, searchQuery, filterTier, sortBy, activeTab]);

  useEffect(() => {
    fetchInventoryItems();
  }, [fetchInventoryItems]);

  const handleSellItem = async (item: InventoryItem) => {
    try {
      console.log("Selling item:", item);
      setSellingItemId(item.id);
      const result = await inventoryAPI.sellItem(item.id);
      console.log("Sell result:", result);
      
      if (result.success) {
        toast({
          title: "Item Sold!",
          description: `${item.itemName} has been sold for ${formatPrice(item.itemPrice)}. The amount has been added to your wallet balance.`,
          variant: "default",
        });
        
        // Remove item from local state
        setInventoryItems(prev => prev.filter(i => i.id !== item.id));
        
        // Refresh user data to update wallet balance in user menu
        await refreshUser();
      } else {
        throw new Error(result.message || "Failed to sell item");
      }
    } catch (error) {
      console.error("Error selling item:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error details:", {
        message: errorMessage,
        error: error
      });
      toast({
        title: "Error",
        description: `Failed to sell item: ${errorMessage}`,
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
        
        // Refresh user data to ensure consistency
        await refreshUser();
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
    switch (tier) {
      case "legendary":
        return "from-amber-400 to-yellow-600 text-amber-900"
      case "epic":
        return "from-purple-400 to-purple-600 text-purple-900"
      case "rare":
        return "from-blue-400 to-blue-600 text-blue-900"
      case "uncommon":
        return "from-green-400 to-green-600 text-green-900"
      default:
        return "from-gray-400 to-gray-600 text-gray-900"
    }
  };

  const getTierIcon = (tier: string | undefined) => {
    if (!tier) return INVENTORY_CONSTANTS.TIER_ICONS.common;
    return INVENTORY_CONSTANTS.TIER_ICONS[tier.toLowerCase() as keyof typeof INVENTORY_CONSTANTS.TIER_ICONS] || INVENTORY_CONSTANTS.TIER_ICONS.common;
  };

  const getTierGradient = (tier: string | undefined) => {
    switch (tier?.toLowerCase()) {
      case 'legendary':
        return 'from-yellow-400 via-yellow-500 to-amber-600';
      case 'epic':
        return 'from-purple-400 via-purple-500 to-purple-600';
      case 'rare':
        return 'from-blue-400 via-blue-500 to-blue-600';
      case 'uncommon':
        return 'from-green-400 via-green-500 to-green-600';
      default:
        return 'from-gray-400 via-gray-500 to-gray-600';
    }
  };

  const totalValue = inventoryItems.reduce((sum, item) => sum + (parseFloat(item.itemPrice.toString()) || 0), 0);
  const totalItems = inventoryItems.length;

  // Calculate revenue (item price - box price)
  const totalRevenue = inventoryItems.reduce((sum, item) => {
    const itemPrice = parseFloat(item.itemPrice.toString()) || 0;
    const boxPrice = parseFloat(item.boxPrice.toString()) || 0;
    return sum + (itemPrice - boxPrice);
  }, 0);

  const totalSpent = inventoryItems.reduce((sum, item) => sum + (parseFloat(item.boxPrice.toString()) || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none" />
        <div className="relative">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your inventory...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filteredItems = filteredAndSortedItems();
  const tierCounts = inventoryItems.reduce((acc, item) => {
    const tier = item.itemTier?.toLowerCase() || 'common';
    acc[tier] = (acc[tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Calculate tab-specific stats
  const keptItems = inventoryItems.filter(item => item.status === 'KEPT');
  const soldItems = inventoryItems.filter(item => item.status === 'SOLD');
  const keptValue = keptItems.reduce((sum, item) => sum + (parseFloat(item.itemPrice.toString()) || 0), 0);
  const soldValue = soldItems.reduce((sum, item) => sum + (parseFloat(item.itemPrice.toString()) || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none" />
      <div className="relative">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-full">
                  <Package className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-pricedown text-foreground">
            My Inventory
          </h1>
                  <p className="text-muted-foreground text-lg">
                    Manage your collected treasures
          </p>
        </div>
              </div>
              
              {/* Quick Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{totalItems}</div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{formatPrice(totalValue)}</div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{keptItems.length}</div>
                  <div className="text-sm text-muted-foreground">Kept</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{soldItems.length}</div>
                  <div className="text-sm text-muted-foreground">Sold</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">{formatPrice(totalSpent)}</div>
                  <div className="text-sm text-muted-foreground">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${totalRevenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPrice(totalRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Net Revenue</div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr] gap-6">
              {/* Left Column - Tabs and Controls */}
              <div className="space-y-6">


              {/* Status Tabs */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Filter by Status</h3>
                  <div className="space-y-2">
                    <Button
                      variant={activeTab === 'all' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('all')}
                      className="w-full justify-start"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      All Items ({totalItems})
                    </Button>
                    <Button
                      variant={activeTab === 'KEPT' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('KEPT')}
                      className="w-full justify-start"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Kept ({keptItems.length})
                    </Button>
                    <Button
                      variant={activeTab === 'SOLD' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('SOLD')}
                      className="w-full justify-start"
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Sold ({soldItems.length})
                    </Button>
                  </div>
                  
                  {/* Tab-specific stats */}
                  {activeTab === 'KEPT' && (
                    <div className="mt-4 space-y-2">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Total Value</div>
                        <div className="text-lg font-semibold text-foreground">{formatPrice(keptValue)}</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Kept Revenue</div>
                        <div className="text-lg font-semibold text-foreground">{formatPrice(keptItems.reduce((sum, item) => {
                          const itemPrice = parseFloat(item.itemPrice.toString()) || 0;
                          const boxPrice = parseFloat(item.boxPrice.toString()) || 0;
                          return sum + (itemPrice - boxPrice);
                        }, 0))}</div>
                      </div>
                    </div>
                  )}
                  {activeTab === 'SOLD' && (
                    <div className="mt-4 space-y-2">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Total Earned</div>
                        <div className="text-lg font-semibold text-foreground">{formatPrice(soldValue)}</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm text-muted-foreground">Sold Revenue</div>
                        <div className="text-lg font-semibold text-foreground">{formatPrice(soldItems.reduce((sum, item) => {
                          const itemPrice = parseFloat(item.itemPrice.toString()) || 0;
                          const boxPrice = parseFloat(item.boxPrice.toString()) || 0;
                          return sum + (itemPrice - boxPrice);
                        }, 0))}</div>
                      </div>
                    </div>
                  )}
            </CardContent>
          </Card>
          
              {/* Controls */}
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Filters & Sort</h3>
                  <div className="space-y-4">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    {/* Tier Filter */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Tier Filter</label>
                      <select
                        value={filterTier}
                        onChange={(e) => setFilterTier(e.target.value)}
                        className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="all">All Tiers</option>
                        <option value="legendary">Legendary</option>
                        <option value="epic">Epic</option>
                        <option value="rare">Rare</option>
                        <option value="uncommon">Uncommon</option>
                        <option value="common">Common</option>
                      </select>
                    </div>

                    {/* Sort */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full px-3 py-2 bg-background/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="date">Date Added</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="tier">Tier</option>
                      </select>
                    </div>

                    {/* View Mode */}
                    <div>
                      <label className="text-sm text-muted-foreground mb-2 block">View Mode</label>
                      <div className="flex border border-border rounded-lg overflow-hidden">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                          className="flex-1 rounded-none"
                        >
                          <Grid3X3 className="h-4 w-4 mr-1" />
                          Grid
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                          className="flex-1 rounded-none"
                        >
                          <List className="h-4 w-4 mr-1" />
                          List
                        </Button>
                        <Button
                          variant={viewMode === 'table' ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setViewMode('table')}
                          className="flex-1 rounded-none"
                        >
                          <Archive className="h-4 w-4 mr-1" />
                          Table
                        </Button>
                      </div>
                    </div>
                  </div>
            </CardContent>
          </Card>
        </div>

            {/* Right Column - Items */}
            <div className="space-y-6">

        {/* Inventory Items */}
            {filteredItems.length === 0 ? (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-12 text-center">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-6 bg-muted/50 rounded-full">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-foreground">
                        {activeTab === 'all' && inventoryItems.length === 0 
                          ? "No Items Yet"
                          : activeTab === 'KEPT' && keptItems.length === 0
                          ? "No Kept Items"
                          : activeTab === 'SOLD' && soldItems.length === 0
                          ? "No Sold Items"
                          : "No Items Found"
                        }
                      </h3>
                      <p className="text-muted-foreground max-w-md">
                        {activeTab === 'all' && inventoryItems.length === 0 
                          ? "Your inventory is empty. Open some mystery boxes to start collecting items!"
                          : activeTab === 'KEPT' && keptItems.length === 0
                          ? "You haven't kept any items yet. Keep items from your mystery boxes to see them here."
                          : activeTab === 'SOLD' && soldItems.length === 0
                          ? "You haven't sold any items yet. Sell items from your inventory to see them here."
                          : "No items match your current filters. Try adjusting your search or filters."
                        }
                      </p>
                    </div>
                    {inventoryItems.length === 0 && (
              <Button
                onClick={() => router.push('/box')}
                        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                        <Sparkles className="h-4 w-4 mr-2" />
                Browse Mystery Boxes
              </Button>
                    )}
                  </div>
            </CardContent>
          </Card>
        ) : viewMode === 'table' ? (
          // Table View
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-semibold text-sm">Item</th>
                      <th className="text-left p-4 font-semibold text-sm">Box</th>
                      <th className="text-left p-4 font-semibold text-sm">Price</th>
                      <th className="text-left p-4 font-semibold text-sm">Tier</th>
                      <th className="text-left p-4 font-semibold text-sm">Status</th>
                      <th className="text-left p-4 font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const TierIcon = getTierIcon(item.itemTier);
                      return (
                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
                                {item.itemImage ? (
                                  <ItemImage
                                    src={item.itemImage}
                                    alt={item.itemName}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                    TierIcon={TierIcon}
                                  />
                                ) : (
                                  <TierIcon className="h-6 w-6 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium text-sm">{item.itemName}</div>
                                <div className="text-xs text-muted-foreground">{item.boxTitle}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm text-muted-foreground">{item.boxTitle}</span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="font-semibold text-primary">
                                {formatPrice(item.itemPrice)}
                              </div>
                              <div className="text-xs">
                                Revenue: <span className={`font-semibold ${(parseFloat(item.itemPrice.toString()) - parseFloat(item.boxPrice.toString())) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {formatPrice(parseFloat(item.itemPrice.toString()) - parseFloat(item.boxPrice.toString()))}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge className={cn(getTierColor(item.itemTier), "text-xs font-semibold px-2 py-1")}>
                              <TierIcon className="h-3 w-3 mr-1" />
                              {item.itemTier || 'Common'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className="text-xs">
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteItem(item)}
                                className="h-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                              {item.status === 'KEPT' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSellItem(item)}
                                  disabled={sellingItemId === item.id}
                                  className="h-8"
                                >
                                  {sellingItemId === item.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <DollarSign className="h-3 w-3" />
                                  )}
                                  Sell
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Grid and List Views
          <div className={cn(
            "gap-4",
            viewMode === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "space-y-4"
          )}>
            {filteredItems.map((item) => {
              const TierIcon = getTierIcon(item.itemTier);
              const tierGradient = getTierGradient(item.itemTier);
              
              return (
                <Card key={item.id} className={cn(
                  "group hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50",
                  viewMode === 'list' ? "flex flex-row" : "flex flex-col h-full"
                )}>
                  {viewMode === 'list' ? (
                    // List View - Horizontal Layout
                    <>
                      <CardContent className="flex items-center space-x-4 p-4 flex-1">
                        {/* Item Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center flex-shrink-0">
                          {item.itemImage ? (
                            <ItemImage
                              src={item.itemImage}
                              alt={item.itemName}
                              width={80}
                              height={80}
                              className="object-cover"
                              TierIcon={TierIcon}
                            />
                          ) : (
                            <TierIcon className="h-10 w-10 text-muted-foreground" />
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-sm truncate">{item.itemName}</h3>
                            <Badge className={cn(getTierColor(item.itemTier), "text-xs font-semibold px-2 py-1")}>
                              <TierIcon className="h-3 w-3 mr-1" />
                              {item.itemTier || 'Common'}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{item.boxTitle}</p>
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="font-semibold text-primary">
                                {formatPrice(item.itemPrice)}
                              </div>
                              <div className="text-xs">
                                Revenue: <span className={`font-semibold ${(parseFloat(item.itemPrice.toString()) - parseFloat(item.boxPrice.toString())) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {formatPrice(parseFloat(item.itemPrice.toString()) - parseFloat(item.boxPrice.toString()))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 flex-shrink-0">
                          {item.status === 'KEPT' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSellItem(item)}
                              disabled={sellingItemId === item.id}
                              className="h-8"
                            >
                              {sellingItemId === item.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <DollarSign className="h-3 w-3" />
                              )}
                              Sell
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(item)}
                            className="h-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    // Grid View - Vertical Layout
                    <>
                      <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                          <Badge className={cn(getTierColor(item.itemTier), "text-xs font-semibold px-2 py-1")}>
                            <TierIcon className="h-3 w-3 mr-1" />
                      {item.itemTier || 'Common'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                      <CardContent className="flex flex-col flex-1 space-y-4">
                  {/* Item Image */}
                        <div className="relative w-full h-32 rounded-lg overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    {item.itemImage ? (
                            <>
                              {(() => {
                                console.log("Rendering image for item:", item.itemName, "Image URL:", item.itemImage);
                                return null;
                              })()}
                              <ItemImage
                        src={item.itemImage}
                        alt={item.itemName}
                                TierIcon={TierIcon}
                              />
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {(() => {
                                console.log("No image for item:", item.itemName, "itemImage:", item.itemImage);
                                return null;
                              })()}
                              <TierIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                        <div className="flex flex-col flex-1">
                          <div className="text-center mb-3">
                            <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {item.itemName}
                    </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.boxTitle}
                    </p>
                  </div>

                          {/* Fixed alignment section for price */}
                          <div className="flex items-end justify-center mt-auto">
                            <div className="text-center">
                              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {formatPrice(item.itemPrice)}
                              </div>
                              <div className="text-xs mt-1">
                                Revenue: <span className={`font-semibold ${(parseFloat(item.itemPrice.toString()) - parseFloat(item.boxPrice.toString())) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {formatPrice(parseFloat(item.itemPrice.toString()) - parseFloat(item.boxPrice.toString()))}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons - Fixed at bottom */}
                        <div className="flex gap-2 mt-auto">
                          {item.status === 'KEPT' && (
                    <Button
                              onClick={() => {
                                console.log("Sell button clicked for item:", item.id);
                                handleSellItem(item);
                              }}
                      disabled={sellingItemId === item.id}
                              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white h-9"
                              size="sm"
                    >
                      {sellingItemId === item.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Sell
                        </>
                      )}
                    </Button>
                          )}
                    
                          {item.status === 'KEPT' && (
                    <Button
                      onClick={() => handleDeleteItem(item)}
                      variant="outline"
                              size="sm"
                              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white h-9 w-9 p-0"
                    >
                              <Trash2 className="h-4 w-4" />
                    </Button>
                          )}
                          
                          {item.status === 'SOLD' && (
                            <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground h-9 bg-muted/50 rounded-md">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Sold
                            </div>
                          )}
                  </div>
                </CardContent>
                    </>
                  )}
              </Card>
                  );
                })}
              </div>
            )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
