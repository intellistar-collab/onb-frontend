import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
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
    <div className={`relative border-2 ${getRarityBorder(rarity)} min-h-[20rem] rounded-2xl p-4 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm ${isCompleted ? 'bg-gradient-to-br from-green-900/30 to-green-800/30' : ''}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden w-full h-full rounded-2xl -z-10 opacity-10">
        <Image src={"/home-card/card-bg.png"} alt="card-bg" fill className="object-cover" />
      </div>
      
      {/* Rarity badge */}
      <Badge className={`absolute -top-2 -right-2 ${getRarityColor(rarity)} text-white text-xs capitalize`}>
        {rarity}
      </Badge>

      {/* Completion status */}
      {isCompleted && (
        <div className="absolute top-3 left-3 text-green-400 text-xl">
          ✅
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col items-center space-y-4 pt-4">
        {/* Icon */}
        <div className="text-6xl mb-2">
          {icon}
        </div>

        {/* Title */}
        <h3 className="font-oswald text-xl text-center">{title}</h3>
        
        {/* Description */}
        <p className="text-sm text-gray-300 text-center px-2">{description}</p>

        {/* Progress */}
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className={isCompleted ? "text-green-400" : "text-blue-400"}>
              {progress}/{maxProgress}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                isCompleted 
                  ? "bg-gradient-to-r from-green-400 to-green-600" 
                  : "bg-gradient-to-r from-blue-400 to-blue-600"
              }`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
          
          {/* Progress percentage */}
          <div className="text-center">
            <span className={`text-sm font-semibold ${isCompleted ? "text-green-400" : "text-blue-400"}`}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;


