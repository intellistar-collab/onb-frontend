import React from "react";
import Image from "next/image";
import DarkBackground from "../common/dark-background";

const WhatWeRank = () => {
  return (
    <section>
      <div className="min-h-[30rem] relative overflow-hidden rounded-xl">
        <Image
          src="/box/what-we-do.webp"
          alt="What We Rank background"
          fill
          className="object-cover object-center -z-10"
        />
        <div className="absolute top-0 left-0 flex flex-col md:flex-row gap-4 md:gap-36 p-8">
          <DarkBackground className="flex-1">
            <h1 className="md:text-4xl text-2xl font-oswald">How We Rank</h1>
            <p className="md:text-base text-sm">
              Our ranking system rewards consistent play and strategic choices. 
              Earn points by opening boxes, collecting rare items, and completing 
              achievements. The more you play, the higher you climb. From Bronze 
              to Diamond tiers, every player has the chance to reach the top and 
              claim exclusive rewards reserved for the elite.
            </p>
          </DarkBackground>
          <DarkBackground className="flex-1">
            <h1 className="md:text-4xl text-2xl font-oswald">Why Rank Matters</h1>
            <p className="md:text-base text-sm">
              Higher ranks unlock exclusive boxes, special events, and VIP 
              experiences. Top players get early access to limited editions, 
              bonus multipliers, and invitations to exclusive tournaments. 
              Compete with players worldwide and prove you're among the best 
              mystery box collectors in the community.
            </p>
          </DarkBackground>
        </div>
      </div>
    </section>
  );
};

export default WhatWeRank;



