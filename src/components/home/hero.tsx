"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Sparkles, Gift, Plane, Star, Zap } from "lucide-react";
import "./adventure-animations.css";

const subtract_image = "/hero/hero-subtract.svg";
const hero_image = "/hero/hero.webp";

const allTitles = [
  "🥶 DRESS TO IMPRESS",
  "📸 GEAR UP GADGETS",
  "👟 TREAD CAREFULLY",
  "💎 DRIP CITY",
  "🔥 PERSONAL EXPERIENCES",
  "🏀 SPORTS EVENTS",
  "🌍 WORLD EVENTS",
  "🏙️ CITY STAYS",
];

const CategoryTag = ({ title }: { title: string }) => {
  return (
    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 shadow-lg">
      <h1 className="text-sm md:text-base font-oswald text-white font-bold text-center leading-tight">
        {title}
      </h1>
    </div>
  );
};

const Hero = () => {
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
    <section className="h-[30vh] sm:h-[35vh] md:h-[42vh] lg:h-[48vh] w-full relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
      {/* Main Background - Full Stretch */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${hero_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* No overlay - background characters fully visible */}

      {/* Main title - centered */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="relative">
          <Image
            src={"/hero/hero-title.svg"}
            alt="hero-title"
            height={180}
            width={180}
            className="mx-auto mb-2 hover:scale-105 transition-transform duration-300 drop-shadow-lg"
          />
          <Image
            src={"/logo-sm.svg"}
            alt="logo-sm"
            height={30}
            width={30}
            className="mx-auto hover:scale-110 transition-transform duration-300 drop-shadow-lg"
          />
        </div>
      </div> */}

      {/* Horizontal ticker category tags */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-0 right-0 h-10 sm:h-12 overflow-hidden">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 whitespace-nowrap animate-ticker">
          {/* Duplicate array for seamless loop */}
          {[...allTitles, ...allTitles, ...allTitles].map((title, index) => (
            <div key={index} className="flex-shrink-0">
              <CategoryTag title={title} />
            </div>
          ))}
        </div>
      </div>

      {/* What We Do Card - Desktop Only */}
      <div className="hidden md:block absolute top-8 left-6 lg:top-8 lg:left-6 w-64 lg:w-72">
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-pink-400/30 transition-all duration-300 group-hover:scale-102 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-r from-pink-500/80 to-purple-500/80 rounded-lg shadow-sm">
                <Gift className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-base lg:text-lg font-oswald text-white font-bold drop-shadow-lg">What We Do</h2>
            </div>
            <div className="text-xs lg:text-sm text-white/90 leading-relaxed drop-shadow-md space-y-1">
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
              <div className="text-xs text-white/70 mt-2 italic">
                The only experience-focused mystery box platform
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What To Do Card - Desktop Only */}
      <div className="hidden md:block absolute bottom-8 right-6 lg:bottom-8 lg:right-6 w-64 lg:w-72">
        <div className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative bg-black/30 backdrop-blur-sm rounded-xl p-5 border border-white/10 hover:border-blue-400/30 transition-all duration-300 group-hover:scale-102 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-gradient-to-r from-blue-500/80 to-cyan-500/80 rounded-lg shadow-sm">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-base lg:text-lg font-oswald text-white font-bold drop-shadow-lg">What To Do</h2>
            </div>
            <div className="text-xs lg:text-sm text-white/90 leading-relaxed mb-4 drop-shadow-md space-y-1">
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
              <div className="text-xs text-white/70 mt-2 italic">
                All for the price of a coffee
              </div>
            </div>
            
            {/* Integrated Start Adventure Button */}
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
                size="sm" 
                disabled={isAnimating}
                className={`
                  w-full adventure-button relative overflow-hidden
                  bg-gradient-to-r from-blue-500/90 to-cyan-500/90 
                  hover:from-blue-600/90 hover:to-cyan-600/90 
                  text-white font-bold px-3 py-2 rounded-lg text-sm 
                  shadow-lg hover:shadow-2xl 
                  transition-all duration-300 ease-out
                  hover:scale-110 hover:-translate-y-2
                  backdrop-blur-sm
                  animate-bounce
                  hover:animate-pulse
                  cursor-pointer
                  ${isAnimating ? 'animate-pulse scale-110 shadow-2xl animate-magical-glow' : ''}
                  ${isAnimating ? 'bg-gradient-to-r from-yellow-400/90 via-blue-500/90 to-cyan-600/90' : ''}
                `}
                style={{
                  background: 'linear-gradient(45deg, #3b82f6, #06b6d4, #8b5cf6, #3b82f6)',
                  backgroundSize: '300% 300%',
                  animation: 'gradient-shift 2s ease-in-out infinite, magical-pulse 1.5s ease-in-out infinite'
                }}
              >
                <div className={`flex items-center justify-center transition-all duration-300 ${isAnimating ? 'animate-bounce' : ''}`}>
                  {isAnimating ? (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 animate-spin" />
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
                    </div>
                  ) : (
                    <Star className="h-4 w-4 mr-2" />
                  )}
                  <span className={isAnimating ? 'animate-pulse' : ''}>
                    {isAnimating ? 'Launching Adventure...' : 'Start Your Adventure'}
                  </span>
                </div>
                
                {isAnimating && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                )}
              </Button>
              
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;