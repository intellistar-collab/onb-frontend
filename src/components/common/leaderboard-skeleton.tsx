"use client";

import React from "react";
import { Trophy } from "lucide-react";

const LeaderboardSkeleton = () => {
  return (
    <div className="relative h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
      </div>

      {/* Leaderboard entries skeleton */}
      <div className="relative z-10 p-4 space-y-2 max-h-[400px] overflow-y-auto">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 rounded-xl border border-white/10 bg-white/5 animate-pulse"
          >
            {/* Rank skeleton */}
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />

            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />

            {/* Username and score skeleton */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
            </div>

            {/* Badge skeleton for top 3 */}
            {index < 3 && (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-white/10 animate-pulse" />
                <div className="h-3 w-12 bg-white/5 rounded animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="relative z-10 p-4 border-t border-white/10">
        <div className="text-center space-y-2">
          <div className="h-3 w-48 bg-white/5 rounded animate-pulse mx-auto" />
          <div className="flex items-center justify-center gap-2">
            <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-white/30" />
            <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;
