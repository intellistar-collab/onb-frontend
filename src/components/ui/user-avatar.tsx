"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showBorder?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm", 
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg"
};

export default function UserAvatar({ 
  src, 
  alt = "User Avatar", 
  fallback = "U",
  size = "md",
  className,
  showBorder = false
}: UserAvatarProps) {
  const getInitials = (name: string) => {
    if (!name) return fallback;
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const initials = getInitials(alt || fallback);

  return (
    <div className={cn(
      "relative rounded-full overflow-hidden",
      sizeClasses[size],
      showBorder && "ring-2 ring-primary/20",
      className
    )}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 48 : 64}
          height={size === "sm" ? 32 : size === "md" ? 40 : size === "lg" ? 48 : 64}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide the image and show default avatar on error
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
      ) : null}
      <div className={cn(
        "w-full h-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold",
        src ? "hidden" : ""
      )}>
        {initials}
      </div>
    </div>
  );
}

