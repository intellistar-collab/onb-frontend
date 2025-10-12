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
    if (!isLoading) {
      callback(player, null, setIsPaused);
    }
  }, [callback, player, isLoading]);

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

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black flex items-center justify-center z-[99999]">
          <div className="text-white text-xl font-oswald">Loading...</div>
          <div className="ml-4 w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
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
    </>
  );
}
