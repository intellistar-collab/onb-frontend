import React from "react";
import { Badge } from "@/components/ui/badge";
import { Crown, Trophy, Medal, Award } from "lucide-react";
import { LevelBadgeProps } from "./types";
import { cn } from "@/lib/utils";

export const LevelBadge: React.FC<LevelBadgeProps> = ({ 
  level, 
  progress, 
  className 
}) => {
  const getLevelConfig = () => {
    const configs = {
      Diamond: { 
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400", 
        icon: <Crown className="h-3 w-3" /> 
      },
      Gold: { 
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400", 
        icon: <Trophy className="h-3 w-3" /> 
      },
      Silver: { 
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400", 
        icon: <Medal className="h-3 w-3" /> 
      },
      Bronze: { 
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400", 
        icon: <Award className="h-3 w-3" /> 
      },
    };
    return configs[level as keyof typeof configs] || configs.Bronze;
  };

  const config = getLevelConfig();

  return (
    <div className={cn("space-y-1", className)}>
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {level}
      </Badge>
      {progress !== undefined && (
        <div className="text-xs admin-text-tertiary">
          {progress}% to next
        </div>
      )}
    </div>
  );
};
