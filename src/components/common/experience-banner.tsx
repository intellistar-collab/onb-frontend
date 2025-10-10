"use client";

import React from "react";
import { Sparkles, Plane, Trophy } from "lucide-react";
import Link from "next/link";

type ExperienceBannerProps = {
  className?: string;
};

const ExperienceBanner: React.FC<ExperienceBannerProps> = ({ className }) => {
  return (
    <div className={"relative border-b-2 border-gradient-to-r from-pink-500/50 via-cyan-500/50 to-amber-500/50 bg-gradient-to-r from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl supports-[backdrop-filter]:backdrop-blur-xl " + (className ?? "")}> 
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-cyan-500/10 to-amber-500/10 animate-gradient-shift" />
          
          {/* Pulsing border glow */}
          <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-pink-500/30 via-cyan-500/30 to-amber-500/30 rounded-lg animate-pulse-glow" />

          {/* Main content */}
          <div className="relative z-10 flex items-center justify-center gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              <div className="text-center">
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-pink-400 via-cyan-400 to-amber-400 bg-clip-text text-transparent animate-gradient-text">
                  NO.1 EXPERIENCE MYSTERY BOX
                </span>
              </div>
              <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-white/90">
                  WIN <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent font-bold">LIFE-CHANGING TRIPS</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-pink-400 animate-pulse" />
                <span className="text-sm font-semibold text-white/90">
                  WE <span className="bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent font-bold">HOST EVERYTHING</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-sm font-semibold text-white/90">
                  NOT JUST LUXURY ITEMS — <span className="bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">REAL MEMORIES</span>
                </span>
              </div>
            </div>
            
            {/* <Link 
              href="/how-to-play" 
              className="hidden sm:inline-flex text-xs font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-cyan-500 hover:from-pink-400 hover:to-cyan-400 text-white shadow-lg hover:shadow-pink-500/30 transition-all duration-300 animate-glow-pulse"
            >
              LEARN MORE
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceBanner;


