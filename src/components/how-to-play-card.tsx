import React from "react";
import Image from "next/image";

interface HowToPlay {
  title: string;
  subtitle: string;
  instructions: Instruction[];
}

interface Instruction {
  text: string;
  image?: string;
}

const HowToPlayCard = ({ title, subtitle, instructions }: HowToPlay) => {
  return (
    <div className="border shadow p-3 md:p-6 rounded-2xl">
      <h2 className="font-oswald text-center text-xl md:text-2xl">{subtitle}</h2>
      <h1 className="font-oswald text-center text-xl md:text-2xl">{title}</h1>
      <ul className="pt-2 md:pt-4 space-y-2 md:space-y-4">
        {instructions.map((instruction, index) => (
          <li key={index} className="flex flex-col gap-2 md:gap-4 items-center">
            <div className="flex items-center gap-1 md:gap-2">
            <span className="font-oswald h-10 w-10 md:h-14 md:w-14 flex items-center justify-center text-base md:text-lg">{String.fromCharCode(65+index)}</span>
            <p className="text-sm md:text-base">{instruction.text}</p>
            </div>
            {instruction.image && (
              <div className="relative h-32 w-32 md:h-40 md:w-40 overflow-hidden rounded-lg">
              <Image
                src={instruction.image}
                alt={instruction.text}
                fill
                className="object-cover"
              />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HowToPlayCard;
