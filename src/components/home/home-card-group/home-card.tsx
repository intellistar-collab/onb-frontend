import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type HomeCardProps = HomeCard;

const HomeCard = ({ title, location, image, price }: HomeCardProps) => {
  return (
    <div className="relative border min-h-[25rem] p-2 rounded-2xl">
      <div className="relative overflow-hidden">
        <Image
          src={"/card-bg.png"}
          alt={title}
          fill
          className="object-cover opacity-25"
        />
      </div>
      <h1 className="home-card-heading-sm text-2xl -rotate-45 absolute -top-1/2 -left-1/2">
        {location}
      </h1>

      <div className="flex flex-col justify-between h-full">
        <h1 className="font-oswald text-2xl text-center">{title}</h1>
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
