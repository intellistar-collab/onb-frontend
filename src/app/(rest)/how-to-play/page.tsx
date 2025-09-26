import React from "react";
import HowToPlayCard from "@/components/how-to-play-card";
import { howToPlay } from "@/constant/how-to-play";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import HeadCard from "@/components/common/head-card";

const HowToPlay = () => {
  return (
    <main>
      <HeadCard
        image="/box/box-request.webp"
        className="h-[30rem]"
        subtitle="How to Play"
      />
      <Carousel>
        <CarouselContent>
          {howToPlay.map((item) => (
            <CarouselItem key={item.title} className="basis-8/12 md:basis-1/4">
              <HowToPlayCard {...item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <HeadCard
        image="/box/box-request.webp"
        className="h-[15rem]"
        subtitle="Play Now"
      />
    </main>
  );
};

export default HowToPlay;
