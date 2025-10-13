"use client";

import NewBox from "@/components/home/new-box";
import React, { useState, useEffect } from "react";
import BoxCard from "@/components/box-page/box-card";
import BoxCategoriesList from "@/components/box-page/box-categories-list";
import BoxHero from "@/components/box-page/hero";
import BoxPageSkeleton from "@/components/box-page/box-page-skeleton";
import { boxesAPI, Box } from "@/lib/api/boxes";
import { boxCategoriesAPI, BoxCategory } from "@/lib/api/box-categories";
import { getHotPicksBoxes, groupBoxesByCategory } from "@/lib/box-data-transformer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const BoxContentPage = () => {
  const [hotPicksBoxes, setHotPicksBoxes] = useState<any[]>([]);
  const [allBoxes, setAllBoxes] = useState<Box[]>([]);
  const [categories, setCategories] = useState<BoxCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch boxes and categories in parallel
        const [boxesResponse, categoriesResponse] = await Promise.all([
          boxesAPI.getAllBoxes(),
          boxCategoriesAPI.getAllBoxCategories()
        ]);

        setAllBoxes(boxesResponse);
        setCategories(categoriesResponse);
        
        // Get hot picks (top 5 by purchasedCount)
        const hotPicks = getHotPicksBoxes(boxesResponse, 5);
        setHotPicksBoxes(hotPicks);

      } catch (err) {
        console.error('Error fetching box data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load boxes');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <BoxPageSkeleton />;
  }

  if (error) {
    return (
      <main>
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="mt-6">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-6xl font-pricedown text-pink mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse hover:animate-none transition-all duration-300 hover:scale-105">
              HOT PICKS
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto animate-fade-in-up">
              Handpicked mystery boxes with the best odds and most exclusive rewards
            </p>
          </div>
          <div className="relative">
            <Carousel className="group/carousel">
              <CarouselContent className="-ml-3">
                {hotPicksBoxes.map((box) => (
                  <CarouselItem
                    key={box.id}
                    className="basis-[85%] pl-3 sm:basis-[45%] md:basis-[28%] lg:basis-[20%]"
                  >
                    <BoxCard box={box} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 border-white/10 bg-white/10 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100" />
              <CarouselNext className="-right-4 border-white/10 bg-white/10 text-white opacity-0 transition-opacity group-hover/carousel:opacity-100" />
            </Carousel>
          </div>
        </div>
      </section>
      {/* All boxes grouped by category */}
      <section className="container mx-auto px-4 mt-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-pricedown tracking-wider drop-shadow-xl animate-fade-in-up bg-clip-text text-transparent bg-gradient-to-r from-white via-white/70 to-white animate-gradient-text">
            All Mystery Boxes
          </h2>
          <div className="relative mx-auto mt-3 h-px w-24 overflow-hidden bg-gradient-to-r from-white/15 via-white/10 to-transparent animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <div className="absolute inset-0">
              <div className="h-full w-10 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="mt-4 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-suisse text-white/70 animate-fade-in-up transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:border-white/20" style={{ animationDelay: "200ms" }}>
            Browse every box by category
          </p>
        </div>
        <BoxCategoriesList boxes={allBoxes} categories={categories} />
      </section>

      <BoxHero />
      <NewBox />
    </main>
  );
};

export default BoxContentPage;
