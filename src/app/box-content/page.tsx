import NewBox from "@/components/home/new-box";
import React from "react";
import HomeCardGroup from "@/components/home/home-card-group";
import { cityStays } from "@/constant/home-card";
import BoxContent from "@/components/box-page/box-content";
import BoxHero from "@/components/box-page/hero";

const BoxContentPage = () => {
  return (
    <main>
      <BoxHero />
      <BoxContent />
      {/* <HomeCardGroup
        {...cityStays}
        type="grid"
        title="Recommended Picks"
        side={"right"}
        className="md:grid-cols-6"
      /> */}
      <NewBox />
    </main>
  );
};

export default BoxContentPage;
