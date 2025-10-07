import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeadCardProps {
  title?: string;
  subtitle?: string;
  image: string;
  className?: string;
}

const HeadCard = ({ title, subtitle, image, className }: HeadCardProps) => {
  return (
    <section>
      <div
        className={cn(
          "relative h-[45rem] overflow-hidden rounded-2xl",
          className
        )}
      >
        <Image
          src={image}
          alt={title || subtitle || ""}
          fill
          className="object-cover"
        />
        <div className="relative z-10 flex flex-col justify-end items-start h-full bg-gradient-to-t from-black to-transparent p-8 space-y-4">
          {title && (
            <h1 className="font-pricedown text-white text-7xl">{title}</h1>
          )}
          {subtitle && (
            <span className="home-card-heading-lg mb-2 text-9xl -rotate-12">
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeadCard;
