import React from "react";
import Image from "next/image";

const rankTitles1 = [
  "🏆 GLOBAL CHAMPIONS",
  "⭐ WEEKLY LEADERS",
  "🎯 TOP COLLECTORS",
  "💎 ELITE PLAYERS",
];

const rankTitles2 = [
  "🔥 ACHIEVEMENT HUNTERS",
  "🎁 BOX MASTERS", 
  "🌟 RISING STARS",
  "👑 HALL OF FAME",
];

const Titles = ({ title }: { title: string }) => {
  return (
    <div className="p-2 bg-white/5 rounded-lg backdrop-blur-lg">
      <h1 className="text-3xl font-oswald">{title}</h1>
    </div>
  );
};

const RankHero = () => {
  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden rounded-xl">
      <div
        className="mask-subtract h-full"
        style={{
          backgroundImage: `url(/hero/hero.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: `url(/hero/hero-subtract.svg)`,
          maskSize: "100% 100%",
        }}
      />

      <Image
        src={"/hot-chick.webp"}
        alt="rank-champion"
        height={450}
        width={450}
        className="absolute top-1/2 -translate-y-1/2 right-0"
      />

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-6xl md:text-8xl font-pricedown text-white mb-4">
          PLAYER RANKS
        </h1>
        <p className="text-xl md:text-2xl font-oswald text-white/80">
          Compete • Collect • Conquer
        </p>
      </div>

      <Image
        src={"/logo-sm.svg"}
        alt="logo-sm"
        height={100}
        width={100}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />

      <div className="absolute bottom-24 left-0 translate-x-1/2 -translate-y-10/12 space-y-2">
        {rankTitles1.map((title, index) => (
          <Titles key={index} title={title} />
        ))}
      </div>
      <div className="absolute bottom-1/2 right-0 -translate-x-1/6 translate-y-11/12 space-y-2">
        {rankTitles2.map((title, index) => (
          <Titles key={index} title={title} />
        ))}
      </div>
    </section>
  );
};

export default RankHero;


