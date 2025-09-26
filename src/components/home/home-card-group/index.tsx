import React from "react";
import HomeCard from "./home-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image";
import RoundedShape from "@/components/common/rounded-shape";
import { cn } from "@/lib/utils";

interface HomeCardGroupProps {
  title: string;
  cards: HomeCard[];
  banner: string;
  type: "carousel" | "grid";
  side: "left" | "right";
  className?: string;
}

const HomeCardGroup = ({
  title,
  cards,
  banner,
  type = "carousel",
  side = "right",
  className
}: HomeCardGroupProps) => {
  const clipPath = side === "left" ? "polygon(0% 0%, calc(100% - 20px) 0%, 100% 100%, 0% 100%)" : "polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%)";
  return (
    <div className="space-y-3">
      <div className={`relative h-20 ${type === "carousel" ? "overflow-visible" : "overflow-hidden"}`}>
        <RoundedShape
          clipPath={clipPath}
          className="absolute inset-0 border"
          radius={3}
        >
          <Image src={banner} alt={title} fill className="object-cover" />
        </RoundedShape>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <h1 className={(`md:text-4xl text-2xl absolute bottom-2 ${side === "left" ? "left-5" : "right-5"} font-pricedown z-10 text-white`)}>
          {title}
        </h1>
      </div>
      {type === "carousel" && (
        <div className={cn("relative", className)}>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {cards.map((card) => (
                <CarouselItem
                  key={card.title}
                  className="basis-[45%] md:basis-1/6 pl-2 md:pl-4"
                >
                  <HomeCard {...card} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}

      {type === "grid" && (
        <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-4", className)}>
          {cards.map((card) => (
            <HomeCard {...card} key={card.title} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeCardGroup;
