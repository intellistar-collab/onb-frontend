"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
        console.log("Starting game with player:", player);
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
        <div className="fixed top-0 left-0 w-screen h-screen bg-black flex items-center justify-center z-[99999]">
          <div className="text-white text-xl font-oswald">Loading...</div>
          <div className="ml-4 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {!isLoading && !gameStarted && (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center text-white font-oswald">
          {/* Game Title */}
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold text-yellow-400 mb-4 animate-pulse">
              PAC-MAN
            </h1>
            <div className="text-2xl text-blue-400 mb-2">OneNightBox Edition</div>
            <div className="text-lg text-gray-300">Welcome, {player?.name || 'Player'}!</div>
          </div>

          {/* Game Instructions */}
          <div className="text-center mb-8 max-w-md">
            <div className="text-lg text-white mb-4">How to Play:</div>
            <div className="text-sm text-gray-300 space-y-1">
              <div>• Use arrow keys or joystick to move</div>
              <div>• Eat all dots to clear the level</div>
              <div>• Avoid the ghosts!</div>
              <div>• Eat power pellets to turn the tables</div>
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartGame}
            className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-4 px-8 rounded-lg text-xl transition-all duration-300 hover:scale-105 shadow-lg"
          >
            🎮 START GAME
          </button>

          {/* High Score Display */}
          <div className="mt-8 text-center">
            <div className="text-sm text-gray-400">High Score: 0</div>
            <div className="text-xs text-gray-500 mt-2">Press ENTER or SPACE to start • Press SPACE to pause during game</div>
          </div>
        </div>
      )}

      {!isLoading && gameStarted && (
        <div id="game-root">
          <div className={styles.gameContainer}>
            {!isPaused && (
              <Image
                src="/logo.svg"
                alt="ONB Logo"
                width={140}
                height={70}
                className={styles.overlayImage}
              />
            )}

            <div className={styles.game}>
              <canvas
                id="info"
                className={styles.info}
                data-testid="info"
                width="600"
                height="30"
              ></canvas>
              <canvas
                id="board"
                className={styles.board}
                data-testid="board"
                width="896"
                height="992"
              ></canvas>
            </div>

            <div className={styles.joystick} ref={joystickRef} />
          </div>
        </div>
      )}
    </>
  );
}
