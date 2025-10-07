import React from "react";
import TermsCard from "@/components/content/terms-card";
import HeadCard from "@/components/common/head-card";

const TermsAndCondition = () => {
  return (
    <main>
      <HeadCard title="Terms and Condition" subtitle="Terms and Condition" image="/terms.webp" />
      <TermsCard />
    </main>
  );
};

export default TermsAndCondition;
