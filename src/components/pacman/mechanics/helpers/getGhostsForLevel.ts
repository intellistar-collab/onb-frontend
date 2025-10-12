import Ghost from "../../models/ghost";
import Factory from "../factory/factory";

export function getGhostsForLevel(level: number, tileLength: number): { [key: string]: Ghost } {
  const maxGhosts = Math.min(3 + (level - 1), Factory.GHOST_DATA.length); // level 1: 2 ghosts, +1 per level
  const ghostEntries = Factory.GHOST_DATA.slice(0, maxGhosts);
  const ghosts: { [key: string]: Ghost } = {};
  ghostEntries.forEach((data: any) => {
    const ghost = new Ghost(
      {
        position: {
          x: (tileLength * data.position.x) / 2,
          y: (tileLength * data.position.y) / 2,
        },
        velocity: {
          x: tileLength * data.velocity.x,
          y: tileLength * data.velocity.y,
        },
        colour: data.colour,
      },
      tileLength
    );
    ghost.assignSprite();
    ghosts[data.colour] = ghost;
  });
  return ghosts;
}
