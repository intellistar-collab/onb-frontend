"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lock, Star, Zap, Crown, ArrowUpRight, Package } from "lucide-react";
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
        "group relative h-full border-white/15 py-6 transition-transform hover:-translate-y-1 cursor-pointer",
        locked && "opacity-75"
      )}
      style={{ 
        boxShadow: `0 0 18px -6px #8b5cf6`,
        backgroundImage: 'url(/box/card-bg.png)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Content */}
      <div className="space-y-4 px-6">
        {/* Top badges */}
        <div className="flex items-center justify-between">
          <div className="border-white/30 bg-white/10 font-oswald text-[11px] uppercase tracking-[0.2em] text-white px-2 py-1 rounded">
            {location}
          </div>
          <span className={cn(
            "rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
            !locked 
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-amber-500/20 text-amber-200"
          )}>
            {!locked ? "OPEN" : "LOCKED"}
          </span>
        </div>

        {/* Rating stars */}
        <div className="flex items-center justify-center gap-1 text-white/80">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={cn(
                "h-4 w-4",
                idx < 5 ? "fill-current text-white" : "text-white/20"
              )}
            />
          ))}
        </div>

        {/* Box image */}
        <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-300">
          <Image
            src={image}
            alt={title}
            fill
            sizes="160px"
            className="object-cover"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 animate-pulse" />
          )}
        </div>

        {/* Title and location */}
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-oswald uppercase text-white">
            {title}
          </h3>
          <p className="text-xs font-suisse uppercase tracking-[0.3em] text-white/50">
            #{location}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 px-6 mt-6">
        <div className="flex items-center justify-between text-sm text-white w-full">
          <div>
            <p className="text-xs font-suisse text-white/50">Price</p>
            <p className="font-oswald text-lg text-white">{formatPrice(price)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-suisse text-white/50">Odds</p>
            <p className="font-oswald text-lg text-white">— —</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-white/70">
          <span>Exp. Rewards</span>
          <span className="font-semibold text-white">
            +1,000 XP
          </span>
        </div>
        
        {/* Open Now Button - matching item-action-dialog style */}
        {!locked && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            <Package className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-pricedown ml-2">OPEN NOW</span>
          </Button>
        )}
      </div>

      {/* Lock overlay */}
      {locked && (
        <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center backdrop-blur-sm">
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

      {/* Hover overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl border border-white/5 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
        style={{ boxShadow: `0 0 30px -12px #8b5cf6` }}
      />

      {/* Arrow icon on hover */}
      <span className="pointer-events-none absolute bottom-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white opacity-0 transition-opacity group-hover:opacity-100">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </div>
  );
};

export default HomeCard;