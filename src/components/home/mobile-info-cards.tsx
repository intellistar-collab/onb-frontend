"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Plane, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const MobileInfoCards = () => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleStartAdventure = () => {
    setIsAnimating(true);
    setShowParticles(true);
    
    // Create magical particle effects
    setTimeout(() => {
      setShowParticles(false);
    }, 2000);
    
    // Navigate after animation
    setTimeout(() => {
      router.push('/box');
    }, 800);
  };

  return (
    <div className="md:hidden px-4 py-6 space-y-4">
      {/* What We Do Card */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl p-4 border border-white/10 hover:border-pink-400/30 transition-all duration-300 group-hover:scale-[1.02] shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-r from-pink-500/80 to-purple-500/80 rounded-lg shadow-sm">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-oswald text-white font-bold drop-shadow-lg">What We Do</h2>
          </div>
          <div className="text-sm text-white/90 leading-relaxed drop-shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
              <span className="font-semibold text-pink-300">Experience life-changing trips</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="font-semibold text-cyan-300">Win exclusive adventures</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="font-semibold text-amber-300">Create lasting memories</span>
            </div>
            <div className="text-xs text-white/70 mt-3 italic">
              The only experience-focused mystery box platform
            </div>
          </div>
        </div>
      </div>

      {/* What To Do Card */}
      <div className="group relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-xl p-4 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group-hover:scale-[1.02] shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 rounded-lg shadow-sm">
              <Plane className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-lg font-oswald text-white font-bold drop-shadow-lg">What To Do</h2>
          </div>
          <div className="text-sm text-white/90 leading-relaxed mb-4 drop-shadow-md space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              <span className="font-semibold text-cyan-300">Win life-changing trips</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></span>
              <span className="font-semibold text-pink-300">Create unforgettable memories</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              <span className="font-semibold text-amber-300">Live your dreams</span>
            </div>
            <div className="text-xs text-white/70 mt-3 italic">
              All for the price of a coffee
            </div>
          </div>
          
          {/* Start Adventure Button */}
          <div className="relative">
            {/* Subtle Particle Effects */}
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="particle absolute w-1 h-1 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-ping"
                    style={{
                      left: `${20 + (i * 20)}%`,
                      top: `${20 + (i % 2) * 30}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
            )}
            
            <Button 
              onClick={handleStartAdventure}
              size="lg" 
              disabled={isAnimating}
              className={cn(
                "w-full adventure-button relative overflow-hidden",
                "bg-gradient-to-r from-blue-500/90 to-cyan-500/90",
                "hover:from-blue-600/90 hover:to-cyan-600/90",
                "text-white font-bold px-4 py-3 rounded-lg text-base",
                "shadow-lg hover:shadow-2xl",
                "transition-all duration-300 ease-out",
                "hover:scale-105 hover:-translate-y-1",
                "backdrop-blur-sm",
                "animate-bounce",
                "hover:animate-pulse",
                "cursor-pointer",
                isAnimating && "animate-pulse scale-110 shadow-2xl",
                isAnimating && "bg-gradient-to-r from-yellow-400/90 via-blue-500/90 to-cyan-600/90"
              )}
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6)',
                backgroundSize: '300% 300%',
                animation: 'gradient-shift 2s ease-in-out infinite, magical-pulse 1.5s ease-in-out infinite'
              }}
            >
              <div className={cn("flex items-center justify-center transition-all duration-300", isAnimating && "animate-bounce")}>
                {isAnimating ? (
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 animate-spin" />
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"
                          style={{
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '1s'
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-base">Starting Adventure...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    <span className="text-base">Start Your Adventure</span>
                  </div>
                )}
              </div>
              
              {isAnimating && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileInfoCards;
