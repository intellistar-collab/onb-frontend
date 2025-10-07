import React from "react";
import CookiesCard from "@/components/content/cookies-card";
import HeadCard from "@/components/common/head-card";

const Cookies = () => {
  return (
    <main>
      <HeadCard
        title="Cookies Policy"
        subtitle="Cookies Policy"
        image="/cookies.webp"
      />
      <CookiesCard />
    </main>
  );
};

export default Cookies;
