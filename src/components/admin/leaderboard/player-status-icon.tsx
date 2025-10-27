import React from "react";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";
import { PlayerStatusIconProps } from "./types";
import { cn } from "@/lib/utils";

export const PlayerStatusIcon: React.FC<PlayerStatusIconProps> = ({ 
  status, 
  className 
}) => {
  const getIcon = () => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "suspended":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className={cn("flex items-center", className)}>
      {getIcon()}
    </div>
  );
};
