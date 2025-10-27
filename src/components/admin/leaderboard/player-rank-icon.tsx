import React from "react";
import { Crown, Medal, Award } from "lucide-react";
import { PlayerRankIconProps } from "./types";
import { cn } from "@/lib/utils";

export const PlayerRankIcon: React.FC<PlayerRankIconProps> = ({ 
  rank, 
  className 
}) => {
  const getIcon = () => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold admin-text-tertiary">#{rank}</span>;
    }
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {getIcon()}
    </div>
  );
};
