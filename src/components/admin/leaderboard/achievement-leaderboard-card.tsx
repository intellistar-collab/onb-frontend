import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AchievementLeaderboardCardProps } from "./types";
import { getInitials } from "@/lib/utils";

export const AchievementLeaderboardCard: React.FC<AchievementLeaderboardCardProps> = ({
  players,
  maxPlayers = 10,
  className
}) => {
  const achievementLeaders = players
    .sort((a, b) => b.achievements - a.achievements)
    .slice(0, maxPlayers);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Achievement Leaderboard</CardTitle>
        <CardDescription>Players ranked by total achievements unlocked</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {achievementLeaders.map((player, index) => (
            <div key={player.id} className="flex items-center space-x-4 p-3 rounded-lg admin-bg-secondary">
              <div className="flex-shrink-0">
                <span className="text-lg font-bold admin-text-primary">#{index + 1}</span>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={player.avatar} />
                <AvatarFallback>{getInitials(player.displayName)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="admin-text-primary font-semibold truncate">{player.displayName}</p>
                <p className="admin-text-tertiary text-sm truncate">@{player.username}</p>
              </div>
              <div className="text-right">
                <p className="admin-text-primary font-bold">{player.achievements}</p>
                <p className="admin-text-tertiary text-xs">achievements</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
