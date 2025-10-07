import React from "react";
import LeaderboardCard from "./leaderboard-card";
import AchievementCard from "./achievement-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import RoundedShape from "@/components/common/rounded-shape";
import { cn } from "@/lib/utils";

interface RankUser {
  id: string;
  username: string;
  avatar: string;
  rank: number;
  points: number;
  level: string;
  badge: string;
  totalBoxesOpened: number;
  winRate: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
}

interface RankCardGroupProps {
  title: string;
  banner: string;
  type: "leaderboard" | "achievements";
  side: "left" | "right";
  className?: string;
  users?: RankUser[];
  achievements?: Achievement[];
  // Overrides for per-section customization
  headerDescription?: string;
  rowLimit?: number;
  showSummaryTiles?: boolean;
  cardGlow?: string; // main card glow color
  tableGlow?: string; // table glow color
  achievementsGlow?: string; // achievements card glow color
  achievementsColumns?: 1 | 2 | 3 | 4; // md breakpoint columns for achievements grid
  // Integration option: move the header into the main card (leaderboard only)
  integrateHeader?: boolean;
  // Show/hide the header count badge (players/achievements)
  showHeaderCountBadge?: boolean;
  // Compact achievements grid/cards
  achievementsCompact?: boolean;
  // Variant styling/metrics for leaderboard
  leaderboardVariant?: "global" | "weekly";
}

const RankCardGroup = ({
  title,
  banner,
  type,
  side = "right",
  className,
  users = [],
  achievements = [],
  headerDescription,
  rowLimit,
  showSummaryTiles,
  cardGlow,
  tableGlow,
  achievementsGlow,
  achievementsColumns,
  integrateHeader,
  showHeaderCountBadge,
  achievementsCompact,
  leaderboardVariant
}: RankCardGroupProps) => {
  const clipPath = side === "left" ? "polygon(0% 0%, calc(100% - 20px) 0%, 100% 100%, 0% 100%)" : "polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%)";
  const isLeaderboard = type === "leaderboard";
  const isAchievements = type === "achievements";
  const resolvedRowLimit = rowLimit ?? 15;
  const showSummary = showSummaryTiles ?? true;
  const resolvedCardGlow = cardGlow ?? (isLeaderboard ? "#10b981" : "#f59e0b");
  const resolvedTableGlow = tableGlow ?? "#8b5cf6";
  const resolvedAchievementsGlow = achievementsGlow ?? "#f59e0b";
  const showCountBadge = showHeaderCountBadge ?? true;
  const achievementsColsClass = achievementsColumns === 4
    ? "md:grid-cols-4"
    : achievementsColumns === 2
    ? "md:grid-cols-2"
    : achievementsColumns === 1
    ? "md:grid-cols-1"
    : "md:grid-cols-3";

  // Weekly metrics helpers for styling/content differences
  const isWeekly = leaderboardVariant === "weekly";
  const accentTextClass = isWeekly ? "text-emerald-300" : "text-cyan-300";
  const accentGlow = isWeekly ? "#34d399" : "#60a5fa";
  const computeWeeklyPoints = (basePoints: number, index: number) => {
    const multiplier = 0.06 + Math.max(0, 5 - index) * 0.008; // slightly favors higher ranks
    return Math.max(50, Math.round(basePoints * multiplier));
  };
  const computeMomentumDelta = (index: number) => {
    const delta = Math.round(12 - index * 3); // 12,9,6,3,0,-3,-6...
    return Math.max(-8, delta);
  };
  
  return (
    <div className="space-y-0">
      {/* Top header (hidden when integrateHeader is true for leaderboard) */}
      {!(integrateHeader && isLeaderboard) && (
        <div className="group relative overflow-hidden rounded-t-2xl border border-white/15 backdrop-blur-sm shadow-2xl transition-transform hover:-translate-y-1" style={{ boxShadow: `0 0 18px -6px ${isLeaderboard ? resolvedCardGlow : resolvedAchievementsGlow}`, backgroundColor: `#0b0b0b` }}>
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="relative">
                    <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse shadow-lg shadow-cyan-500/50"></div>
                    <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <span className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">LIVE TRACKING</span>
                </div>
                <div className="mb-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider border mr-2 ${
                    (leaderboardVariant === "weekly")
                      ? "border-emerald-300/40 text-emerald-300/90 bg-emerald-300/10"
                      : "border-cyan-300/40 text-cyan-300/90 bg-cyan-300/10"
                  }`}>
                    {leaderboardVariant === "weekly" ? "THIS WEEK" : "ALL-TIME"}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 tracking-wide">
                  {headerDescription ?? (type === "leaderboard" ? "Performance Rankings & Analytics" : "Progress Tracking & Milestones")}
                </h1>
                <p className="text-sm text-white/70 font-medium">
                  {type === "leaderboard" 
                    ? (leaderboardVariant === "weekly" 
                        ? "Weekly snapshot of performance and momentum"
                        : "Real-time performance monitoring and competitive rankings")
                    : "Track your progress and unlock new achievements"}
                </p>
              </div>
              {showCountBadge && (
                <div className="flex-shrink-0 ml-6">
                  <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-white mb-1 tracking-tight">
                        {type === "leaderboard" ? users.length : achievements.length}
                      </div>
                      <div className="text-xs md:text-sm text-white/80 font-semibold uppercase tracking-wider">
                        {type === "leaderboard" ? "Active Players" : "Achievements"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Content Sections */}
      {isLeaderboard && users.length > 0 && (
        <div className={cn("relative", className)}>
          <div className="group relative overflow-hidden rounded-2xl border border-white/15 backdrop-blur-sm shadow-xl transition-transform hover:-translate-y-1" style={{ boxShadow: `0 0 18px -6px ${resolvedCardGlow}`, backgroundColor: `#0b0b0b` }}>
            <div className="relative z-10 p-5 md:p-6">
              {/* Integrated header inside the card for leaderboard */}
              {integrateHeader ? (
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {/* <h1 className="text-3xl md:text-4xl font-pricedown text-white mb-1 tracking-wide">{title}</h1> */}
                      <p className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-wide">{headerDescription ?? "Performance rankings and analytics"}</p>
                    </div>
                    {showCountBadge && (
                      <div className="border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl px-6 py-3 shadow-lg">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-white mb-1">{users.length}</div>
                          <div className="text-sm text-white/80 font-medium uppercase tracking-wide">Players</div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* <div className="flex items-center space-x-4 text-sm text-white/80 mt-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#0b0b0b] rounded-full animate-pulse"></div>
                      <span className="font-medium">Live Data</span>
                    </div>
                    <div className="text-white/50">|</div>
                    <span className="text-white/70">Updated {new Date().toLocaleTimeString()}</span>
                  </div> */}
                </div>
              ) : (
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Performance Management Dashboard</h3>
                    <p className="text-white/80 text-sm md:text-base">Comprehensive analytics and performance tracking</p>
                  </div>
                  {/* <div className="flex items-center space-x-4 text-sm text-white/80">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#0b0b0b] rounded-full animate-pulse"></div>
                      <span className="font-medium">Live Data</span>
                    </div>
                    <div className="text-white/50">|</div>
                    <span className="text-white/70">Updated {new Date().toLocaleTimeString()}</span>
                  </div> */}
                </div>
              )}
            
            {/* Enterprise Dashboard */}
            <div className="space-y-6">
              {/* Executive Summary */}
              {showSummary && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="border border-white/15 rounded-xl p-4 shadow-lg transition-transform hover:-translate-y-1" style={{ boxShadow: `0 0 12px -4px ${accentGlow}`, backgroundColor: `#0b0b0b` }}>
                  <div className="text-sm text-white/80 uppercase tracking-wide font-semibold mb-2">Total Participants</div>
                  <div className="text-3xl font-bold text-white">{users.length}</div>
                </div>
                <div className="border border-white/15 rounded-xl p-4 shadow-lg transition-transform hover:-translate-y-1" style={{ boxShadow: `0 0 12px -4px ${isWeekly ? '#10b981' : '#3b82f6'}`, backgroundColor: `#0b0b0b` }}>
                  <div className="text-sm text-white/80 uppercase tracking-wide font-semibold mb-2">{isWeekly ? 'Avg Weekly Points' : 'Average Score'}</div>
                  <div className="text-3xl font-bold text-white">
                    {(
                      isWeekly
                        ? Math.round(
                            users.reduce((sum, u, i) => sum + computeWeeklyPoints(u.points, i), 0) / users.length
                          )
                        : Math.round(users.reduce((sum, u) => sum + u.points, 0) / users.length)
                    ).toLocaleString()}
                  </div>
                </div>
                <div className="border border-white/15 rounded-xl p-4 shadow-lg transition-transform hover:-translate-y-1" style={{ boxShadow: `0 0 12px -4px #f59e0b`, backgroundColor: `#0b0b0b` }}>
                  <div className="text-sm text-white/80 uppercase tracking-wide font-semibold mb-2">{isWeekly ? 'Top Mover' : 'Top Performer'}</div>
                  <div className="text-2xl font-bold text-white truncate">{users[0]?.username || 'N/A'}</div>
                </div>
                <div className="border border-white/15 rounded-xl p-4 shadow-lg transition-transform hover:-translate-y-1" style={{ boxShadow: `0 0 12px -4px #ef4444`, backgroundColor: `#0b0b0b` }}>
                  <div className="text-sm text-white/80 uppercase tracking-wide font-semibold mb-2">{isWeekly ? 'Weekly Success Rate' : 'Success Rate'}</div>
                  <div className="text-3xl font-bold text-white">
                    {Math.round(users.reduce((sum, user) => sum + user.winRate, 0) / users.length)}%
                  </div>
                </div>
              </div>
              )}

              {/* Enhanced Performance Rankings Table */}
              <div className="border border-white/15 rounded-xl overflow-hidden shadow-2xl transition-transform hover:-translate-y-1" style={{ boxShadow: `0 0 18px -6px ${resolvedTableGlow}`, backgroundColor: `#0b0b0b` }}>
                <div className="border-b border-white/20 px-4 py-3">
                  <div className="flex items-center justify-between">
                    {/* <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-[#0b0b0b] rounded-full animate-pulse"></div>
                      <h4 className="text-lg md:text-xl font-bold text-white">Performance Rankings</h4>
                    </div> */}
                    <div className="flex items-center justify-between text-sm text-white/80 w-full">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                          <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-ping opacity-75"></div>
                        </div>
                        <span className="text-lg font-bold text-white tracking-wide">LIVE DATA</span>
                      </div>
                    <div className="flex items-center space-x-2 ml-auto">
                        <span className="text-white/60 font-medium">Last Updated:</span>
                        <span className="text-white font-semibold">
                          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-white/20">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">Rank</th>
                        <th className="px-4 py-3 text-left text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">Participant</th>
                        <th className="px-4 py-3 text-left text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">Tier</th>
                        <th className="px-4 py-3 text-right text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">{isWeekly ? 'Weekly Points' : 'Score'}</th>
                        <th className="px-4 py-3 text-right text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">{isWeekly ? 'Momentum' : 'Success Rate'}</th>
                        {!isWeekly && (
                          <th className="px-4 py-3 text-right text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">Activity</th>
                        )}
                        <th className="px-4 py-3 text-right text-xs md:text-sm font-bold text-white/90 uppercase tracking-wider">
                          <div className="flex items-center justify-end space-x-2">
                            <span>{isWeekly ? 'Weekly Growth' : 'Performance'}</span>
                            <div className={`w-2 h-2 rounded-full animate-pulse ${isWeekly ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-blue-500 to-green-500'}`}></div>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {users.slice(0, resolvedRowLimit).map((user, index) => {
                        const performancePercentage = (user.points / Math.max(...users.map(u => u.points))) * 100;
                        const weeklyPoints = computeWeeklyPoints(user.points, index);
                        const momentumDelta = computeMomentumDelta(index);
                        const getRankColor = (rank: number) => {
                          return "border border-[#0b0b0b] bg-[#0b0b0b]";
                        };
                        
                        return (
                          <tr key={user.id} className="hover:bg-white/5 transition-all duration-300 group">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110 ${getRankColor(index + 1)}`}>
                                  <span className="text-sm font-medium text-white">{index + 1}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div>
                                <div className="text-sm md:text-base font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">{user.username}</div>
                                {/* <div className="text-xs md:text-sm text-white/70">ID: {user.id.slice(0, 8)}</div> */}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-semibold border border-white/15 bg-white/5 text-white group-hover:bg-white/10 transition-colors duration-300">
                                {user.level}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm md:text-base font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
                              {(isWeekly ? weeklyPoints : user.points).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm md:text-base font-bold transition-colors duration-300 ${accentTextClass}">
                              {isWeekly ? `${momentumDelta > 0 ? '+' : ''}${momentumDelta}%` : `${user.winRate}%`}
                            </td>
                            {!isWeekly && (
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm md:text-base font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                                {user.totalBoxesOpened}
                              </td>
                            )}
                            <td className="px-4 py-3 whitespace-nowrap text-right">
                              <div className="flex items-center justify-end space-x-4">
                                <div className="w-20 md:w-24 border border-white/15 bg-white/10 rounded-full h-2.5 relative overflow-hidden">
                                  <div 
                                    className={`h-2.5 rounded-full transition-all duration-1000 ease-out relative ${isWeekly ? 'bg-emerald-500/80' : 'bg-[#0b0b0b]'}`}
                                    style={{ width: `${isWeekly ? Math.min(100, (weeklyPoints / Math.max(...users.map(u => computeWeeklyPoints(u.points, 0)))) * 100) : performancePercentage}%` }}
                                  >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className={`text-xs md:text-sm font-bold transition-colors duration-300 text-white`}>
                                    {isWeekly ? `${Math.round(Math.min(100, (weeklyPoints / Math.max(...users.map(u => computeWeeklyPoints(u.points, 0)))) * 100))}%` : `${Math.round(performancePercentage)}%`}
                                  </span>
                                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${isWeekly ? 'bg-emerald-400' : 'bg-[#0b0b0b]'}`}></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {isAchievements && achievements.length > 0 && (
        <div className={cn("relative", className)}>
          <div className="group relative overflow-hidden rounded-b-2xl border-l border-r border-b border-white/15 backdrop-blur-sm shadow-xl transition-transform hover:-translate-y-1" style={{ boxShadow: `0 0 18px -6px ${resolvedAchievementsGlow}`, backgroundColor: `#0b0b0b` }}>
            <div className="relative z-10 p-8">
              <div className={cn(
                achievementsCompact
                  ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
                  : cn("grid grid-cols-1", achievementsColsClass, "gap-6")
              )}>
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={achievementsCompact ? "scale-[0.92]" : ""}>
                    <AchievementCard {...achievement} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RankCardGroup;


