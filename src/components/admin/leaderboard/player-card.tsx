import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap } from "lucide-react";
import { PlayerCardProps } from "./types";
import { PlayerRankIcon } from "./player-rank-icon";
import { PlayerStatusIcon } from "./player-status-icon";
import { LevelBadge } from "./level-badge";
import { cn, getInitials, formatCurrency, formatPercentage } from "@/lib/utils";

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  showRank = true,
  showStats = true,
  showFinancial = false,
  className
}) => {
  return (
    <div className={cn("flex items-center space-x-4 p-3 rounded-lg admin-bg-secondary", className)}>
      {showRank && (
        <div className="flex-shrink-0">
          <PlayerRankIcon rank={player.rank} />
        </div>
      )}
      
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={player.avatar} />
          <AvatarFallback>{getInitials(player.displayName)}</AvatarFallback>
        </Avatar>
        {player.isVerified && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        )}
      </div>
      
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="admin-text-primary font-semibold truncate">{player.displayName}</p>
          <PlayerStatusIcon status={player.status} />
        </div>
        <p className="admin-text-tertiary text-sm truncate">@{player.username}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="admin-text-tertiary text-xs">{player.country}</span>
          <div className="flex flex-wrap gap-1">
            {player.badges.slice(0, 2).map((badge, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
            {player.badges.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{player.badges.length - 2}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="text-right space-y-1">
        <p className="admin-text-primary font-bold text-lg">{player.totalScore.toLocaleString()}</p>
        <p className="admin-text-tertiary text-xs">points</p>
        
        {showStats && (
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="admin-text-tertiary">Win Rate:</span>
              <span className="admin-text-primary font-medium">
                {formatPercentage(player.winRate, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="admin-text-tertiary">Streak:</span>
              <span className="admin-text-primary font-medium flex items-center gap-1">
                <Zap className="h-3 w-3 text-yellow-500" />
                {player.streak}
              </span>
            </div>
          </div>
        )}
        
        {showFinancial && (
          <div className="text-xs space-y-1">
            <div className="flex justify-between">
              <span className="admin-text-tertiary">Net:</span>
              <span className={`font-medium ${player.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(player.netProfit)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
