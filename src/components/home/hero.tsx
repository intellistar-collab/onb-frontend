import React from "react";
import Image from "next/image";

const subtract_image = "/hero/hero-subtract.svg";
const hero_image = "/hero/hero.webp";

const titles1 = [
  "🥶 DRESS TO IMPRESS",
  "📸 GEAR UP GADGETS",
  "👟 TREAD CAREFULLY",
  "💎 DRIP CITY",
];

const titles2 = [
  "🔥 PERSONAL EXPERIENCES",
  "🏀 SPORTS EVENTS",
  "🌍 WORLD EVENTS",
  "🏙️ CITY STAYS",
];

const Titles = ({ title }: { title: string }) => {
  return (
    <div className="p-2 bg-white/5 rounded-lg backdrop-blur-lg">
      <h1 className="text-3xl font-oswald">{title}</h1>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="h-[25vh] md:h-[50vh] lg:h-[85vh] w-full relative overflow-hidden">
      <div
        className="mask-subtract h-full"
        style={{
          backgroundImage: `url(${hero_image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: `url(${subtract_image})`,
          maskSize: "100% 100%",
        }}
      />

      <Image
        src={"/hot-chick.webp"}
        alt="hot-chick"
        height={450}
        width={450}
        className="absolute top-1/2 -translate-y-1/2 right-0"
      />

      <Image
        src={"/hero/hero-title.svg"}
        alt="hero-title"
        height={500}
        width={500}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <Image
        src={"/logo-sm.svg"}
        alt="logo-sm"
        height={100}
        width={100}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <div className="absolute bottom-24 left-0 translate-x-1/2 -translate-y-10/12  space-y-2">
        {titles1.map((title, index) => (
          <Titles key={index} title={title} />
        ))}
      </div>
      <div className="absolute bottom-1/2 right-0 -translate-x-1/6 translate-y-11/12 space-y-2">
        {titles2.map((title, index) => (
          <Titles key={index} title={title} />
        ))}
      </div>
    </section>
  );
};

export default Hero;
