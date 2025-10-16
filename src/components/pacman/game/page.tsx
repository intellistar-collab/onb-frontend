"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap, Gamepad2, X } from "lucide-react";
import styles from "./game.module.css";
import playGame from "../mechanics/playGame";

interface GameProps {
  player?: any;
  callback?: (player: any, reactRoot: any, onPauseChange: (paused: boolean) => void) => void;
}

export default function Game({ player, callback = playGame }: GameProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const joystickRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // You can use this for showing pause menu or other UI logic
  }, [isPaused]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Hide loading after 2 seconds
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && gameStarted) {
      // Add a small delay to ensure DOM elements are ready
      const timer = setTimeout(() => {
        callback(player, null, setIsPaused);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [callback, player, isLoading, gameStarted]);

  useEffect(() => {
        let lastDirection: string | null = null;
        let joystick: any;

        const loadJoystick = async () => {
          const nipplejs = (await import("nipplejs")).default;

          joystick = nipplejs.create({
            zone: joystickRef.current!,
        mode: "static",
        color: "white",
        size: 100,
        position: { top: "50%", left: "50%" }, // center in zone
      });

          joystick.on("move", (evt: any, data: any) => {
        if (!data?.angle?.degree) return;

        const angle = data.angle.degree;
        let direction = null;

        if (angle >= 315 || angle < 45) {
          direction = "ArrowRight";
        } else if (angle >= 45 && angle < 135) {
          direction = "ArrowUp";
        } else if (angle >= 135 && angle < 225) {
          direction = "ArrowLeft";
        } else if (angle >= 225 && angle < 315) {
          direction = "ArrowDown";
        }

        if (
          direction &&
          direction !== lastDirection &&
          typeof window !== "undefined"
        ) {
          const arrow = new KeyboardEvent("keydown", { key: direction });
          window.dispatchEvent(arrow);
          lastDirection = direction;
        }
      });

      joystick.on("end", () => {
        lastDirection = null;
      });
    };

    if (typeof window !== "undefined" && joystickRef.current) {
      loadJoystick();
    }

    return () => {
      if (joystick) {
        joystick.destroy();
      }
    };
  }, []);

  const handleStartGame = () => {
    setGameStarted(true);
    // Focus the game container to ensure it receives keyboard events
    setTimeout(() => {
      const gameContainer = document.getElementById('game-root');
      if (gameContainer) {
        gameContainer.focus();
      }
    }, 100);
  };

  const handleExitGame = () => {
    setGameStarted(false);
    setIsPaused(false);
  };

  // Add keyboard support for starting the game
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isLoading && !gameStarted && (event.key === 'Enter' || event.key === ' ')) {
        handleStartGame();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isLoading, gameStarted]);

  return (
    <>
      {isLoading && (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-black to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-lg animate-pulse"></div>
              <div className="relative bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xl font-oswald text-white">Loading Game...</span>
                </div>
              </div>
            </div>
            <div className="text-sm text-white/70 font-oswald">Preparing your adventure...</div>
          </div>
        </div>
      )}
      
      {!isLoading && !gameStarted && (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-black to-slate-900 flex flex-col items-center justify-center text-white font-oswald p-6">
          {/* Game Title */}
          <div className="text-center mb-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-xl animate-pulse"></div>
              <div className="relative bg-black/40 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                <h1 className="text-5xl md:text-6xl font-pricedown font-bold text-primary mb-4 animate-pulse">
                  🎮 PIMP CATCHER
                </h1>
                <div className="text-xl md:text-2xl text-secondary mb-2 font-oswald">Welcome, {player?.firstName || player?.username || 'Player'}!</div>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="mb-8">
            <Button
              onClick={handleStartGame}
              className="
                relative overflow-hidden
                bg-gradient-to-r from-primary to-secondary
                hover:from-primary/90 hover:to-secondary/90
                text-black font-bold py-4 px-8 rounded-xl text-xl
                transition-all duration-300 hover:scale-105
                shadow-2xl hover:shadow-primary/30
                font-pricedown
              "
            >
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>START GAME</span>
              </div>
            </Button>
          </div>
        </div>
      )}

      {!isLoading && gameStarted && (
        <div 
          id="game-root" 
          className="fixed top-0 left-0 w-screen h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 z-50" 
          tabIndex={0}
          onClick={() => {
            // Ensure game container gets focus when clicked
            const gameContainer = document.getElementById('game-root');
            if (gameContainer) {
              gameContainer.focus();
            }
          }}
        >
          <div className={`${styles.gameContainer} relative w-full h-full flex flex-col`}>
            {/* Game Header - Fixed at top, outside game area */}
            <div className="w-full h-16 flex items-center justify-between px-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
              {/* Game Stats */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur"></div>
                  <div className="relative bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-oswald text-white">Score: 0</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur"></div>
                  <div className="relative bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="text-sm font-oswald text-white">Level: 1</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exit Button - Top Right Corner */}
              <div className="flex items-center">
                <Button
                  onClick={handleExitGame}
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Game Canvas - Takes remaining space */}
            <div className={`${styles.game} flex flex-col items-center justify-center flex-1 w-full`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl blur-xl"></div>
                <div className="relative bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <canvas
                    id="info"
                    className={`${styles.info} block`}
                    data-testid="info"
                    width="600"
                    height="30"
                  ></canvas>
                  <canvas
                    id="board"
                    className={`${styles.board} block mt-2`}
                    data-testid="board"
                    width="896"
                    height="992"
                  ></canvas>
                </div>
              </div>
            </div>

            {/* Mobile Joystick */}
            <div className={`${styles.joystick} absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20`} ref={joystickRef} />
          </div>
        </div>
      )}
    </>
  );
}
