"use client";

import React from "react";
import HomeCard from "./home-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import RoundedShape from "@/components/common/rounded-shape";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HomeCardGroupProps {
  title: string;
  cards: HomeCard[];
  banner: string;
  type: "carousel" | "grid";
  side: "left" | "right";
  className?: string;
}

const HomeCardGroup = ({
  title,
  cards,
  banner,
  type = "carousel",
  side = "right",
  className
}: HomeCardGroupProps) => {
  const clipPath = side === "left" ? "polygon(0% 0%, calc(100% - 20px) 0%, 100% 100%, 0% 100%)" : "polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%)";
  const isRecommended = title === "Recommended Picks";
  const visibleCards = isRecommended ? cards.slice(0, 5) : cards;
  
  return (
    <div className="space-y-6">
      {/* Header - remove banner for Recommended Picks */}
      {title === "Recommended Picks" ? (
        <div className="text-center">
          <h1 className="text-4xl font-pricedown text-white font-bold drop-shadow-lg">{title}</h1>
        </div>
      ) : (
        <div className={`relative h-24 ${type === "carousel" ? "overflow-visible" : "overflow-hidden"}`}>
          <RoundedShape
            clipPath={clipPath}
            className={cn(
              "absolute inset-0 border-2 shadow-lg transition-all duration-300",
              title === "City Stays" 
                ? "border-yellow-300/40 shadow-yellow-500/30" 
                : "border-primary/20"
            )}
            radius={4}
          >
            <Image 
              src={banner} 
              alt={title} 
              fill 
              className={cn(
                "object-cover transition-all duration-300",
                title === "City Stays" 
                  ? "brightness-110 contrast-120 saturate-135 hue-rotate-20 sepia-15" 
                  : "object-cover"
              )}
            />
          </RoundedShape>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
          {title === "City Stays" && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/25 via-amber-500/20 to-orange-500/25"></div>
          )}
          <h1 className={cn(
            "absolute bottom-3 font-pricedown z-10 text-white",
            "md:text-5xl text-3xl font-bold",
            "drop-shadow-2xl",
            side === "left" ? "left-6" : "right-6",
            title === "City Stays" && "text-shadow-lg shadow-yellow-500/50 drop-shadow-yellow-500/30"
          )}>
            {title}
          </h1>
        </div>
      )}
      
      {type === "carousel" && (
        <div className={cn("relative carousel-container", className)}>
          <Carousel 
            className="w-full"
            opts={{
              align: "start",
              slidesToScroll: 1,
              dragFree: true,
            }}
          >
            <CarouselContent className="-ml-2 -mr-2">
              {visibleCards.map((card, index) => (
                <CarouselItem
                  key={`${card.title}-${index}`}
                  className="basis-[85%] sm:basis-[45%] md:basis-[32%] lg:basis-[24%] xl:basis-[19%] pl-2 pr-2"
                >
                  <HomeCard {...card} />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation buttons - always visible and functional */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10">
              <CarouselPrevious className="relative left-0 bg-primary/95 hover:bg-primary border-2 border-primary/30 shadow-xl w-12 h-12" />
            </div>
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10">
              <CarouselNext className="relative right-0 bg-primary/95 hover:bg-primary border-2 border-primary/30 shadow-xl w-12 h-12" />
            </div>
          </Carousel>
          
          {/* Helpful hint */}
          <div className="text-center mt-4 text-xs text-muted-foreground">
            <span>← Use arrows to browse all {visibleCards.length} boxes →</span>
          </div>
        </div>
      )}

      {type === "grid" && (
        <div className={cn(
          "grid gap-3 h-fit",
          className,
          isRecommended ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-5" : "grid-cols-3"
        )}>
          {visibleCards.map((card, index) => (
            <div key={`${card.title}-${index}`} className="h-fit">
              <HomeCard {...card} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeCardGroup;
