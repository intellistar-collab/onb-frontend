"use client";

import React from "react";
import { cn } from "@/lib/utils";

const HomeBoxesSkeleton = () => {
  return (
    <section className="overflow-hidden">
      <div className="grid md:grid-cols-[280px_1fr] gap-6 w-full h-fit">
        {/* Sidebar Skeleton */}
        <aside className="md:sticky md:top-24 h-max">
          <div className="space-y-4">
            {/* Random Pick Button Skeleton */}
            <div className="relative group/random -mt-20">
              <div className="w-full h-14 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl animate-pulse" />
              <div className="text-center mt-2">
                <div className="h-3 w-24 bg-white/5 rounded animate-pulse mx-auto" />
              </div>
            </div>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-border/50" />
              </div>
              <div className="relative flex justify-center">
                <div className="h-4 w-20 bg-background px-3 rounded animate-pulse" />
              </div>
            </div>

            {/* Navigation Tabs Skeleton */}
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative px-4 py-3.5 rounded-xl border-2 transition-all duration-300",
                    index === 0 
                      ? "bg-gradient-to-r from-primary/20 to-primary/10 border-primary/70" 
                      : "border-border/40 bg-card/50"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white/10 animate-pulse" />
                      <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-8 bg-white/5 rounded animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-white/10 animate-pulse" />
                    </div>
                  </div>
                  
                  {index === 0 && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-primary/40 rounded-r-full" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Content Area Skeleton */}
        <div className="flex-1 w-full">
          <div className="h-fit pr-1">
            <div className="relative">
              {/* Content background */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/5 rounded-2xl -z-10" />
              
              {/* Banner Skeleton */}
              <div className="relative h-24 overflow-hidden rounded-2xl mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
                </div>
              </div>

              {/* Grid Cards Skeleton */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="group relative border border-white/10 w-full rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900/80 via-zinc-950/60 to-black/80 backdrop-blur-sm min-h-[320px]"
                  >
                    {/* Background pattern skeleton */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/80" />
                    
                    {/* Location badge skeleton */}
                    <div className="absolute top-3 left-3 z-20">
                      <div className="h-6 w-16 bg-white/10 rounded-full animate-pulse" />
                    </div>

                    {/* Premium indicator skeleton */}
                    <div className="absolute top-3 right-3 z-20">
                      <div className="h-6 w-20 bg-yellow-400/20 rounded-full animate-pulse" />
                    </div>

                    {/* Main content */}
                    <div className="relative flex flex-col h-full min-h-[320px] pt-12 sm:pt-14">
                      {/* Title skeleton */}
                      <div className="text-center px-3 pt-4 pb-2 flex-shrink-0">
                        <div className="h-6 w-32 bg-white/10 rounded animate-pulse mx-auto mb-2" />
                        <div className="h-4 w-24 bg-white/5 rounded animate-pulse mx-auto" />
                      </div>
                      
                      {/* Image skeleton */}
                      <div className="flex items-center justify-center px-3 pb-2 flex-1">
                        <div className="relative w-full max-w-[120px] md:max-w-[140px]">
                          <div className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-white/20 aspect-square">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse" />
                          </div>
                        </div>
                      </div>

                      {/* Bottom section */}
                      <div className="mt-auto bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 space-y-2 backdrop-blur-sm flex-shrink-0">
                        {/* Price skeleton */}
                        <div className="text-center">
                          <div className="h-6 w-16 bg-white/10 rounded animate-pulse mx-auto mb-1" />
                          <div className="h-3 w-12 bg-white/5 rounded animate-pulse mx-auto" />
                        </div>
                        
                        {/* Button skeleton */}
                        <div className="h-8 w-full bg-primary/20 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeBoxesSkeleton;
