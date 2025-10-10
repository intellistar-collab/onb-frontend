"use client";

import React, { useState } from "react";
import RankCardGroup from "./rank-card-group";
import { globalLeaderboard, weeklyLeaderboard } from "@/constant/rank-data";
import { cn } from "@/lib/utils";

const LeaderboardTabs = () => {
  const [activeTab, setActiveTab] = useState<"global" | "weekly">("global");
  
  const tabs = [
    { id: "global" as const, label: "Global Leaderboard", data: { ...globalLeaderboard, overrides: { ...globalLeaderboard.overrides, integrateHeader: true }, overrides2: undefined } },
    { id: "weekly" as const, label: "Weekly Champions", data: { ...weeklyLeaderboard, overrides: { ...weeklyLeaderboard.overrides, integrateHeader: true }, overrides2: undefined } },
  ];

  const activeData = tabs.find(tab => tab.id === activeTab)?.data;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="relative flex space-x-1 bg-gradient-to-r from-white/5 to-white/10 p-1 rounded-2xl border border-white/20 backdrop-blur-sm shadow-2xl">
        {/* Animated background for active tab */}
        <div 
          className="absolute top-1 bottom-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl transition-all duration-300 ease-out shadow-lg"
          style={{
            left: activeTab === "global" ? "4px" : "50%",
            width: "calc(50% - 4px)",
            boxShadow: "0 0 20px rgba(34, 211, 238, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
          }}
        />
        
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative z-10 flex-1 px-8 py-6 rounded-xl transition-all duration-300 ease-out transform",
              "hover:scale-[1.02] active:scale-[0.98]",
              activeTab === tab.id
                ? "text-white shadow-lg bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30"
                : "text-white/70 hover:text-white hover:bg-white/5 hover:shadow-md"
            )}
          >
            <span className="relative block">
              <span className={cn(
                "text-2xl md:text-3xl font-bold tracking-wide uppercase",
                "font-pricedown drop-shadow-lg",
                activeTab === tab.id 
                  ? "text-white" 
                  : "text-white/80 hover:text-white"
              )}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse shadow-lg" />
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {activeData && (
        <RankCardGroup
          {...activeData}
          {...activeData.overrides}
          side="left"
          leaderboardVariant={activeTab === "weekly" ? "weekly" : "global"}
        />
      )}
    </div>
  );
};

export default LeaderboardTabs;
