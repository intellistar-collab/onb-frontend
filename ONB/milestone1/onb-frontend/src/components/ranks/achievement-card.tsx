import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import "./elastic-animation.css";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  isLocked?: boolean;
  unlockRequirement?: string;
}

type AchievementCardProps = Achievement;

const AchievementCard = ({
  title,
  description,
  icon,
  rarity,
  progress,
  maxProgress,
  isCompleted,
  isLocked = false,
  unlockRequirement,
}: AchievementCardProps) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-500";
      case "rare":
        return "bg-blue-500";
      case "epic":
        return "bg-purple-500";
      case "legendary":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "border-gray-400";
      case "rare":
        return "border-blue-400";
      case "epic":
        return "border-purple-400";
      case "legendary":
        return "border-yellow-400";
      default:
        return "border-gray-400";
    }
  };

  const progressPercentage = (progress / maxProgress) * 100;

  return (
    <div className={`relative border border-white/15 h-[14rem] rounded-xl p-4 backdrop-blur-sm transition-all duration-500 group hover:-translate-y-1 ${
      isLocked 
        ? 'hover:border-purple-400/70 cursor-pointer mystery-glow mystery-float hover:scale-[1.03] hover:shadow-2xl hover:shadow-purple-500/30' 
        : isCompleted 
          ? 'hover:border-green-400/70 hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.02]' 
          : 'hover:shadow-lg hover:shadow-blue-600/50 hover:scale-[1.01]'
    }`} style={{ backgroundColor: `#0b0b0b`, boxShadow: isLocked ? `0 0 18px -6px #8b5cf6` : isCompleted ? `0 0 18px -6px #10b981` : `0 0 18px -6px #3b82f6` }}>
      {/* Enhanced mystery background effects for locked cards */}
      {isLocked && (
        <>
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-indigo-600/10 animate-pulse" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 rounded-2xl mystery-shimmer" />
          
          {/* Mysterious particles */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            <div className="absolute top-2 left-4 w-1 h-1 bg-purple-400 rounded-full mystery-particles" />
            <div className="absolute top-6 right-8 w-1 h-1 bg-pink-400 rounded-full mystery-particles animation-delay-300" />
            <div className="absolute bottom-4 left-6 w-1 h-1 bg-indigo-400 rounded-full mystery-particles animation-delay-700" />
            <div className="absolute bottom-8 right-4 w-1 h-1 bg-cyan-400 rounded-full mystery-particles animation-delay-1000" />
          </div>
        </>
      )}
      
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden w-full h-full rounded-2xl -z-10 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <Image src={"/home-card/card-bg.png"} alt="card-bg" fill className="object-cover" />
      </div>
      
      {/* Rarity badge with enhanced styling for locked cards */}
      <Badge className={`absolute -top-2 -right-2 ${getRarityColor(rarity)} text-white text-xs capitalize shadow-lg ${
        isLocked ? 'mystery-pulse shadow-purple-500/50' : ''
      }`}>
        {rarity}
      </Badge>

      {/* Completion status */}
      {isCompleted && !isLocked && (
        <div className="absolute top-3 left-3 text-green-400 text-xl">
          ✅
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col items-center space-y-1 pt-1 h-full">
        {/* Enhanced lock icon for locked cards */}
        {isLocked && (
          <div className="text-3xl text-purple-400 mystery-icon-float relative">
            <div className="absolute inset-0 text-4xl opacity-20 animate-pulse">🎁</div>
            <div className="relative z-10">🔒</div>
          </div>
        )}

        {/* Icon for unlocked cards */}
        {!isLocked && (
          <div className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            {icon}
          </div>
        )}

        {/* Title with enhanced mystery styling */}
        <h3 className={`font-oswald text-center transition-colors duration-300 ${
          isLocked 
            ? 'text-lg text-purple-300 font-bold mystery-text-pulse' 
            : 'text-lg text-white font-bold group-hover:text-blue-300'
        }`}>
          {isLocked ? "??? MYSTERY ACHIEVEMENT ???" : title}
        </h3>
        
        {/* Description - only show for unlocked achievements */}
        {!isLocked && (
          <p className="text-sm text-white/60 text-center px-2 line-clamp-1 transition-colors duration-300 group-hover:text-white/80">
            {description}
          </p>
        )}

        {/* Enhanced unlock requirement with urgency */}
        {isLocked && unlockRequirement && (
          <div className="w-full text-center flex-1 flex flex-col justify-center">
            <div className="text-xs text-white/60 mb-1 animate-pulse">🔓 TO UNLOCK:</div>
            <div className="text-xs font-bold text-white bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-lg px-2 py-1 border border-purple-500/50 leading-tight relative overflow-hidden mystery-requirement-glow">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <div className="relative z-10">{unlockRequirement}</div>
            </div>
          </div>
        )}

        {/* Progress */}
        {!isLocked && (
          <div className="w-full space-y-2 flex-1 flex flex-col justify-end">
            <div className="flex justify-between text-sm">
              <span className="text-white/70 transition-colors duration-300 group-hover:text-white/90">Progress</span>
              <span className={`font-bold transition-colors duration-300 group-hover:scale-105 ${isCompleted ? "text-green-400" : "text-blue-400"}`}>
                {progress}/{maxProgress}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full border border-white/15 bg-white/10 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-700 ease-out bg-[#0b0b0b]`}
                style={{ 
                  width: `${Math.min(progressPercentage, 100)}%`,
                  animation: 'progressFill 1.5s ease-out'
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementCard;


