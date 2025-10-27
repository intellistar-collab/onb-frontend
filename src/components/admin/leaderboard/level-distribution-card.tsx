import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LevelDistributionCardProps } from "./types";
import { LevelBadge } from "./level-badge";

export const LevelDistributionCard: React.FC<LevelDistributionCardProps> = ({
  players,
  className
}) => {
  const levels = ["Diamond", "Gold", "Silver", "Bronze"];
  
  const getLevelData = () => {
    return levels.map((level) => {
      const count = players.filter(p => p.level === level).length;
      const percentage = players.length > 0 ? (count / players.length) * 100 : 0;
      return { level, count, percentage };
    });
  };

  const levelData = getLevelData();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Level Distribution</CardTitle>
        <CardDescription>Players by level tier</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {levelData.map(({ level, count, percentage }) => (
            <div key={level} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LevelBadge level={level} />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="admin-text-primary font-medium w-8">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
