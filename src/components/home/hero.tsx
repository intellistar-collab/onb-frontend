import React from "react";
import Image from "next/image";

const subtract_image = "/hero/hero-subtract.svg";
const hero_image = "/hero/hero.webp";

const Hero = () => {
  return (
    <section className="h-screen relative overflow-hidden p-2">
      <div
        className="h-screen mask-subtract"
        style={{
          backgroundImage: `url(${hero_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: `url(${subtract_image})`,
          maskSize: "cover",
        }}
      />

      <Image
        src={"/hot-chick.webp"}
        alt="hot-chick"
        height={600}
        width={600}
        className="absolute top-0 right-0 translate-x-1/12 translate-y-1/12"
      />
    </section>
  );
};

export default Hero;
