import React from "react";
import { AdminTable } from "@/components/admin";
import { Users, TrendingUp } from "lucide-react";
import { LeaderboardTableProps } from "./types";
import { PlayerRankIcon } from "./player-rank-icon";
import { PlayerStatusIcon } from "./player-status-icon";
import { LevelBadge } from "./level-badge";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Zap } from "lucide-react";
import { formatCurrency, formatPercentage, getInitials } from "@/lib/utils";

export const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  players,
  filters,
  loading = false,
  onPlayerAction,
  className
}) => {
  const getScoreLabel = () => {
    switch (filters.period) {
      case "weekly":
        return "Weekly Score";
      case "monthly":
        return "Monthly Score";
      default:
        return "Total Score";
    }
  };

  const getScore = (player: any) => {
    switch (filters.period) {
      case "weekly":
        return player.weeklyScore;
      case "monthly":
        return player.monthlyScore;
      default:
        return player.totalScore;
    }
  };

  const columns = [
    {
      key: "rank",
      label: "Rank",
      className: "w-20",
      render: (value: number) => (
        <PlayerRankIcon rank={value} />
      ),
    },
    {
      key: "player",
      label: "Player",
      className: "w-1/3",
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={row.avatar} />
              <AvatarFallback>{getInitials(row.displayName)}</AvatarFallback>
            </Avatar>
            {row.isVerified && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="admin-text-primary font-semibold truncate">{row.displayName}</p>
              <PlayerStatusIcon status={row.status} />
            </div>
            <p className="admin-text-tertiary text-sm truncate">@{row.username}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="admin-text-tertiary text-xs">{row.country}</span>
              <div className="flex flex-wrap gap-1">
                {row.badges.slice(0, 2).map((badge: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
                {row.badges.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{row.badges.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "score",
      label: getScoreLabel(),
      className: "w-24",
      render: (value: any, row: any) => {
        const score = getScore(row);
        return (
          <div className="text-right">
            <span className="admin-text-primary font-bold text-lg">{score.toLocaleString()}</span>
            <div className="admin-text-tertiary text-xs">points</div>
          </div>
        );
      },
    },
    {
      key: "level",
      label: "Level",
      className: "w-24",
      render: (value: string, row: any) => (
        <LevelBadge level={value} progress={row.levelProgress} />
      ),
    },
    {
      key: "financial",
      label: "Financial",
      className: "w-32",
      render: (value: any, row: any) => (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Spent:</span>
            <span className="admin-text-primary font-medium">{formatCurrency(row.totalSpent)}</span>
          </div>
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Won:</span>
            <span className="admin-text-primary font-medium">{formatCurrency(row.totalWon)}</span>
          </div>
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Net:</span>
            <span className={`font-medium ${row.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(row.netProfit)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "stats",
      label: "Stats",
      className: "w-32",
      render: (value: any, row: any) => (
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Boxes:</span>
            <span className="admin-text-primary font-medium">{row.boxesOpened}</span>
          </div>
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Win Rate:</span>
            <span className="admin-text-primary font-medium">{formatPercentage(row.winRate, 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Streak:</span>
            <span className="admin-text-primary font-medium flex items-center gap-1">
              <Zap className="h-3 w-3 text-yellow-500" />
              {row.streak}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="admin-text-tertiary">Achievements:</span>
            <span className="admin-text-primary font-medium">{row.achievements}</span>
          </div>
        </div>
      ),
    },
    {
      key: "lastActive",
      label: "Last Active",
      className: "w-28",
      render: (value: Date) => (
        <div className="text-sm">
          <span className="admin-text-primary">{value.toLocaleDateString()}</span>
          <div className="admin-text-tertiary text-xs">{value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: "View Profile",
      icon: <Users className="h-4 w-4" />,
      onClick: (row: any) => {
        onPlayerAction?.("view-profile", row);
      },
    },
    {
      label: "View Activity",
      icon: <TrendingUp className="h-4 w-4" />,
      onClick: (row: any) => {
        onPlayerAction?.("view-activity", row);
      },
    },
  ];

  return (
    <AdminTable
      title={`Player Rankings - ${filters.period === 'all' ? 'All Time' : filters.period === 'weekly' ? 'This Week' : 'This Month'}`}
      description={`${players.length} players ranked by ${filters.period === 'all' ? 'total' : filters.period} score`}
      data={players}
      columns={columns}
      actions={actions}
      emptyMessage="No players found"
      searchable={true}
      searchPlaceholder="Search players by name or username..."
      pageSize={20}
      showPagination={true}
      loading={loading}
      className={className}
    />
  );
};
