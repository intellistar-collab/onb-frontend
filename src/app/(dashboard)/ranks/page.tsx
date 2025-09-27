import React from 'react';
import { RankCardGroup, WhatWeRank } from '@/components/ranks';
import SocialMedia from '@/components/common/social-media';
import { 
  globalLeaderboard, 
  weeklyLeaderboard, 
  achievements, 
  monthlyChallenge 
} from '@/constant/rank-data';

const RankPage = () => {
  const mainRankGroups = [globalLeaderboard, weeklyLeaderboard];
  const gridRankGroups = [achievements, monthlyChallenge];

  return (
    <main>
      <WhatWeRank />
      <section>
        <div className="flex flex-col gap-6">
          {mainRankGroups.map((rankGroup, index) => (
            <RankCardGroup
              key={rankGroup.title}
              {...rankGroup}
              side={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </section>
      <section>
        <div className="grid md:grid-cols-2 gap-6">
          {gridRankGroups.map((rankGroup, index) => (
            <RankCardGroup
              key={rankGroup.title}
              {...rankGroup}
              side={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </section>
      <SocialMedia />
    </main>
  );
};

export default RankPage;