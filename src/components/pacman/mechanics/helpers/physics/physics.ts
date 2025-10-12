import BoundaryManager from "./boundaries/boundaryManager";
import PelletManager from "./pellets/pelletManager";
import PowerUpManager from "./powerUps/powerUpManager";
import GhostManager from "./ghosts/ghostManager";
import PacmanManager from "./pacman/pacmanManager";

export default class Physics {
  static implementBoundaries(assets: any, ctx: CanvasRenderingContext2D) {
    assets.props.boundaries.forEach((boundary: any) => {
      boundary.draw(ctx);
      BoundaryManager.stopPacmanCollision(boundary, assets.characters.pacman);
    });
  }

  static implementPellets(assets: any, ctx: CanvasRenderingContext2D, variables: any) {
    assets.props.pellets.forEach((pellet: any) => {
      if (!pellet.hasBeenEaten) {
        pellet.draw(ctx);
        PelletManager.eatPellet(pellet, assets.characters.pacman, variables);
      }
    });
    PelletManager.checkLevelUpCondition(assets, variables, ctx);
  }

  static implementPowerUps(assets: any, ctx: CanvasRenderingContext2D, variables: any) {
    assets.props.powerUps.forEach((powerUp: any) => {
      if (!powerUp.hasBeenEaten) {
        powerUp.update(ctx);
        PowerUpManager.eatPowerUp(powerUp, assets, variables);
      }
    });
  }

  static implementGhosts(assets: any, ctx: CanvasRenderingContext2D, variables: any) {
    Object.values(assets.characters.ghosts).forEach((ghost: any) => {
      const collisions: any[] = [];

      if (!ghost.released) {
        ghost.draw(ctx); // Draw ghost but don't move
        return;
      }

      ghost.update(ctx);

      BoundaryManager.implementTunnel(ghost, variables);
      GhostManager.updateCollisions(assets.props.boundaries, collisions, ghost);
      if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
        GhostManager.chooseMovement(ghost, assets, collisions, variables);
      }
      GhostManager.checkPacmanGhostCollision(ghost, assets, variables, ctx);
    });
  }

  static implementPacman(variables: any, assets: any, ctx: CanvasRenderingContext2D) {
    PacmanManager.changeDirection(variables, assets);
    PacmanManager.checkIfPacmanIsEating(assets);
    assets.characters.pacman.update(ctx);
    BoundaryManager.implementTunnel(assets.characters.pacman, variables);
  }
}
