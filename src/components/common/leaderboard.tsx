"use client";

import React from "react";
import { Trophy, Medal, Award, Crown, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  username: string;
  score: number;
  rank: number;
  avatar?: string;
}

interface LeaderboardProps {
  entries?: LeaderboardEntry[];
  className?: string;
}

const Leaderboard = ({ entries, className }: LeaderboardProps) => {
  // Mock data for demonstration
  const defaultEntries: LeaderboardEntry[] = [
    { id: "1", username: "PacmanMaster", score: 15420, rank: 1 },
    { id: "2", username: "GhostHunter", score: 12850, rank: 2 },
    { id: "3", username: "DotCollector", score: 11200, rank: 3 },
    { id: "4", username: "MazeRunner", score: 9850, rank: 4 },
    { id: "5", username: "PowerPill", score: 8750, rank: 5 },
    { id: "6", username: "CherryPicker", score: 7200, rank: 6 },
    { id: "7", username: "FruitFinder", score: 6800, rank: 7 },
    { id: "8", username: "BonusSeeker", score: 5400, rank: 8 },
  ];

  const leaderboardData = entries || defaultEntries;

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-white/70">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border-yellow-400/30";
      case 2:
        return "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-300/30";
      case 3:
        return "bg-gradient-to-r from-amber-600/20 to-orange-500/20 border-amber-600/30";
      default:
        return "bg-white/5 border-white/10";
    }
  };

  return (
    <div className={cn("relative h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl", className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-pricedown text-white">Leaderboard</h3>
        </div>
        <p className="text-sm text-white/70">Top Pacman players this week</p>
      </div>

      {/* Leaderboard entries */}
      <div className="relative z-10 p-4 space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {leaderboardData.map((entry, index) => (
          <div
            key={entry.id}
            className={cn(
              "flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 hover:scale-[1.02]",
              getRankColor(entry.rank)
            )}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10">
              {getRankIcon(entry.rank)}
            </div>

            {/* Avatar placeholder */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {entry.username.charAt(0).toUpperCase()}
              </span>
            </div>

            {/* Username */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {entry.username}
              </p>
              <p className="text-xs text-white/60">
                {entry.score.toLocaleString()} pts
              </p>
            </div>

            {/* Score badge for top 3 */}
            {entry.rank <= 3 && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-xs font-bold text-yellow-400">
                  {entry.rank === 1 ? "CHAMP" : entry.rank === 2 ? "PRO" : "EXPERT"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4 border-t border-white/10">
        <div className="text-center">
          <p className="text-xs text-white/60 mb-2">Play Pacman to climb the leaderboard!</p>
          <div className="flex items-center justify-center gap-2 text-xs text-white/50">
            <span>Updated every hour</span>
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <span>Weekly reset</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
