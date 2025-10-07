"use client";

import { useState } from "react";

export default function AccountStats() {
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

  const profit = stats.totalWon - stats.totalSpent;
  const profitPositive = profit > 0;

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
      
      {/* Financial Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">Total Spent</span>
          <span className="font-semibold text-foreground">${stats.totalSpent.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">Total Won</span>
          <span className="font-semibold text-foreground">${stats.totalWon.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-border/50">
          <span className="text-sm text-muted-foreground">Net Profit</span>
          <span className={`font-semibold ${profitPositive ? 'text-green-500' : 'text-red-500'}`}>
            {profitPositive ? '+' : ''}${profit.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Win Rate</span>
          <div className="flex items-center gap-2">
            <div className="w-16 bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                style={{ width: `${stats.winRate}%` }}
              />
            </div>
            <span className="font-semibold text-foreground text-sm">{stats.winRate}%</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-muted-foreground">Current Streak</span>
          <span className="font-semibold text-secondary">{stats.currentStreak} wins</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-muted-foreground">Best Streak</span>
          <span className="font-semibold text-primary">{stats.bestStreak} wins</span>
        </div>
        
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-muted-foreground">Rare Items</span>
          <span className="font-semibold text-yellow-500">{stats.rareItemsWon} items</span>
        </div>
      </div>

      {/* Activity Info */}
      <div className="pt-4 border-t border-border">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Favorite Box</span>
            <span className="text-xs font-medium text-foreground">{stats.favoriteBox}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Last Activity</span>
            <span className="text-xs font-medium text-foreground">{stats.lastActivity}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Total Boxes</span>
            <span className="text-xs font-medium text-foreground">{stats.totalBoxesOpened} opened</span>
          </div>
        </div>
      </div>
    </div>
  );
}
