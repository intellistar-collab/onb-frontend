import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type HomeCardProps = HomeCard;

const HomeCard = ({ title, location, image, price }: HomeCardProps) => {
  return (
    <div className="relative border min-h-[25rem] rounded-2xl">
      <div className="relative overflow-hidden w-full h-full rounded-2xl -z-10 opacity-25">
        <Image src={"/card-bg.png"} alt={title} fill className="object-cover" />
      </div>
      <h1 className="home-card-heading-sm text-3xl -rotate-45 absolute top-5 left-5 -translate-x-1/2 -translate-y-1/2">
        {location}
      </h1>

      <div className="flex flex-col justify-between h-full">
        <h1 className="font-oswald text-2xl text-center pt-16">{title}</h1>
        <div>
          <Image src={image} alt={title} height={300} width={300} />

          <div className="flex justify-between items-center">
            <div>
              <h3>{price}</h3>
            </div>
            <Button>OPEN</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCard;
