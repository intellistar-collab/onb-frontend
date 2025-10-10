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
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

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
    <div className={cn("relative", className)}>
      {/* Emergency pulsing rings - multiple layers for urgency */}
      <div 
        className="absolute inset-0 rounded-full bg-pink-500/60 animate-ping" 
        style={{ animationDuration: '0.5s' }}
      />
      <div 
        className="absolute inset-0 rounded-full bg-pink-400/55 animate-ping" 
        style={{ animationDelay: '0.1s', animationDuration: '0.5s' }} 
      />
      <div 
        className="absolute inset-0 rounded-full bg-pink-600/50 animate-ping" 
        style={{ animationDelay: '0.2s', animationDuration: '0.5s' }} 
      />
      <div 
        className="absolute inset-0 rounded-full bg-pink-500/45 animate-ping" 
        style={{ animationDelay: '0.3s', animationDuration: '0.5s' }} 
      />
      
      {/* Emergency urgent flash effect */}
      <div 
        className="absolute inset-0 rounded-full bg-pink-500/80 animate-pulse" 
        style={{ animationDuration: '0.3s' }}
      />
      
      {/* Emergency shake effect */}
      <div 
        className="absolute inset-0 rounded-full bg-pink-600/60 animate-bounce" 
        style={{ animationDuration: '0.2s' }}
      />
    
      {/* Main notification dot with emergency gradient */}
      <div 
        className={cn(
          "relative flex items-center justify-center w-6 h-6 rounded-full shadow-lg transition-all duration-300",
          isAnimating ? "scale-110" : "scale-100"
        )}
        style={{
          background: 'linear-gradient(45deg, #ec4899, #f472b6, #ec4899)',
          animation: 'pulse 0.4s ease-in-out infinite'
        }}
      >
        {/* Emergency gradient background - intense pink */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600 rounded-full animate-pulse" 
          style={{ animationDuration: '0.6s' }}
        />
        
        {/* Emergency glow effect - stronger and more urgent */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-400 opacity-90 blur-sm rounded-full animate-pulse" 
          style={{ animationDuration: '0.4s' }}
        />
        
        {/* Count or dot */}
        {count > 0 ? (
          <span 
            className="relative z-10 text-xs font-bold text-white drop-shadow-lg animate-pulse"
            style={{ animationDuration: '0.5s' }}
          >
            {count > 9 ? '9+' : count}
          </span>
        ) : (
          <div 
            className="relative z-10 w-2 h-2 bg-white rounded-full drop-shadow-lg animate-pulse"
            style={{ animationDuration: '0.5s' }}
          />
        )}
      </div>
      
      
      {/* Emergency shimmer effect */}
      {isAnimating && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent rounded-full animate-pulse"
          style={{ animationDuration: '0.3s' }}
        />
      )}
    </div>
  );
};

export default EnhancedNotificationIndicator;
