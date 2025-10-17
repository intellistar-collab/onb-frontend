"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lock, Star, Zap, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn, formatPrice } from "@/lib/utils";

type HomeCardProps = HomeCard;

const HomeCard = ({ title, location, image, price, locked, requiredOpens, href }: HomeCardProps) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    if (locked) return;
    const route = href || `/box/brooklyn-heat`;
    router.push(route);
  };

  return (
    <div 
      className={cn(
        "group relative border border-white/10 w-full rounded-3xl overflow-hidden",
        "bg-gradient-to-br from-zinc-900/80 via-zinc-950/60 to-black/80 backdrop-blur-sm",
        "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/20",
        "transition-all duration-300 ease-out",
        "min-h-[320px] hover:scale-[1.02]",
        locked && "opacity-75"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <Image 
          src={"/card-bg.png"} 
          alt={title} 
          fill 
          className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-300" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/80" />
      </div>
      
      {/* Floating location badge */}
      <div className="absolute top-3 left-3 z-20 max-w-[45%]">
        <div className={cn(
          "px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm",
          "bg-gradient-to-r from-white/20 to-white/10 text-white",
          "shadow-lg border border-white/20",
          "truncate hover:bg-white/30 transition-colors duration-200"
        )}>
          {location}
        </div>
      </div>

      {/* Premium indicator */}
      {!locked && (
        <div className="absolute top-3 right-3 z-20 max-w-[45%]">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-400/90 to-amber-500/90 text-black text-xs font-bold shadow-lg whitespace-nowrap hover:from-yellow-300/90 hover:to-amber-400/90 transition-all duration-200">
            <Star className="w-3 h-3 fill-current" />
            <span>PREMIUM</span>
          </div>
        </div>
      )}

      {/* Lock overlay with enhanced styling */}
      {locked && (
        <div className="absolute inset-0 z-30 bg-gradient-to-br from-black/60 via-black/40 to-black/60 rounded-3xl flex items-center justify-center backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 text-white">
            <div className="relative">
              <Lock className="w-8 h-8 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 border-2 border-white/30 rounded-full animate-ping" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">LOCKED</p>
              <p className="text-xs opacity-80">Unlock {requiredOpens ?? 0} boxes</p>
            </div>
            <div className="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-pulse" style={{width: '30%'}} />
            </div>
          </div>
        </div>
      )}

      {/* Main content container - responsive and robust */}
      <div className="relative flex flex-col h-full min-h-[320px] pt-12 sm:pt-14">
        {/* Title section - flexible with wrapping and responsive sizing */}
        <div className="text-center px-3 pt-4 pb-2 flex-shrink-0">
          <h1 className="font-oswald text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight break-words hyphens-auto drop-shadow-lg">
            {title}
          </h1>
        </div>
        
        {/* Image section - flexible area keeps aspect ratio */}
        <div className="flex items-center justify-center px-3 pb-2 flex-1">
          <div className="relative w-full max-w-[140px] sm:max-w-[160px] md:max-w-[180px] lg:max-w-[200px] group/image">
            <div className={cn(
              "relative overflow-hidden rounded-2xl",
              "shadow-2xl border-2 border-white/20 group-hover:border-primary/50",
              "aspect-square transition-all duration-300 group-hover:scale-105"
            )}>
              {/* GTA Map Background */}
              <div 
                className="absolute inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: "url('/gta-map-bg.jpg')",
                  filter: "grayscale(100%) brightness(0.3)"
                }}
              />
              
              <Image 
                src={image} 
                alt={title} 
                fill
                className={cn(
                  "object-cover transition-all duration-300 relative z-10",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse z-20" />
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 z-30" />
            </div>
          </div>
        </div>

        {/* Bottom section - sticks to bottom with responsive spacing */}
        <div className="mt-auto bg-gradient-to-t from-black/60 via-black/30 to-transparent p-3 space-y-2 backdrop-blur-sm flex-shrink-0">
          {/* Price display */}
          <div className="text-center">
            <div className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">{formatPrice(price)}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider font-medium">Per Box</div>
          </div>
          
          {/* CTA Button - responsive */}
          <Button 
            disabled={!!locked} 
            onClick={handleClick}
            className={cn(
              "w-full h-8 sm:h-9 font-bold text-xs sm:text-sm transition-all duration-300 relative overflow-hidden group/button",
              "bg-gradient-to-r from-primary via-primary/95 to-primary",
              "hover:from-yellow-400 hover:via-orange-500 hover:to-red-500",
              "shadow-lg hover:shadow-2xl hover:shadow-orange-400/50",
              "border-2 border-primary/30 hover:border-orange-400/60",
              "hover:scale-105 active:scale-95",
              locked && "opacity-50 cursor-not-allowed hover:scale-100"
            )}
          >
            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              {locked ? (
                <>
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="truncate">LOCKED</span>
                </>
              ) : (
                <>
                  <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
                  <span className="truncate">OPEN NOW</span>
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;