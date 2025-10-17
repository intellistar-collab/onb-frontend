import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-12 w-auto",
  md: "h-12 w-auto sm:h-12",
  lg: "h-12 w-auto sm:h-12 md:h-14",
  xl: "h-12 w-auto sm:h-12 md:h-14 lg:h-16",
};

export default function Logo({ className, size = "xl" }: LogoProps) {

  return (
    <div className="flex-shrink-0">
      <Image 
        src="/logo.svg" 
        height={150} 
        width={150} 
        alt="logo" 
        className={cn(sizeClasses[size], className)}
        style={{ width: "auto" }}
        suppressHydrationWarning
      />
    </div>
  );
}
