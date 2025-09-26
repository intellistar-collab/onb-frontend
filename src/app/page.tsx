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
  return (
    <main>
      <Hero />
      <WhatWeDo />
      <HomeCardGroup {...cityStays} />
      <HomeCardGroup {...sportsEvents} />
      <HomeCardGroup {...dressToImpress} />
      <HomeCardGroup {...worldEvents} />
      <NewBox />
      <div className="grid md:grid-cols-2 gap-6">
        <HomeCardGroup {...personalExperiences} />
        <HomeCardGroup {...gearUpGadgets} />
        <HomeCardGroup {...dripCity} />
        <HomeCardGroup {...greadCarefully} />
      </div>
      <BoxRequest />
      <SocialMedia />
    </main>
  );
};

export default HomeScreen;
