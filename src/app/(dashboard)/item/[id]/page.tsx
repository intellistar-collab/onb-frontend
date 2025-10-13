"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package, Star, Trophy, Clock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import SmartImage from "@/components/box-page/loading-image";
import { itemsAPI, Item } from "@/lib/api/items";
import { boxesAPI, Box } from "@/lib/api/boxes";

interface ItemDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getTierColor = (status: string) => {
  switch (status) {
    case "MOST_WANTED":
      return "from-amber-400 to-yellow-600 text-amber-900"
    case "WANTED":
      return "from-purple-400 to-purple-600 text-purple-900"
    case "IN_DEMAND":
      return "from-blue-400 to-blue-600 text-blue-900"
    case "UNCOMMON":
      return "from-green-400 to-green-600 text-green-900"
    case "COMMON":
      return "from-gray-400 to-gray-600 text-gray-900"
    default:
      return "from-gray-400 to-gray-600 text-gray-900"
  }
}

const getTierBorderColor = (status: string) => {
  switch (status) {
    case "MOST_WANTED":
      return "border-amber-400"
    case "WANTED":
      return "border-purple-400"
    case "IN_DEMAND":
      return "border-blue-400"
    case "UNCOMMON":
      return "border-green-400"
    case "COMMON":
      return "border-gray-400"
    default:
      return "border-gray-400"
  }
}

const ItemDetailPage = ({ params }: ItemDetailPageProps) => {
  const [item, setItem] = useState<Item | null>(null);
  const [similarItems, setSimilarItems] = useState<Item[]>([]);
  const [assignedBox, setAssignedBox] = useState<Box | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setItemId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!itemId) return;

    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch item details
        const itemData = await itemsAPI.getItemById(itemId);
        setItem(itemData);
        
        // Fetch assigned box details
        if (itemData.boxId) {
          try {
            const boxData = await boxesAPI.getBoxById(itemData.boxId);
            setAssignedBox(boxData);
          } catch (err) {
            console.warn('Could not fetch assigned box:', err);
          }
        }
        
        // Fetch similar items (items from the same box)
        if (itemData.boxId) {
          const similarItemsData = await itemsAPI.getItemsByBoxId(itemData.boxId);
          // Filter out the current item
          const filteredSimilar = similarItemsData.filter(similarItem => similarItem.id !== itemId);
          setSimilarItems(filteredSimilar); // Show max 6 similar items
        }
      } catch (err) {
        console.error('Error fetching item:', err);
        setError(err instanceof Error ? err.message : 'Failed to load item');
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Header Skeleton */}
        <section className="relative py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-lg animate-pulse"></div>
              <div>
                <div className="h-8 w-64 bg-white/10 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-48 bg-white/10 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Skeleton */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-6">
                <div className="h-96 bg-white/10 rounded-lg animate-pulse"></div>
                <div className="h-32 bg-white/10 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-64 bg-white/10 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </Button>
              <Link href="/box">
                <Button variant="outline" className="px-4 py-2 border-white/20 text-white hover:bg-white/10">
                  Back to Boxes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <section className="relative py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/box">
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20">
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-pricedown text-white">
                {item.name}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Item Detail Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            {/* Item Information */}
            <Card className="border-white/15 bg-white/5">
              <CardHeader>
                <CardTitle className="text-2xl font-pricedown text-white">
                  Item Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Large Item Image */}
                <div className="relative aspect-square overflow-hidden rounded-lg border-2 bg-white/5"
                     style={{ borderColor: getTierBorderColor(item.status) }}>
                  <SmartImage
                    src={item.imageUrl || "/box/card-bg.png"}
                    alt={item.name}
                    fill
                    sizes="400px"
                    className="object-contain"
                    priority={true}
                  />
                </div>

                {/* Item Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      className={cn(
                        "text-sm font-bold uppercase tracking-wider bg-gradient-to-r",
                        getTierColor(item.status)
                      )}
                    >
                      {item.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-2xl font-bold text-amber-400">
                      {item.price ? `$${Number(item.price).toFixed(2)}` : "N/A"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <p className="text-sm text-white/70 mb-1">Drop Rate</p>
                      <p className="text-2xl font-bold text-white">{item.percentage}%</p>
                    </div>
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <p className="text-sm text-white/70 mb-1">Views</p>
                      <p className="text-2xl font-bold text-white">{item.viewCount || 0}</p>
                    </div>
                  </div>

                  {/* Assigned Box */}
                  {assignedBox && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-white/70 mb-2">Assigned Box</p>
                      <Link href={`/box/${assignedBox.id}`}>
                        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20">
                            <SmartImage
                              src={assignedBox.imageUrl || "/box/card-bg.png"}
                              alt={assignedBox.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-white font-semibold">{assignedBox.title}</p>
                            <p className="text-white/60 text-sm">
                              {assignedBox.price ? `$${Number(assignedBox.price).toFixed(2)}` : "Price N/A"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Description */}
                  {item.description && (
                    <div className="pt-4 border-t border-white/10">
                      <p className="text-sm text-white/70 mb-2">Description</p>
                      <p className="text-white/90 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Item Stats */}
            <Card className="border-white/15 bg-white/5">
              <CardHeader>
                <CardTitle className="text-2xl font-pricedown text-white">
                  Item Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-blue-400" />
                      <span className="text-white/70">Drop Rate</span>
                    </div>
                    <span className="text-white font-bold">{item.percentage}%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-green-400" />
                      <span className="text-white/70">Views</span>
                    </div>
                    <span className="text-white font-bold">{item.viewCount || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5 text-orange-400" />
                      <span className="text-white/70">Clicks</span>
                    </div>
                    <span className="text-white font-bold">{item.clickCount || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-purple-400" />
                      <span className="text-white/70">Status</span>
                    </div>
                    <span className="text-white font-bold capitalize">{item.status.toLowerCase().replace('_', ' ')}</span>
                  </div>
                  
                  {assignedBox && (
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="text-white/70">Box</span>
                      </div>
                      <span className="text-white font-bold truncate max-w-32" title={assignedBox.title}>
                        {assignedBox.title}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Similar Items Section */}
          {similarItems.length > 0 && (
            <Card className="border-white/15 bg-white/5 mt-8">
              <CardHeader>
                <CardTitle className="text-2xl font-pricedown text-white">
                  Similar Items
                </CardTitle>
                <p className="text-sm font-suisse text-white/60">
                  Other items from the same box
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  {similarItems.map((similarItem) => (
                    <Link key={similarItem.id} href={`/item/${similarItem.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative aspect-square overflow-hidden rounded-lg border-2 bg-white/5 transition-all duration-300 group-hover:scale-105 group-hover:border-amber-400/50"
                             style={{ borderColor: getTierBorderColor(similarItem.status) }}>
                          <SmartImage
                            src={similarItem.imageUrl || "/box/card-bg.png"}
                            alt={similarItem.name}
                            fill
                            sizes="120px"
                            className="object-contain"
                          />
                          
                          {/* Tier Badge */}
                          <div className="absolute top-1 left-1">
                            <Badge 
                              className={cn(
                                "text-[8px] font-bold uppercase tracking-wider bg-gradient-to-r",
                                getTierColor(similarItem.status)
                              )}
                            >
                              {similarItem.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Item Information Below Image */}
                        <div className="mt-2 text-center">
                          <h4 className="text-xs font-semibold text-white line-clamp-1 mb-1">
                            {similarItem.name}
                          </h4>
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-xs text-white/70">{similarItem.percentage}%</span>
                            <span className="text-xs text-white/50">•</span>
                            <span className="text-xs font-bold text-amber-400">
                              {similarItem.price ? `$${Number(similarItem.price).toFixed(2)}` : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </main>
  );
};

export default ItemDetailPage;
