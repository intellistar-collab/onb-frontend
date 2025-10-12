import GhostMovement from "./movement/ghostMovement";
import BoundaryManager from "../boundaries/boundaryManager";
import GhostCollision from "./collisions/ghostCollision";

export default class GhostManager {
  static updateCollisions(boundaries: any[], collisions: string[], ghost: any) {
    boundaries.forEach((boundary: any) => {
      if (
        !collisions.includes("down") &&
        BoundaryManager.hitBoundaryConditional(ghost, boundary, {
          velocity: { x: 0, y: ghost.speed },
        })
      ) {
        collisions.push("down");
      } else if (
        !collisions.includes("right") &&
        BoundaryManager.hitBoundaryConditional(ghost, boundary, {
          velocity: { x: ghost.speed, y: 0 },
        })
      ) {
        collisions.push("right");
      } else if (
        !collisions.includes("left") &&
        BoundaryManager.hitBoundaryConditional(ghost, boundary, {
          velocity: { x: -ghost.speed, y: 0 },
        })
      ) {
        collisions.push("left");
      } else if (
        !collisions.includes("up") &&
        BoundaryManager.hitBoundaryConditional(ghost, boundary, {
          velocity: { x: 0, y: -ghost.speed },
        })
      ) {
        collisions.push("up");
      }
    });
    if (collisions.length > ghost.prevCollisions.length) {
      ghost.prevCollisions = collisions;
    }
  }

  static chooseMovement(ghost: any, assets: any, collisions: string[], variables: any) {
    if (!ghost.isScared && !ghost.isRetreating) {
      GhostMovement.chaseAndScatter(ghost, assets, collisions, variables);
    } else {
      GhostMovement.moveRandomly(ghost, collisions);
    }
    GhostMovement.emptyPrevCollisions(ghost);
    ghost.assignSprite();
  }

  static checkPacmanGhostCollision(
    ghost: any,
    assets: any,
    variables: any,
    ctx: CanvasRenderingContext2D,
    collisionConditional = GhostCollision.collisionConditional,
    dealWithCollision = GhostCollision.dealWithCollision
  ) {
    if (collisionConditional(ghost, assets.characters.pacman)) {
      dealWithCollision(ghost, assets, variables, ctx);
    }
  }
}
