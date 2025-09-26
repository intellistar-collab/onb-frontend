import HeadCard from "@/components/common/head-card";
import SocialMedia from "@/components/common/social-media";
import React from "react";
import ContactCard from "@/components/content/contact-card";

const ContactUs = () => {
  return (
    <main>
      <HeadCard
        title="One Night Box"
        subtitle="Contact Us"
        image="/contact-us.webp"
      />
      <SocialMedia />
      <ContactCard />
    </main>
  );
};

export default ContactUs;
