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
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <img
            src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNDhvNGd6dXc1ejRlMjFlemNwcnc4MnFzbHNieGtoNXFld3llYm5uNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cyMqOH8rjgDHG/giphy.gif"
            alt="Pac-Man background"
            className="h-full w-auto object-contain"
          />
      </div>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2 font-oswald drop-shadow-2xl">
            🎮 Play Pimp Catcher
          </h2>
          <p className="text-white/90 mb-4 font-oswald text-sm drop-shadow-2xl">
            Classic arcade fun!
          </p>
          <Button
            onClick={handlePlay}
            className="
              font-pricedown text-lg text-green-700 bg-white
              hover:bg-gray-100 hover:scale-105 transition-all duration-300
              px-6 py-2 rounded-lg shadow-lg
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
