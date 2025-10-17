"use client";

import React, { useState, useEffect } from "react";
import { boxCategoriesAPI, BoxCategory } from "@/lib/api/box-categories";
import { boxesAPI, Box } from "@/lib/api/boxes";
import Hero from "@/components/home/hero";
import ExperienceBanner from "@/components/common/experience-banner";
import HomeTabs from "@/components/home/home-tabs";
import HomeTabsSkeleton from "@/components/home/home-tabs-skeleton";
import PimpCatcher from "@/components/pimp-catcher-game/pimp-catcher";
import Leaderboard from "@/components/common/leaderboard";
import EngagementSection from "@/components/common/engagement-section";
import MobileInfoCards from "@/components/home/mobile-info-cards";

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

  return (
    <main>
      <ExperienceBanner />
      {/* Unified Hero Component with integrated WhatWeDo functionality */}
      <section className="mb-4 sm:mb-6 md:mb-8">
        <Hero />
      </section>
      
      {/* Mobile Info Cards - Only visible on mobile */}
      <MobileInfoCards />
      
      {!loading && !error? (
        <HomeTabs 
          categories={categories}
          boxesByCategory={boxesByCategory}
        />
      ) : ( 
        <HomeTabsSkeleton /> 
      )}

      {/* Pimp Catcher + Leaderboard Section*/}
      <section className="mt-4 sm:mt-6 md:mt-8">
        <div className="grid grid-cols-1 md:grid-cols-[7fr_3fr] gap-4 sm:gap-6 min-h-[300px] sm:min-h-[400px] md:h-[600px]">
          <PimpCatcher/>
          <Leaderboard />
        </div>
      </section>
      
      <section className="mt-4 sm:mt-6 md:mt-8">
        <EngagementSection />
      </section>
    </main>
  );
};

export default HomeScreen;
