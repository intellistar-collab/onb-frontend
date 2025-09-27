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
}

const RankCardGroup = ({
  title,
  banner,
  type,
  side = "right",
  className,
  users = [],
  achievements = []
}: RankCardGroupProps) => {
  const clipPath = side === "left" ? "polygon(0% 0%, calc(100% - 20px) 0%, 100% 100%, 0% 100%)" : "polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%)";
  
  return (
    <div className="space-y-3">
      <div className="relative h-20 overflow-visible">
        <RoundedShape
          clipPath={clipPath}
          className="absolute inset-0 border"
          radius={3}
        >
          <Image src={banner} alt={title} fill className="object-cover" />
        </RoundedShape>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <h1 className={`md:text-4xl text-2xl absolute bottom-2 ${side === "left" ? "left-5" : "right-5"} font-pricedown z-10 text-white`}>
          {title}
        </h1>
      </div>

      {type === "leaderboard" && users.length > 0 && (
        <div className={cn("relative", className)}>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {users.map((user) => (
                <CarouselItem
                  key={user.id}
                  className="basis-[45%] md:basis-1/4 pl-2 md:pl-4"
                >
                  <LeaderboardCard {...user} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}

      {type === "achievements" && achievements.length > 0 && (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
          {achievements.map((achievement) => (
            <AchievementCard {...achievement} key={achievement.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RankCardGroup;
