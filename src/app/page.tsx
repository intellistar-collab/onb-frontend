"use client";

import React, { useState, useEffect } from "react";
import { boxCategoriesAPI, BoxCategory } from "@/lib/api/box-categories";
import { boxesAPI, Box } from "@/lib/api/boxes";
import Hero from "@/components/home/hero";
import HomeTabs from "@/components/home/home-tabs";
import HomeTabsSkeleton from "@/components/home/home-tabs-skeleton";
import { PacmanCompact } from "@/components/pacman";
import Leaderboard from "@/components/common/leaderboard";
import EngagementSection from "@/components/common/engagement-section";

const HomeScreen = () => {
  const [categories, setCategories] = useState<BoxCategory[]>([]);
  const [boxesByCategory, setBoxesByCategory] = useState<{ [categoryId: string]: Box[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesData = await boxCategoriesAPI.getAllBoxCategories();
        setCategories(categoriesData);
        
        const allBoxes = await boxesAPI.getAllBoxes();

        const boxesData: { [categoryId: string]: Box[] } = {};
        
        for (const category of categoriesData) {
          try {
            const categoryBoxes = allBoxes.filter(box => box.boxCategoryId === category.id);

            boxesData[category.id] = categoryBoxes;
          } catch (err) {
            console.warn(`Could not fetch boxes for category ${category.name}:`, err);
            boxesData[category.id] = [];
          }
        }

        setBoxesByCategory(boxesData);
      } catch (err) {
        console.error('Error fetching home data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <main>
        <section className="mb-8">
          <Hero />
        </section>
        
        <section className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </section>
        
        <section className="mt-8">
          <EngagementSection />
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Unified Hero Component with integrated WhatWeDo functionality */}
      <section className="mb-8">
        <Hero />
      </section>
      
      {!loading ? (
        <HomeTabs 
          categories={categories}
          boxesByCategory={boxesByCategory}
        />
      ) : ( 
        <HomeTabsSkeleton /> 
      )}

      <section className="mt-8">
        <div className="grid md:grid-cols-[7fr_3fr] gap-6 h-[600px]">
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <PacmanCompact />
          </div>
          <Leaderboard />
        </div>
      </section>
      
      <section className="mt-8">
        <EngagementSection />
      </section>
    </main>
  );
};

export default HomeScreen;
