import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

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

type LeaderboardCardProps = RankUser;

const LeaderboardCard = ({
  username,
  avatar,
  rank,
  points,
  level,
  badge,
  totalBoxesOpened,
  winRate,
}: LeaderboardCardProps) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-br from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-br from-amber-600 to-amber-800";
      default:
        return "bg-gradient-to-br from-slate-600 to-slate-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "diamond":
        return "bg-blue-500";
      case "platinum":
        return "bg-gray-400";
      case "gold":
        return "bg-yellow-500";
      case "silver":
        return "bg-gray-300";
      default:
        return "bg-bronze-500";
    }
  };

  return (
    <div className="relative border min-h-[20rem] rounded-2xl p-4 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden w-full h-full rounded-2xl -z-10 opacity-10">
        <Image src={"/home-card/card-bg.png"} alt="card-bg" fill className="object-cover" />
      </div>
      
      {/* Rank badge */}
      <div className={`absolute -top-3 -left-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${getRankColor(rank)}`}>
        #{rank}
      </div>

      {/* Badge emoji */}
      <div className="absolute top-3 right-3 text-2xl">
        {badge}
      </div>

      {/* Main content */}
      <div className="flex flex-col items-center space-y-4 pt-6">
        {/* Avatar */}
        <div className="relative">
          <Image 
            src={avatar} 
            alt={username} 
            height={80} 
            width={80} 
            className="object-cover rounded-full border-4 border-white/20"
          />
          <Badge className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${getLevelColor(level)} text-white text-xs`}>
            {level}
          </Badge>
        </div>

        {/* Username */}
        <h3 className="font-oswald text-xl text-center">{username}</h3>
        
        {/* Points */}
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-400">{points.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Points</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full text-center text-sm">
          <div>
            <p className="font-semibold text-blue-400">{totalBoxesOpened}</p>
            <p className="text-gray-400">Boxes Opened</p>
          </div>
          <div>
            <p className="font-semibold text-green-400">{winRate}%</p>
            <p className="text-gray-400">Win Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardCard;
