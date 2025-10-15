"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Gamepad2, LogIn, X } from "lucide-react";

interface GameOverProps {
  score: number;
  level: number;
  userId?: string;
  username?: string;
  isLoggedIn: boolean;
  onPlayAgain: () => void;
  onQuit: () => void;
  onSignIn: () => void;
  onClose?: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
  score,
  level,
  userId,
  username,
  isLoggedIn,
  onPlayAgain,
  onQuit,
  onSignIn,
  onClose,
}) => {
  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Main Game Over Dialog */}
      <div 
        className="relative bg-gradient-to-br from-slate-900 via-black to-slate-900 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {/* Decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl blur opacity-50"></div>
        
        <div className="relative z-10 text-center">
          {/* Game Over Title */}
          <h1 className="text-3xl font-rage font-bold text-secondary mb-4 uppercase tracking-wider">
            Game Over
          </h1>

          {/* Score Display */}
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-secondary" />
              <span className="text-base font-oswald text-white/80 uppercase tracking-wide">
                Final Score
              </span>
            </div>
            <div className="text-2xl font-pricedown font-bold text-secondary">
              {score}
            </div>
            <div className="text-xs font-oswald text-white/60 mt-1">
              Level {level}
            </div>
          </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={onPlayAgain}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-oswald font-bold uppercase tracking-wide px-4 py-2 rounded-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Again
                </Button>

                <Button
                  onClick={onQuit}
                  className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-oswald font-bold uppercase tracking-wide px-4 py-2 rounded-lg shadow-lg hover:shadow-slate-500/25 transition-all duration-300 hover:scale-105"
                >
                  <X className="w-4 h-4 mr-2" />
                  Quit
                </Button>
              </div>

          {/* User Info */}
          {isLoggedIn && username && (
            <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-xs font-oswald text-white/70">
                Score automatically saved for{" "}
                <span className="text-secondary font-bold">{username}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameOver;
