"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import PacmanModal from "./pacman-modal";
import AuthDialogs from "@/components/auth/auth-dialogs";

export default function PacmanCompact() {
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user } = useAuth();

  const handlePlay = () => {
    if (user) {
      setIsGameModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <div className="relative h-full w-full flex flex-col justify-center p-6 overflow-hidden">
        {/* Background - Pacman Game Preview */}
        <div className="absolute inset-0 w-full h-full">
          {/* Game Preview Background */}
          <div className="h-full w-full bg-black relative overflow-hidden">
            {/* Pacman Maze Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-14 gap-1 p-4 h-full">
                {Array.from({ length: 196 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-4 w-4 rounded-full ${
                      Math.random() > 0.3 ? 'bg-yellow-400' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Pacman Character */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl animate-bounce">🟡</div>
            </div>
            
            {/* Ghosts */}
            <div className="absolute top-1/3 left-1/4">
              <div className="text-4xl animate-pulse">👻</div>
            </div>
            <div className="absolute top-1/3 right-1/4">
              <div className="text-4xl animate-pulse">👻</div>
            </div>
            <div className="absolute bottom-1/3 left-1/3">
              <div className="text-4xl animate-pulse">👻</div>
            </div>
            <div className="absolute bottom-1/3 right-1/3">
              <div className="text-4xl animate-pulse">👻</div>
            </div>
          </div>
        </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-yellow-400 mb-2 font-oswald drop-shadow-2xl">
            🟡 PIMP CATCHER
          </h2>
          <p className="text-white/90 mb-4 font-oswald text-sm drop-shadow-2xl">
            {user ? "Classic arcade adventure!" : "Sign in to play!"}
          </p>
          <Button
            onClick={handlePlay}
            className="
              font-pricedown text-lg text-black bg-yellow-400
              hover:bg-yellow-300 hover:scale-105 transition-all duration-300
              px-6 py-2 rounded-lg shadow-lg border-2 border-yellow-300
            "
          >
            {user ? "Play Now" : "Sign In to Play"}
          </Button>
        </div>
      </div>

      {/* Game Modal */}
      <PacmanModal 
        isOpen={isGameModalOpen} 
        onClose={() => setIsGameModalOpen(false)} 
      />

      {/* Auth Dialog */}
      <AuthDialogs 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab="login"
      />
    </>
  );
}
