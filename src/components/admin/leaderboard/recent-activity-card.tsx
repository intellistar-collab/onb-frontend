import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RecentActivityCardProps } from "./types";
import { getInitials } from "@/lib/utils";

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  players,
  maxPlayers = 5,
  className
}) => {
  const recentPlayers = players.slice(0, maxPlayers);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-500" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest player activities and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentPlayers.map((player) => (
            <div key={player.id} className="flex items-center justify-between p-3 rounded-lg admin-bg-secondary">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback>{getInitials(player.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="admin-text-primary font-medium">{player.displayName}</p>
                  <p className="admin-text-tertiary text-sm">
                    Last active {player.lastActive.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="admin-text-primary font-semibold">+{player.weeklyScore}</p>
                <p className="admin-text-tertiary text-xs">this week</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
