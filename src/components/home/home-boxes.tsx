"use client";

import React from "react";
import HomeCardGroup from "@/components/home/home-card-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Shuffle, Sparkles, Zap, Star } from "lucide-react";
import { BoxCategory } from "@/lib/api/box-categories";
import { Box } from "@/lib/api/boxes";

function getRandomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

interface HomeBoxesProps {
  categories: BoxCategory[];
  boxesByCategory: { [categoryId: string]: Box[] };
}

const HomeBoxes = ({ categories, boxesByCategory }: HomeBoxesProps) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [isRandomizing, setIsRandomizing] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  const handleRandomPick = async () => {
    if (categories.length === 0) return;
    
    setIsRandomizing(true);
    setShowConfetti(true);
    
    // Animate through random selections with visual excitement
    for (let i = 0; i < 8; i++) {
      const tempIdx = getRandomIndex(categories.length);
      setActiveIndex(tempIdx);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const finalIdx = getRandomIndex(categories.length);
    setActiveIndex(finalIdx);
    
    setTimeout(() => {
      setIsRandomizing(false);
      setShowConfetti(false);
    }, 500);
    
    // scroll content to top when switching
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Show empty state if no categories
  if (categories.length === 0) {
    return (
      <section className="overflow-hidden">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold mb-2">No Box Categories Available</h3>
            <p className="text-muted-foreground">Check back later for new mystery boxes!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden">
      {/* Mobile Layout */}
      <div className="md:hidden">
        {/* 🎰 EPIC Random Pick Button - Mobile */}
        <div className="relative group/random mb-4">
          {/* Animated glow rings */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl opacity-0 group-hover/random:opacity-75 blur-xl transition-all duration-500 animate-pulse" />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl opacity-0 group-hover/random:opacity-100 transition-all duration-300" />
          
          <Button 
            className={cn(
              "relative w-full h-12 text-sm font-extrabold transition-all duration-300 overflow-hidden group",
              "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600",
              "hover:from-purple-500 hover:via-pink-500 hover:to-orange-500",
              "shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.03] active:scale-[0.97]",
              "border-2 border-white/20",
              isRandomizing && "animate-bounce"
            )}
            onClick={handleRandomPick}
            disabled={isRandomizing}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            
            {/* Sparkle particles */}
            {showConfetti && (
              <>
                <Star className="absolute top-2 left-4 w-3 h-3 text-yellow-300 animate-ping" />
                <Sparkles className="absolute bottom-2 right-6 w-2 h-2 text-pink-300 animate-ping" style={{ animationDelay: '0.2s' }} />
                <Zap className="absolute top-3 right-12 w-2 h-2 text-orange-300 animate-ping" style={{ animationDelay: '0.1s' }} />
              </>
            )}
            
            <div className="relative flex items-center justify-center gap-2">
              {isRandomizing ? (
                <>
                  <Shuffle className="w-4 h-4 animate-spin" />
                  <span className="tracking-wider text-xs">ROLLING...</span>
                  <Zap className="w-4 h-4 animate-pulse" />
                </>
              ) : (
                <>
                  <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="tracking-wider text-xs">✨ RANDOM PICK ✨</span>
                  <Sparkles className="w-4 h-4 group-hover:scale-125 transition-transform duration-300" />
                </>
              )}
            </div>
          </Button>
          
          {/* Sub-text */}
          <div className="text-center mt-2 text-xs text-muted-foreground font-medium">
            <span className="opacity-70">Feeling lucky? Let fate decide!</span>
          </div>
        </div>

        {/* Mobile Horizontal Category Tabs */}
        <div className="relative mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category, index) => {
              const isActive = index === activeIndex;
              const boxCount = boxesByCategory[category.id]?.length || 0;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative group/tab flex-shrink-0 px-4 py-2.5 rounded-lg border-2 transition-all duration-300",
                    "hover:scale-[1.02] active:scale-[0.98] min-w-fit",
                    isActive 
                      ? "bg-gradient-to-r from-primary/20 to-primary/10 border-primary/70 shadow-lg shadow-primary/20" 
                      : "border-border/40 hover:border-primary/40 hover:bg-muted/60 bg-card/50"
                  )}
                >
                  {/* Background shine effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover/tab:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex items-center gap-2">
                    <span 
                      className={cn(
                        "font-bold transition-all duration-300 text-sm whitespace-nowrap",
                        isActive ? "text-primary scale-105" : "text-foreground/90 group-hover/tab:text-primary/90"
                      )} 
                      style={{ color: category.color || undefined}}
                    >
                      📦 {category.name}
                    </span>
                    
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {boxCount}
                      </span>
                      {isActive ? (
                        <div 
                          className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" 
                          style={{ backgroundColor: category.color || undefined}}
                        />
                      ) : (
                        <div 
                          className="w-2 h-2 rounded-full border-2 border-muted-foreground/30 group-hover/tab:border-primary/50 transition-colors"  
                          style={{ backgroundColor: category.color || undefined }}
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Active indicator line - bottom */}
                  {isActive && (
                    <div 
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full shadow-lg shadow-primary/50" 
                      style={{ backgroundColor: category.color || undefined}}/>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Content Area */}
        <div 
          ref={contentRef} 
          className="h-fit"
        >
          <div className="relative">
            {/* Content background with subtle gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/5 rounded-2xl -z-10" />
            
            {categories.length > 0 && (
              <div key={categories[activeIndex]?.id} className="animate-tab-content">
                <HomeCardGroup
                  title={categories[activeIndex]?.name || "Loading..."}
                  banner={categories[activeIndex]?.photo || "/home-card/banner/default.webp"}
                  type="grid"
                  cards={boxesByCategory[categories[activeIndex]?.id]?.map(box => ({
                    title: box.title,
                    location: box.location,
                    image: box.imageUrl || "/home-card/onb-box.png",
                    price: box.price ? String(box.price) : "N/A",
                    locked: !box.isActive,
                    requiredOpens: box.isActive ? undefined : 10,
                    href: `/box/${box.id}`
                  })) || []}
                  side={"left"}
                  className="pb-8"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-[280px_1fr] gap-4 sm:gap-6 w-full h-fit">
        <aside className="md:sticky md:top-24 h-max">
          <div className="space-y-4">
            {/* 🎰 EPIC Random Pick Button */}
            <div className="relative group/random -mt-16 sm:-mt-20">
              {/* Animated glow rings */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl opacity-0 group-hover/random:opacity-75 blur-xl transition-all duration-500 animate-pulse" />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl opacity-0 group-hover/random:opacity-100 transition-all duration-300" />
              
              <Button 
                className={cn(
                  "relative w-full h-12 sm:h-14 text-sm sm:text-lg font-extrabold transition-all duration-300 overflow-hidden group",
                  "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600",
                  "hover:from-purple-500 hover:via-pink-500 hover:to-orange-500",
                  "shadow-2xl hover:shadow-purple-500/50 hover:scale-[1.03] active:scale-[0.97]",
                  "border-2 border-white/20",
                  isRandomizing && "animate-bounce"
                )}
                onClick={handleRandomPick}
                disabled={isRandomizing}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                
                {/* Sparkle particles */}
                {showConfetti && (
                  <>
                    <Star className="absolute top-2 left-4 w-4 h-4 text-yellow-300 animate-ping" />
                    <Sparkles className="absolute bottom-2 right-6 w-3 h-3 text-pink-300 animate-ping" style={{ animationDelay: '0.2s' }} />
                    <Zap className="absolute top-3 right-12 w-3 h-3 text-orange-300 animate-ping" style={{ animationDelay: '0.1s' }} />
                  </>
                )}
                
                <div className="relative flex items-center justify-center gap-3">
                  {isRandomizing ? (
                    <>
                      <Shuffle className="w-6 h-6 animate-spin" />
                      <span className="tracking-wider">ROLLING...</span>
                      <Zap className="w-6 h-6 animate-pulse" />
                    </>
                  ) : (
                    <>
                      <Shuffle className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                      <span className="tracking-wider">✨ RANDOM PICK ✨</span>
                      <Sparkles className="w-6 h-6 group-hover:scale-125 transition-transform duration-300" />
                    </>
                  )}
                </div>
              </Button>
              
              {/* Sub-text */}
              <div className="text-center mt-2 text-xs text-muted-foreground font-medium">
                <span className="opacity-70">Feeling lucky? Let fate decide!</span>
              </div>
            </div>

            {/* Divider with style */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-border/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Or Choose Below
                </span>
              </div>
            </div>

            {/* Enhanced Navigation with icons and better styling */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-transparent to-primary/20 rounded-xl opacity-0 transition-opacity duration-500" />
            <nav className="relative flex md:flex-col gap-3 max-h-[90vh] overflow-y-auto custom-scrollbar pl-1 pr-2">
              {categories.map((category, index) => {
                const isActive = index === activeIndex;
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative group/tab text-left px-4 py-3.5 rounded-xl border-2 transition-all duration-300",
                      "hover:scale-[1.02] active:scale-[0.98] flex-shrink-0",
                      isActive 
                        ? "bg-gradient-to-r from-primary/20 to-primary/10 border-primary/70 shadow-lg shadow-primary/20 translate-x-0" 
                        : "border-border/40 hover:border-primary/40 hover:bg-muted/60 bg-card/50"
                    )}
                  >
                    {/* Background shine effect */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover/tab:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span 
                          className={cn(
                            "font-bold transition-all duration-300 text-sm",
                            isActive ? "text-primary scale-105" : "text-foreground/90 group-hover/tab:text-primary/90"
                          )} 
                          style={{ color: category.color || undefined}}
                        >
                          📦 {category.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <div className="flex items-center gap-1">
                            <div 
                              className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" 
                              style={{ backgroundColor: category.color || undefined}}
                            />
                            <div 
                              className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse" 
                              style={{ animationDelay: '0.2s', backgroundColor: category.color || undefined }} 
                            />
                          </div>
                        ) : (
                          <div 
                            className="w-2 h-2 rounded-full border-2 border-muted-foreground/30 group-hover/tab:border-primary/50 transition-colors"  
                            style={{ backgroundColor: category.color || undefined }}
                          />
                        )}
                      </div>
                    </div>
                    
                    {/* Active indicator line - more prominent */}
                    {isActive && (
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 rounded-r-full shadow-lg shadow-primary/50" 
                        style={{ backgroundColor: category.color || undefined}}/>
                    )}
                    
                    {/* Corner accent */}
                    {isActive && (
                      <div className="absolute top-0 right-0 w-8 h-8">
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </nav>
            </div>
          </div>
        </aside>

        {/* Enhanced Content Area */}
        <div className="flex-1 w-full">
          <div 
            ref={contentRef} 
            className="h-fit pr-1"
          >
              <div className="relative">
                {/* Content background with subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/5 rounded-2xl -z-10" />
                
                {categories.length > 0 && (
                  <div key={categories[activeIndex]?.id} className="animate-tab-content">
                    <HomeCardGroup
                      title={categories[activeIndex]?.name || "Loading..."}
                      banner={categories[activeIndex]?.photo || "/home-card/banner/default.webp"}
                      type="grid"
                      cards={boxesByCategory[categories[activeIndex]?.id]?.map(box => ({
                        title: box.title,
                        location: box.location,
                        image: box.imageUrl || "/home-card/onb-box.png",
                        price: box.price ? String(box.price) : "N/A",
                        locked: !box.isActive,
                        requiredOpens: box.isActive ? undefined : 10,
                        href: `/box/${box.id}`
                      })) || []}
                      side={"left"}
                      className="pb-8"
                    />
                  </div>
                )}
              </div>
          </div>
          
       
          {/* <div className="absolute inset-0 rounded-2xl border border-primary/10 shadow-inner pointer-events-none" /> */}
        </div>
      </div>
    </section>
  );
};

export default HomeBoxes;


