import React from 'react';
import { RankCardGroup, LeaderboardTabs, WhatWeRankModal } from '@/components/ranks';
import SocialMedia from '@/components/common/social-media';
import { 
  achievements, 
  monthlyChallenge 
} from '@/constant/rank-data';

const RankPage = () => {
  const gridRankGroups = [achievements, monthlyChallenge];

  return (
    <main className="min-h-screen bg-black">
      <WhatWeRankModal />
      
      {/* Main Rankings Section - Integrated Tabbed View */}
      <section className="mt-6">
        <div className="container mx-auto px-4">
          <LeaderboardTabs />
        </div>
      </section>
      
      {/* Secondary Rankings Section */}
      <section className="mt-6">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 mb-6">
            {gridRankGroups.map((rankGroup, index) => (
              <RankCardGroup
                key={rankGroup.title}
                {...rankGroup}
                {...rankGroup.overrides}
                side={index % 2 === 0 ? "left" : "right"}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Social Media Section - Keep original styling */}
      <SocialMedia />
    </main>
  );
};

export default RankPage;