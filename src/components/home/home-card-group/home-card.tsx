"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type HomeCardProps = HomeCard;

const HomeCard = ({ title, location, image, price }: HomeCardProps) => {
  const router = useRouter();
  return (
    <div className="relative border min-h-[25rem] rounded-2xl">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden w-full h-full rounded-2xl -z-10 opacity-25">
        <Image src={"/card-bg.png"} alt={title} fill className="object-cover" />
      </div>
      
      {/* Location - keeping unchanged as requested */}
      <h1 className="home-card-heading-sm text-3xl -rotate-45 absolute top-5 left-5 -translate-x-1/2 -translate-y-1/2">
        {location}
      </h1>

      {/* Main content container */}
      <div className="relative flex flex-col justify-between h-full min-h-[25rem] p-4">
        {/* Title */}
        <h1 className="font-oswald text-2xl text-center pt-5">{title}</h1>
        
        {/* Bottom section with image and controls */}
        <div className="flex flex-col items-center space-y-4">
          {/* Property image */}
          <div className="relative overflow-hidden rounded-lg hover:scale-105 transition-transform duration-300">
            <Image 
              src={image} 
              alt={title} 
              height={250} 
              width={250} 
              className="object-cover rounded-lg"
            />
          </div>

          {/* Price and button row */}
          <div className="flex justify-between items-center w-full">
            <div>
              <h3 className="text-lg font-suisseintl">${price}</h3>
            </div>
            <Button onClick={() => {
              router.push(`/box/brooklyn-heat`);
            }}>OPEN</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;