import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface BoxCardProps {
  title: string;
  tag: string;
  star: number;
  image: string;
  price: string;
  percentage: string;
  color: string;
  href?: string;
}

const BoxCard = ({
  title,
  tag,
  star,
  image,
  price,
  percentage,
  color,
  href,
}: BoxCardProps) => {
  const CardContent = () => (
    <div
      className="relative rounded-lg p-4 border transition-transform font-oswald"
      style={{
        borderColor: color,
        backgroundColor: `color-mix(in srgb, ${color} 10%, transparent)`,
        boxShadow: `0px 0px 12px 0px ${color} inset`,
      }}
    >
      {/* Stars */}
      <div className="flex justify-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < star ? "text-white fill-white" : "text-gray-600"
            }`}
          />
        ))}
      </div>

      {/* Tag */}
      <div className="text-center mb-3">
        <span className="text-white text-sm font-medium uppercase tracking-wide">
          {tag}
        </span>
      </div>

      {/* Image */}
      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="96px"
          />
        </div>
      </div>

      {/* Price */}

      <div className="flex justify-between gap-2">
        <div className="text-center mb-2">
          <span className="text-white text-xl font-bold">{price}</span>
        </div>
        <div className="text-center mb-3">
          <span className="text-green-400 text-sm font-medium">
            {percentage}
          </span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-white text-sm font-medium">{title}</span>
      </div>
    </div>
  );

  // If href is provided, wrap in Link, otherwise return the card directly
  if (href) {
    return (
      <Link href={href} className="block">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default BoxCard;
