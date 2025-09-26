import React from "react";
import { Card as CardUI, CardContent } from "../ui/card";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  heading?: string;
}

const Card = ({ children, className, heading }: CardProps) => {
  return (
    <>
      {heading && <h1 className="text-2xl font-oswald pb-2 font-semibold">{heading}</h1>}
      <CardUI className={className}>
        <CardContent>{children}</CardContent>
      </CardUI>
    </>
  );
};

export default Card;
