import React from "react";
import Image from "next/image";

const WhatWeDo = () => {
  return (
    <div className="min-h-[30rem] relative overflow-hidden rounded-xl">
      <Image
        src="/box/what-we-do.webp"
        alt="What We Do background"
        fill
        className="object-cover object-center -z-10 opacity-35"
      />
      <div className="absolute top-0 left-0 flex gap-36 p-8">
        <div className="flex-1">
          <h1 className="text-4xl font-oswald">What We Do</h1>
          <p>
            We give you the chance to unlock boxes filled with incredible items,
            from exclusive physical products to unforgettable holidays and
            personal experiences for you and a friend. Our mission is to deliver
            moments you simply couldn’t plan on your own. Because everyone
            deserves the chance to enjoy once-in-a-lifetime adventures that
            create lasting memories and take you around the world.
          </p>
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-oswald">What To Do</h1>
          <p>
            Open to reveal super cool items!  Grab your Box and unlock trips you
            would have never imagined!  Small price - Big Experience. Each
            reveal brings you closer to an Experience of a Lifetime.  Play now
            by opening your next box!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;
