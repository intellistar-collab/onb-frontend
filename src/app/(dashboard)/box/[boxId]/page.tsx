"use client";

import React, { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import BoxDetail from "@/components/box-page/box-detail";
import BoxDetailSkeleton from "@/components/box-page/box-detail-skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { boxesAPI, Box } from "@/lib/api/boxes";
import { itemsAPI, Item } from "@/lib/api/items";
import { boxCategoriesAPI, BoxCategory } from "@/lib/api/box-categories";
import { transformBoxToMysteryBox, transformItemsToBoxRewards } from "@/lib/box-data-transformer";

interface BoxDetailPageProps {
  params: Promise<{
    boxId: string;
  }>;
}

const BoxDetailPage = ({ params }: BoxDetailPageProps) => {
  const [box, setBox] = useState<any>(null);
  const [rawBox, setRawBox] = useState<Box | null>(null);
  const [boxCategory, setBoxCategory] = useState<BoxCategory | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boxId, setBoxId] = useState<string>("");

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setBoxId(resolvedParams.boxId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!boxId) return;

    const fetchBox = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch box and items in parallel
        const [boxData, itemsData] = await Promise.all([
          boxesAPI.getBoxById(boxId),
          itemsAPI.getItemsByBoxId(boxId)
        ]);
        
        // Fetch box category if boxCategoryId exists
        let categoryData = null;
        if (boxData.boxCategoryId) {
          try {
            categoryData = await boxCategoriesAPI.getBoxCategoryById(boxData.boxCategoryId);
            console.log('Fetched category:', categoryData);
          } catch (err) {
            console.warn('Could not fetch box category:', err);
          }
        }
        
        // Create a box object with the fetched category data
        const boxWithCategory = {
          ...boxData,
          boxCategory: categoryData ? {
            id: categoryData.id,
            name: categoryData.name,
            color: categoryData.color || undefined
          } : undefined
        };
        
        const transformedBox = transformBoxToMysteryBox(boxWithCategory);
        // Add the transformed items as rewards to the box
        transformedBox.rewards = transformItemsToBoxRewards(itemsData);
        
        setBox(transformedBox);
        setRawBox(boxData); // Keep raw box data for category display
        setBoxCategory(categoryData); // Set the fetched category
        setItems(itemsData);
      } catch (err) {
        console.error('Error fetching box:', err);
        setError(err instanceof Error ? err.message : 'Failed to load box');
      } finally {
        setLoading(false);
      }
    };

    fetchBox();
  }, [boxId]);

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

        {/* Box Detail Content Skeleton */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <BoxDetailSkeleton />
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

  if (!box) {
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
                {box.title.replace('\n', ' ')}
              </h1>
              {(boxCategory || box?.tag) && (
                <div className="flex items-center gap-2 mt-2 mb-1">
                  <div 
                    className="w-3 h-3 rounded-full border border-white/20"
                    style={{ backgroundColor: boxCategory?.color || box?.color || '#3b82f6' }}
                  />
                  <span className="text-white/80 font-suisse text-sm">
                    {boxCategory?.name || box?.tag || 'Mystery'}
                  </span>
                </div>
              )}
              <p className="text-white/60 font-suisse">
                Mystery Box #{box.location} - {box.price}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Box Detail Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <BoxDetail box={box} />
        </div>
      </section>
    </main>
  );
};

export default BoxDetailPage;

