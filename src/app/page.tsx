"use client";

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
import HomeTabs from "@/components/home/home-tabs";
import React from "react";
import NewBox from "@/components/home/new-box";
import BoxRequest from "@/components/home/box-request";
import Hero from "@/components/home/hero";
import SocialMedia from "@/components/common/social-media";
import EngagementSection from "@/components/common/engagement-section";

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
      {/* Unified Hero Component with integrated WhatWeDo functionality */}
      <section className="mb-8">
        <Hero />
      </section>
      
      <HomeTabs />
      {/* <NewBox /> */}
      <section className="mt-8">
        <EngagementSection />
      </section>
    </main>
  );
};

export default HomeScreen;
