"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Sparkles, Gift, Plane, Star, Zap } from "lucide-react";
import "./adventure-animations.css";

const WhatWeDo = () => {
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
    <section className="h-[35vh] md:h-[45vh] lg:h-[55vh] w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-orange-900/30 backdrop-blur-sm border border-white/20 shadow-2xl h-full">
        {/* Background Image - optimized positioning */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-60">
          <Image
            src="/box/what-we-do.webp"
            alt="What We Do background"
            fill
            className="object-cover object-center"
          />
        </div>
        
        {/* Professional gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"></div>
        
        {/* Content with professional spacing */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-center">
          {/* Professional Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md animate-ping"></div>
              </div>
              <h1 className="text-xl md:text-2xl font-oswald bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent font-bold">
                Mystery Box Experience
              </h1>
              <div className="relative">
                <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-md animate-ping"></div>
              </div>
            </div>
            <p className="text-xs text-gray-300 font-medium">
              Discover the thrill of the unknown with every box you open
            </p>
          </div>

          {/* Professional Cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* What We Do Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:border-pink-400/50 transition-all duration-300 group-hover:scale-105 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-md shadow-md">
                    <Gift className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-sm md:text-base font-oswald text-white font-bold">What We Do</h2>
                </div>
                <p className="text-xs text-gray-200 leading-tight mb-2">
                  Unlock boxes filled with incredible items - from exclusive products 
                  to unforgettable holidays and personal experiences.
                </p>
                <div className="flex gap-1">
                  <span className="px-2 py-0.5 bg-pink-500/30 text-pink-200 rounded-full text-xs border border-pink-500/50 font-medium">
                    ✨ Exclusive
                  </span>
                  <span className="px-2 py-0.5 bg-purple-500/30 text-purple-200 rounded-full text-xs border border-purple-500/50 font-medium">
                    🌍 Global
                  </span>
                </div>
              </div>
            </div>

            {/* What To Do Card */}
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:border-blue-400/50 transition-all duration-300 group-hover:scale-105 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-md shadow-md">
                    <Plane className="h-4 w-4 text-white" />
                  </div>
                  <h2 className="text-sm md:text-base font-oswald text-white font-bold">What To Do</h2>
                </div>
                <p className="text-xs text-gray-200 leading-tight mb-2">
                  Open boxes to reveal amazing items! Unlock trips and experiences 
                  you never imagined. Small price - Big Experience.
                </p>
                <div className="flex gap-1">
                  <span className="px-2 py-0.5 bg-blue-500/30 text-blue-200 rounded-full text-xs border border-blue-500/50 font-medium">
                    🎁 Instant
                  </span>
                  <span className="px-2 py-0.5 bg-cyan-500/30 text-cyan-200 rounded-full text-xs border border-cyan-500/50 font-medium">
                    🚀 Big
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Call to Action */}
          <div className="text-center relative">
            {/* Subtle Particle Effects */}
            {showParticles && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="particle absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-ping"
                    style={{
                      left: `${20 + (i * 12)}%`,
                      top: `${30 + (i % 3) * 20}%`,
                      animationDelay: `${i * 0.2}s`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
            )}
            
            <Button 
              onClick={handleStartAdventure}
              size="sm" 
              disabled={isAnimating}
              className={`
                adventure-button relative overflow-hidden
                bg-gradient-to-r from-pink-500 to-purple-500 
                hover:from-pink-600 hover:to-purple-600 
                text-white font-bold px-4 py-2 rounded-lg 
                shadow-lg hover:shadow-xl 
                transition-all duration-300 
                hover:scale-105
                ${isAnimating ? 'animate-pulse scale-110 shadow-2xl animate-magical-glow' : ''}
                ${isAnimating ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600' : ''}
              `}
            >
              <div className={`flex items-center transition-all duration-300 ${isAnimating ? 'animate-bounce' : ''}`}>
                {isAnimating ? (
                  <Zap className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Star className="h-3 w-3 mr-1" />
                )}
                <span className={isAnimating ? 'animate-pulse' : ''}>
                  {isAnimating ? 'Launching...' : 'Start Adventure'}
                </span>
              </div>
              
              {isAnimating && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
              )}
            </Button>
            
            {isAnimating && (
              <div className="mt-2 animate-fade-in">
                <p className="text-yellow-400 font-bold text-sm animate-bounce">
                  ✨ Loading... ✨
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
