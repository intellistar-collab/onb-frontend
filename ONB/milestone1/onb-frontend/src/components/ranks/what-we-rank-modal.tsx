"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import DarkBackground from "../common/dark-background";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { X, EyeOff, Trophy, Star, Zap, Crown, Sparkles } from "lucide-react";
import "./elastic-animation.css";

const WhatWeRankModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isClosing, setIsClosing] = useState(false);


  useEffect(() => {
    // Set client-side flag to avoid hydration issues
    setIsClient(true);
    
    // Check if user has previously dismissed the modal
    const dismissed = localStorage.getItem('what-we-rank-dismissed');
    if (dismissed !== 'true') {
      console.log('WhatWeRankModal: useEffect triggered - showing modal');
      setShouldShow(true);
      setIsOpen(true);
    } else {
      console.log('WhatWeRankModal: User has dismissed modal - not showing');
      setShouldShow(false);
    }
  }, []);

  const handleCloseModal = (persist: boolean) => {
    console.log('WhatWeRankModal: Closing modal, persist:', persist);
    setIsClosing(true);
    setTimeout(() => {
      if (persist) {
        localStorage.setItem('what-we-rank-dismissed', 'true');
      }
      // Always unmount after close animation to avoid re-appearing
      setIsOpen(false);
      setShouldShow(false);
      setIsClosing(false);
    }, 600); // match elasticOut duration
  };


  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('WhatWeRankModal: Close button clicked');
    handleCloseModal(false);
  };

  const handleDontShowAgain = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('WhatWeRankModal: User clicked "Don\'t show again"');
    handleCloseModal(true);
  };

  // For testing - you can call this function in browser console to reset
  const resetModal = () => {
    localStorage.removeItem('what-we-rank-dismissed');
    console.log('Modal reset - will show again on next page load');
  };

  // Make resetModal available globally for testing
  if (typeof window !== 'undefined') {
    (window as any).resetModal = resetModal;
  }

  // Debug logging
  console.log('WhatWeRankModal render:', { isClient, shouldShow, isOpen, isClosing });

  // Don't render anything on server-side
  if (!isClient) {
    console.log('WhatWeRankModal: Not rendering - not client side yet');
    return null;
  }

  // Don't render if user has dismissed
  if (!shouldShow) {
    console.log('WhatWeRankModal: Not rendering - shouldShow is false');
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {
      // Disable automatic close handling - we handle everything manually
      // This prevents double-triggering from Dialog's internal logic
    }}>
      <DialogContent 
        hideCloseButton={true}
        className="max-w-4xl max-h-[90vh] overflow-y-auto p-0" 
        style={{
          animation: isClosing 
            ? 'elasticOut 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' 
            : 'elasticIn 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
        }}>
        <div className="relative min-h-[30rem] overflow-hidden rounded-xl">
          <Image
            src="/box/what-we-do.webp"
            alt="What We Rank background"
            fill
            className="object-cover object-center -z-10"
          />
          
          {/* Dark overlay for better text readability - matching ranks page */}
          <div className="absolute inset-0 bg-black/30 -z-10"></div>
          
          {/* Content positioned as side-by-side cards - matching original design */}
          <div className="absolute inset-0 flex flex-col md:flex-row gap-4 md:gap-36 p-8">
            {/* Left card - How We Rank */}
            <div className="flex-1 flex items-center">
              <DarkBackground className="flex-1">
                <h1 className="md:text-4xl text-2xl font-oswald text-white mb-4">How We Rank</h1>
                <p className="md:text-base text-sm text-gray-200 leading-relaxed">
                  Our <span className="text-yellow-400 font-semibold">ranking system</span> rewards consistent play and strategic choices. 
                  Earn points by opening boxes, collecting rare items, and completing 
                  achievements. The more you play, the higher you climb. From <span className="text-amber-400 font-semibold">Bronze</span> 
                  to <span className="text-blue-400 font-semibold">Diamond</span> tiers, every player has the chance to reach the top and 
                  claim exclusive rewards reserved for the elite.
                </p>
              </DarkBackground>
            </div>
            
            {/* Right card - Why Rank Matters */}
            <div className="flex-1 flex items-center justify-end">
              <DarkBackground className="flex-1">
                <h1 className="md:text-4xl text-2xl font-oswald text-white mb-4">Why Rank Matters</h1>
                <p className="md:text-base text-sm text-gray-200 leading-relaxed">
                  Higher ranks unlock <span className="text-green-400 font-semibold">exclusive boxes</span>, special events, and VIP 
                  experiences. Top players get early access to limited editions, 
                  bonus multipliers, and invitations to exclusive tournaments. 
                  Compete with players worldwide and prove you're among the <span className="text-purple-400 font-semibold">best</span> 
                  mystery box collectors in the community.
                </p>
              </DarkBackground>
            </div>
          </div>

        </div>
        
        {/* Action buttons - matching ranks page styling */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            onClick={handleDontShowAgain}
            variant="outline"
            size="sm"
            className="bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700/80 hover:border-slate-500 transition-colors duration-200 backdrop-blur-sm"
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Don't show again
          </Button>
          <Button
            onClick={handleClose}
            variant="outline"
            size="sm"
            className="bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700/80 hover:border-slate-500 transition-colors duration-200 backdrop-blur-sm"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatWeRankModal;
