"use client";

import Boundary from "../../models/boundary";
import Pellet from "../../models/pellet";
import PowerUp from "../../models/powerUp";
import Ghost from "../../models/ghost";
import PacMan from "../../models/pacman";
import CycleTimer from "../../models/cycleTimer";
import ScaredTimer from "../../models/scaredTimer";
import RetreatingTimer from "../../models/retreatingTimer";
import AudioPlayer from "../../models/audioPlayer";

export default class Factory {
  static PIPE_NAMES = {
    "-": "horizontal",
    "|": "vertical",
    1: "corner-one",
    2: "corner-two",
    3: "corner-three",
    4: "corner-four",
  };

  static TUNNEL_DATA = [
    { position: { x: -1, y: 13 } },
    { position: { x: -1, y: 15 } },
    { position: { x: 28, y: 13 } },
    { position: { x: 28, y: 15 } },
  ];

  static GHOST_DATA = [
    {
      colour: "red",
      position: { x: 31, y: 23 },
      velocity: { x: 0, y: -1 / 8 },
      startDelay: 0,
    },
    {
      colour: "pink",
      position: { x: 25, y: 23 },
      velocity: { x: 0, y: -1 / 8 },
      startDelay: 2000,
    },

    {
      colour: "cyan",
      position: { x: 37, y: 29 },
      velocity: { x: 1 / 8, y: 0 },
      startDelay: 4000,
    },
    {
      colour: "orange",
      position: { x: 19, y: 29 },
      velocity: { x: -1 / 8, y: 0 },
      startDelay: 6000,
    },
  ];

  static makeAssets(
    map: any,
    variables: any,
    makeGhosts = Factory.makeGhosts,
    makePacman = Factory.makePacman,
    makeCycleTimer = Factory.makeCycleTimer,
    makeScaredTimer = Factory.makeScaredTimer,
    makeRetreatingTimers = Factory.makeRetreatingTimers,
    makeBoundaries = Factory.makeBoundaries,
    makePellets = Factory.makePellets,
    makePowerUps = Factory.makePowerUps,
    makeAudioPlayer = Factory.makeAudioPlayer,
    makePauseTextImage = Factory.makePauseTextImage
  ) {
    const ghosts = makeGhosts(variables);
    return {
      props: {
        boundaries: makeBoundaries(map, variables),
        pellets: makePellets(map, variables),
        powerUps: makePowerUps(map, variables),
      },
      characters: {
        ghosts: ghosts,
        pacman: makePacman(variables),
      },
      timers: {
        cycleTimer: makeCycleTimer(ghosts),
        scaredTimer: makeScaredTimer(ghosts),
        retreatingTimers: makeRetreatingTimers(ghosts),
      },
      audioPlayer: makeAudioPlayer(),
      pauseTextImage: makePauseTextImage(),
    };
  }

  static makeBoundaries(
    map: any,
    variables: any,
    makeTunnelBoundaries = Factory.makeTunnelBoundaries
  ) {
    const boundaries: any[] = [];

    map.forEach((row: any, i: number) => {
      row.forEach((element: any, j: number) => {
        if (element !== " " && element !== "." && element !== "o") {
          if (typeof window !== "undefined") {
            const regularImage = new window.Image();
            regularImage.src = `/images/pipe-${Factory.PIPE_NAMES[element as keyof typeof Factory.PIPE_NAMES]}.png`;

            const whiteImage = new window.Image();
            whiteImage.src = `/images/pipe-${Factory.PIPE_NAMES[element as keyof typeof Factory.PIPE_NAMES]}-white.png`;

            const boundary = new Boundary(
              {
                position: {
                  x: variables.tileLength * j,
                  y: variables.tileLength * i,
                },
                regularImage: regularImage,
                whiteImage: whiteImage,
              },
              variables.tileLength
            );
            boundaries.push(boundary);
          }
        }
      });
    });

    makeTunnelBoundaries(boundaries, variables);
    return boundaries;
  }

  static makeTunnelBoundaries(boundaries: any[], variables: any) {
    if (typeof window !== "undefined") {
      const regularImage = new window.Image();
      regularImage.src = "/images/pipe-horizontal.png";
      const whiteImage = new window.Image();
      whiteImage.src = "/images/pipe-horizontal-white.png";
      Factory.TUNNEL_DATA.forEach((data) => {
        const tunnelBoundary = new Boundary(
          {
            position: {
              x: variables.tileLength * data.position.x,
              y: variables.tileLength * data.position.y,
            },
            regularImage: regularImage,
            whiteImage: whiteImage,
          },
          variables.tileLength
        );
        boundaries.push(tunnelBoundary);
      });
    }
  }

  static makePellets(map: any, variables: any) {
    const pellets: any[] = [];
    map.forEach((row: any, i: number) => {
      row.forEach((element: any, j: number) => {
        if (element === ".") {
          const pellet = new Pellet(
            {
              position: {
                x: (variables.tileLength * (2 * j + 1)) / 2,
                y: (variables.tileLength * (2 * i + 1)) / 2,
              },
            },
            variables.tileLength
          );
          pellets.push(pellet);
        }
      });
    });
    return pellets;
  }

  static makePowerUps(map: any, variables: any) {
    const powerUps: any[] = [];
    const powerUpImages = [
      "/images/powerup1.png",
      "/images/powerup2.png",
      "/images/powerup3.png",
      "/images/powerup4.png",
    ];
    let imageIndex = 0;

    map.forEach((row: any, i: number) => {
      row.forEach((element: any, j: number) => {
        if (element === "o") {
          const powerUp = new PowerUp(
            {
              position: {
                x: (variables.tileLength * (2 * j + 1)) / 2,
                y: (variables.tileLength * (2 * i + 1)) / 2,
              },
              imageSrc: powerUpImages[imageIndex % powerUpImages.length],
            },
            variables.tileLength
          );
          powerUps.push(powerUp);
          imageIndex++;
        }
      });
    });
    return powerUps;
  }

  static makeGhosts(variables: any) {
        const ghosts: { [key: string]: any } = {};

    // 👇 Limit number of ghosts based on current level
    // const maxGhosts = Math.min(Factory.GHOST_DATA.length, variables.level);
    const maxGhosts = Math.min(
      3 + (variables.level - 1),
      Factory.GHOST_DATA.length
    );
    const slicedGhostData = Factory.GHOST_DATA.slice(0, maxGhosts);

    slicedGhostData.forEach((data) => {
      const ghost = new Ghost(
        {
          position: {
            x: (variables.tileLength * data.position.x) / 2,
            y: (variables.tileLength * data.position.y) / 2,
          },
          velocity: {
            x: variables.tileLength * data.velocity.x,
            y: variables.tileLength * data.velocity.y,
          },
          colour: data.colour,
        },
        variables.tileLength
      );
      ghost.assignSprite();
      ghosts[data.colour] = ghost;
    });

    return ghosts;
  }

  static makePacman(variables: any) {
    return new PacMan(
      {
        position: {
          x: (variables.tileLength * 29) / 2,
          y: (variables.tileLength * 47) / 2,
        },
        velocity: {
          x: 0,
          y: 0,
        },
      },
      variables.tileLength
    );
  }

  static makeCycleTimer(ghosts: any) {
    return new CycleTimer(Object.values(ghosts));
  }

  static makeScaredTimer(ghosts: any) {
    return new ScaredTimer(Object.values(ghosts));
  }

  static makeRetreatingTimers(ghosts: any) {
    const retreatingTimers: any[] = [];
    Object.values(ghosts).forEach((ghost: any) => {
      const retreatingTimer = new RetreatingTimer(ghost);
      ghost.retreatingTimer = retreatingTimer;
      retreatingTimers.push(retreatingTimer);
    });
    return retreatingTimers;
  }

  static makeAudioPlayer() {
    return new AudioPlayer();
  }

  static makePauseTextImage() {
    if (typeof window !== "undefined") {
      const image = new window.Image();
      image.src = "/images/pause-text.png";
      return image;
    }

    return null;
  }
}
