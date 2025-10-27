import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { QuickStatsCardProps } from "./types";
import { formatPercentage } from "@/lib/utils";
import { calculateStats } from "./utils";

export const QuickStatsCard: React.FC<QuickStatsCardProps> = ({
  players,
  className
}) => {
  const stats = calculateStats(players);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Quick Stats
        </CardTitle>
        <CardDescription>Key metrics at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 rounded-lg admin-bg-secondary">
            <div className="admin-text-primary text-2xl font-bold">
              {stats.diamondPlayers}
            </div>
            <div className="admin-text-tertiary text-sm">Diamond Players</div>
          </div>
          <div className="text-center p-4 rounded-lg admin-bg-secondary">
            <div className="admin-text-primary text-2xl font-bold">
              {formatPercentage(stats.averageWinRate, 0)}
            </div>
            <div className="admin-text-tertiary text-sm">Avg Win Rate</div>
          </div>
          <div className="text-center p-4 rounded-lg admin-bg-secondary">
            <div className="admin-text-primary text-2xl font-bold">
              {stats.totalStreaks}
            </div>
            <div className="admin-text-tertiary text-sm">Total Streaks</div>
          </div>
          <div className="text-center p-4 rounded-lg admin-bg-secondary">
            <div className="admin-text-primary text-2xl font-bold">
              {stats.verifiedPlayers}
            </div>
            <div className="admin-text-tertiary text-sm">Verified Users</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
