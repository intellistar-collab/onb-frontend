import {
  cityStays,
  sportsEvents,
  dressToImpress,
  worldEvents,
  personalExperiences,
  gearUpGadgets,
  dripCity,
  greadCarefully,
} from "@/constant/home-card";
import HomeCardGroup from "@/components/home/home-card-group";
import React from "react";
import NewBox from "@/components/home/new-box";
import WhatWeDo from "@/components/home/what-we-do";
import BoxRequest from "@/components/home/box-request";
import Hero from "@/components/home/hero";
import SocialMedia from "@/components/common/social-media";

const HomeScreen = () => {
  const mainCardGroups = [cityStays, sportsEvents, dressToImpress, worldEvents];
  const gridCardGroups = [
    personalExperiences,
    gearUpGadgets,
    dripCity,
    greadCarefully,
  ];

  return (
    <main>
      <Hero />
      <WhatWeDo />
      <section>
      <div className="grid md:grid-cols-2 gap-6">
          {gridCardGroups.map((cardGroup, index) => (
            <HomeCardGroup
              key={cardGroup.title}
              {...cardGroup}
              type="grid"
              side={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </section>
      <NewBox />
      <section>
        <div className="grid md:grid-cols-2 gap-6">
          {gridCardGroups.map((cardGroup, index) => (
            <HomeCardGroup
              key={cardGroup.title}
              {...cardGroup}
              type="grid"
              side={index % 2 === 0 ? "left" : "right"}
            />
          ))}
        </div>
      </section>
      <BoxRequest />
      <SocialMedia />
    </main>
  );
};

export default HomeScreen;
