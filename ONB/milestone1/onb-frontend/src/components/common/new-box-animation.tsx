"use client";

import React, { useEffect, useState } from 'react';
import { Gift, Sparkles, Star } from 'lucide-react';

interface NewBoxAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

const NewBoxAnimation: React.FC<NewBoxAnimationProps> = ({ trigger, onComplete }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'entering' | 'active' | 'exiting'>('idle');

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      setAnimationPhase('entering');
      
      const timer1 = setTimeout(() => setAnimationPhase('active'), 300);
      const timer2 = setTimeout(() => setAnimationPhase('exiting'), 2000);
      const timer3 = setTimeout(() => {
        setIsVisible(false);
        setAnimationPhase('idle');
        onComplete?.();
      }, 3000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [trigger, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Main animation container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Floating gift box */}
        <div className={`
          relative transition-all duration-1000 ease-out
          ${animationPhase === 'entering' ? 'scale-0 opacity-0' : ''}
          ${animationPhase === 'active' ? 'scale-100 opacity-100' : ''}
          ${animationPhase === 'exiting' ? 'scale-110 opacity-0' : ''}
        `}>
          <div className="relative">
            {/* Gift box icon */}
            <Gift className="w-24 h-24 text-pink-500 drop-shadow-2xl" />
            
            {/* Glow effect */}
            <div className="absolute inset-0 w-24 h-24 bg-pink-500/30 rounded-lg blur-xl animate-pulse" />
          </div>
        </div>

        {/* Text animation */}
        <div className={`
          mt-6 text-center transition-all duration-1000 ease-out
          ${animationPhase === 'entering' ? 'translate-y-8 opacity-0' : ''}
          ${animationPhase === 'active' ? 'translate-y-0 opacity-100' : ''}
          ${animationPhase === 'exiting' ? '-translate-y-8 opacity-0' : ''}
        `}>
          <h2 className="text-3xl font-pricedown text-white drop-shadow-lg">
            NEW BOX ADDED!
          </h2>
          <p className="text-lg text-pink-300 mt-2">
            Check out the latest mystery boxes
          </p>
        </div>

        {/* Sparkle effects */}
        {animationPhase === 'active' && (
          <>
            <Sparkles className="absolute -top-8 -left-8 w-6 h-6 text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
            <Star className="absolute -top-6 -right-6 w-5 h-5 text-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
            <Sparkles className="absolute -bottom-8 -right-8 w-4 h-4 text-green-400 animate-bounce" style={{ animationDelay: '0.6s' }} />
            <Star className="absolute -bottom-6 -left-6 w-5 h-5 text-purple-400 animate-bounce" style={{ animationDelay: '0.8s' }} />
          </>
        )}

        {/* Particle effects */}
        {animationPhase === 'active' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-pink-400 rounded-full animate-ping"
                style={{
                  left: `${20 + (i * 5)}%`,
                  top: `${30 + (i * 3)}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewBoxAnimation;
