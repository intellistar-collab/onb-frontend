import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { TopPlayersCardProps } from "./types";
import { PlayerCard } from "./player-card";

export const TopPlayersCard: React.FC<TopPlayersCardProps> = ({
  players,
  maxPlayers = 3,
  className
}) => {
  const topPlayers = players.slice(0, maxPlayers);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Top {maxPlayers} Players
        </CardTitle>
        <CardDescription>Current leaders in the leaderboard</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPlayers.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              showRank={true}
              showStats={false}
              showFinancial={false}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
