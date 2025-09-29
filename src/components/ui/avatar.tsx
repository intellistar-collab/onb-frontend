import React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ initials, size = "md", className }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-24 h-24 text-2xl"
  };

  const innerSizeClasses = {
    sm: "w-7 h-7",
    md: "w-9 h-9", 
    lg: "w-20 h-20"
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
        <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
          <div className={cn("rounded-full bg-muted flex items-center justify-center", innerSizeClasses[size])}>
            <span className={cn("font-bold text-primary", {
              "text-xs": size === "sm",
              "text-sm": size === "md", 
              "text-2xl": size === "lg"
            })}>
              {initials}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avatar;
