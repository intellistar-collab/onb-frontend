import React from 'react';
import { boxContent } from "@/constant/box-content";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import BoxCard from "./box-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const BoxHero = () => {
  return (
    <section className="relative">
      {/* Background Image */}
      {/* <div className="absolute inset-0 z-0">
        <Image
          src="/hot-chick.webp"
          alt="Hero Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80"></div>
      </div> */}

      {/* Content */}
      <div className="relative z-10 py-8">
        {/* Navigation Arrows */}
        <button className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* ONB Logo/Text */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="text-4xl font-bold text-white font-pricedown">
            ONB
          </div>
        </div>

        {/* Box Info */}
        <div className="absolute bottom-4 right-4 z-20 text-right">
          <div className="text-white text-sm font-oswald">
            Dubai Marina Sancz
          </div>
          <div className="text-white text-xs opacity-80">
            $5,000
          </div>
          <div className="inline-block px-3 py-1 bg-pink-500 text-white text-xs font-oswald uppercase rounded mt-1">
            OPEN
          </div>
          <div className="text-white text-xs opacity-60 mt-1">
            Next drop in 2 days
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {boxContent.map((item, index) => (
                <CarouselItem
                  key={item.title + index}
                  className="basis-[16%] pl-2 md:pl-4"
                >
                  <BoxCard {...item} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default BoxHero