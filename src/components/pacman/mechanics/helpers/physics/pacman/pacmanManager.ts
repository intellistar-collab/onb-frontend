import BoundaryManager from "../boundaries/boundaryManager";

export default class PacmanManager {
  static changeDirection(
    variables: any,
    assets: any,
    checkDirectionChange = PacmanManager.checkDirectionChange
  ) {
    const pacman = assets.characters.pacman;
    const boundaries = assets.props.boundaries;
    
    // Debug: Log when changeDirection is called with a direction
    if (variables.lastKeyPressed) {
      console.log("PacmanManager.changeDirection called with:", variables.lastKeyPressed);
    }
    
    if (variables.lastKeyPressed === "up") {
      checkDirectionChange(pacman, boundaries, {
        velocity: { x: 0, y: -pacman.speed },
      });
    } else if (variables.lastKeyPressed === "down") {
      checkDirectionChange(pacman, boundaries, {
        velocity: { x: 0, y: pacman.speed },
      });
    } else if (variables.lastKeyPressed === "right") {
      checkDirectionChange(pacman, boundaries, {
        velocity: { x: pacman.speed, y: 0 },
      });
    } else if (variables.lastKeyPressed === "left") {
      checkDirectionChange(pacman, boundaries, {
        velocity: { x: -pacman.speed, y: 0 },
      });
    }
  }

  static checkDirectionChange(pacman: any, boundaries: any[], { velocity }: { velocity: { x: number; y: number } }) {
    let count = 0;
    for (let i = 0; i < boundaries.length; i++) {
      if (
        BoundaryManager.hitBoundaryConditional(pacman, boundaries[i], {
          velocity,
        })
      )
        count++;
    }
    if (count === 0) {
      pacman.velocity.x = velocity.x;
      pacman.velocity.y = velocity.y;
      console.log("Velocity applied:", velocity);
    } else {
      console.log("Boundary collision detected, velocity not applied");
    }
  }

  static checkIfPacmanIsEating(assets: any) {
    let count = 0;
    const pacman = assets.characters.pacman;
    assets.props.pellets.forEach((pellet: any) => {
      if (
        pellet.position.y - pellet.radius <=
          pacman.position.y + pacman.radius * 2 + pacman.velocity.y * 2 &&
        pellet.position.y + pellet.radius >=
          pacman.position.y - pacman.radius * 2 + pacman.velocity.y * 2 &&
        pellet.position.x + pellet.radius >=
          pacman.position.x - pacman.radius * 2 + pacman.velocity.x * 2 &&
        pellet.position.x - pellet.radius <=
          pacman.position.x + pacman.radius * 2 + pacman.velocity.x * 2 &&
        !pellet.hasBeenEaten
      ) {
        count++;
      }
    });
    if (count > 0) {
      pacman.isEating = true;
    } else {
      pacman.isEating = false;
    }
  }
}
