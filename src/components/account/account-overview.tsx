"use client";

import { useState } from "react";
import Image from "next/image";

export default function AccountOverview() {
  const [user] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    username: "alexj_gamer",
    joinDate: "January 2024",
    avatar: "/images/default-avatar.webp",
    level: 18,
    experience: 3250,
    nextLevelExp: 4000,
    location: "San Francisco, CA",
    membershipType: "Premium",
  });

  const [stats] = useState({
    totalSpent: 1850.75,
    totalWon: 3420.50,
    winRate: 74,
    favoriteBox: "Elite Gaming Box",
    lastActivity: "1 hour ago",
    currentStreak: 12,
    bestStreak: 23,
    totalBoxesOpened: 67,
    rareItemsWon: 8,
  });

  const progressPercentage = (user.experience / user.nextLevelExp) * 100;
  const profit = stats.totalWon - stats.totalSpent;
  const profitPositive = profit > 0;

  return (
    <div className="bg-card rounded-lg border border-border p-4 shadow-lg">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
            <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                <span className="text-lg font-bold text-primary">
                  {user.name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
            </div>
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold px-1.5 py-0.5 rounded-full">
            Lv.{user.level}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-foreground truncate">{user.name}</h2>
          <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
          <p className="text-xs text-muted-foreground">{user.membershipType} • {user.joinDate}</p>
        </div>
      </div>

      {/* Experience Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium text-foreground">Experience</span>
          <span className="text-xs text-muted-foreground">{user.experience}/{user.nextLevelExp} XP</span>
        </div>
        <div className="w-full bg-muted rounded-full h-1.5">
          <div 
            className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <div className="text-sm text-muted-foreground mb-1">Spent</div>
          <div className="text-lg font-bold text-foreground">${stats.totalSpent.toFixed(0)}</div>
        </div>
        <div className="p-3 bg-muted/50 rounded-lg text-center">
          <div className="text-sm text-muted-foreground mb-1">Won</div>
          <div className="text-lg font-bold text-foreground">${stats.totalWon.toFixed(0)}</div>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <div className="flex items-center gap-2">
            <div className="w-12 bg-muted rounded-full h-1.5">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full"
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
            <span className="font-semibold text-foreground text-sm">{stats.winRate}%</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current Streak</span>
          <span className="font-semibold text-secondary">{stats.currentStreak}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Best Streak</span>
          <span className="font-semibold text-primary">{stats.bestStreak}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Rare Items</span>
          <span className="font-semibold text-yellow-500">{stats.rareItemsWon}</span>
        </div>
      </div>

      {/* Net Profit */}
      <div className="pt-3 border-t border-border text-center">
        <div className="text-sm text-muted-foreground mb-1">Net Profit</div>
        <div className={`text-xl font-bold ${profitPositive ? 'text-green-500' : 'text-red-500'}`}>
          {profitPositive ? '+' : ''}${profit.toFixed(0)}
        </div>
      </div>
    </div>
  );
}
