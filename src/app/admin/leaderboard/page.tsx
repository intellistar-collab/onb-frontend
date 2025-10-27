"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader } from "@/components/admin";
import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LeaderboardPlayer,
  LeaderboardFilters,
  TopPlayersCard,
  QuickStatsCard,
  RecentActivityCard,
  LeaderboardFiltersComponent,
  LeaderboardTable,
  LevelDistributionCard,
  GeographicDistributionCard,
  AchievementLeaderboardCard,
  mockLeaderboardData,
  filterPlayers,
} from "@/components/admin/leaderboard";

export default function AdminLeaderboard() {
  const [filters, setFilters] = useState<LeaderboardFilters>({
    period: "all",
    level: "all",
    status: "all",
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return filterPlayers(mockLeaderboardData, filters);
  }, [filters]);

  // Handle player actions
  const handlePlayerAction = (action: string, player: LeaderboardPlayer) => {
    console.log(`${action} for player:`, player.username);
    // TODO: Implement player actions
  };

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <AdminPageHeader
            title="Leaderboard"
            description="Track top players and their achievements in the mystery box game"
          />

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rankings">Rankings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopPlayersCard players={filteredData} maxPlayers={3} />
                <QuickStatsCard players={filteredData} />
              </div>
              <RecentActivityCard players={filteredData} maxPlayers={5} />
            </TabsContent>

            {/* Rankings Tab */}
            <TabsContent value="rankings" className="space-y-6">
              <LeaderboardFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
              />
              <LeaderboardTable
                players={filteredData}
                filters={filters}
                loading={isLoading}
                onPlayerAction={handlePlayerAction}
              />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LevelDistributionCard players={filteredData} />
                <GeographicDistributionCard players={filteredData} />
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <AchievementLeaderboardCard players={filteredData} maxPlayers={10} />
            </TabsContent>
          </Tabs>

          {/* Last Updated */}
          <div className="text-center admin-text-tertiary text-sm">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}