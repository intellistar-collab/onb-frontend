"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedNotificationIndicatorProps {
  show: boolean;
  count?: number;
  className?: string;
  variant?: 'default' | 'pulse' | 'glow' | 'sparkle';
}

const EnhancedNotificationIndicator: React.FC<EnhancedNotificationIndicatorProps> = ({ 
  show, 
  count = 0, 
  className,
  variant = 'default'
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!show || !mounted) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'pulse':
        return 'animate-pulse';
      case 'glow':
        return 'animate-ping';
      case 'sparkle':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  return (
    <div className={cn("relative", className)} suppressHydrationWarning>
      {/* Pulsing rings */}
      <div className="absolute inset-0 rounded-full bg-pink-500/60 animate-ping" />
      <div className="absolute inset-0 rounded-full bg-pink-400/55 animate-ping animation-delay-100" />
      <div className="absolute inset-0 rounded-full bg-pink-600/50 animate-ping animation-delay-200" />
      <div className="absolute inset-0 rounded-full bg-pink-500/45 animate-ping animation-delay-300" />
      
      {/* Flash effect */}
      <div className="absolute inset-0 rounded-full bg-pink-500/80 animate-pulse" />
      
      {/* Shake effect */}
      <div className="absolute inset-0 rounded-full bg-pink-600/60 animate-bounce" />
    
      {/* Main notification dot */}
      <div className="relative flex items-center justify-center w-6 h-6 rounded-full shadow-lg transition-all duration-300 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 animate-pulse">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 rounded-full animate-pulse" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-400 opacity-90 blur-sm rounded-full animate-pulse" />
        
        {/* Count or dot */}
        {count > 0 ? (
          <span className="relative z-10 text-xs font-bold text-white drop-shadow-lg animate-pulse">
            {count > 9 ? '9+' : count}
          </span>
        ) : (
          <div className="relative z-10 w-2 h-2 bg-white rounded-full drop-shadow-lg animate-pulse" />
        )}
      </div>
    </div>
  );
};

export default EnhancedNotificationIndicator;
