import Animator from "./animator/animator";
import PelletManager from "../physics/pellets/pelletManager";
import GhostCollision from "../physics/ghosts/collisions/ghostCollision";
import RetreatingTimer from "../../../models/retreatingTimer";

import Ghost from "../../../models/ghost";
import Factory from "../../factory/factory";

export default class Graphics {
  static displayScore(ctx: CanvasRenderingContext2D, variables: any) {
    ctx.fillStyle = "#47761E";
    ctx.textAlign = "left";
    ctx.font = "30px 'Pricedown', sans-serif";
    ctx.fillText(`BAnk $${variables.score}`, 10, 15);
  }

  static displayLevel(ctx: CanvasRenderingContext2D, variables: any) {
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "30px 'Pricedown', sans-serif";
    ctx.fillText(`Level ${variables.level}`, 300, 15);
  }

  static displayLives(ctx: CanvasRenderingContext2D, pacman: any, drawStarIcon = Graphics.drawStarIcon) {
    const totalStars = 3;
    const starSpacing = 40;
    const startX = 500; // adjust position as needed
    const y = 15;

    for (let i = 0; i < totalStars; i++) {
      const filled = i <= pacman.lives;
      drawStarIcon(ctx, {
        x: startX + i * starSpacing,
        y,
        filled,
      });
    }
  }

  static drawStarIcon(ctx: CanvasRenderingContext2D, { x, y, radius = 12, filled = true }: { x: number; y: number; radius?: number; filled?: boolean }) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);

    const spikes = 5;
    const outerRadius = radius;
    const innerRadius = radius / 2;
    const step = Math.PI / spikes;

    ctx.moveTo(0, -outerRadius);

    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = i * step - Math.PI / 2;
      ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
    }

    ctx.closePath();

    if (filled) {
      ctx.fillStyle = "#FFD700"; // gold
      ctx.fill();
    } else {
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  }

  static drawPacmanIcon(ctx: CanvasRenderingContext2D, position: any) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, 15, Math.PI / 4, (Math.PI * 7) / 4);
    ctx.lineTo(position.x - 5, position.y);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }

  static runLevelUpAnimation(
    variables: any,
    assets: any,
    ctx: CanvasRenderingContext2D,
    runLevelUpAnimation = Graphics.runLevelUpAnimation
  ) {
    variables.animationId = requestAnimationFrame(() =>
      runLevelUpAnimation(variables, assets, ctx)
    );
    if (performance.now() - variables.startTime >= variables.frameLifetime) {
      Animator.drawLevelUpBoard(ctx, assets.props.boundaries);
      if (variables.levelUpCount % 10 === 0 && variables.levelUpCount !== 0)
        assets.props.boundaries.forEach((boundary: any) => boundary.flash());
      variables.levelUpCount++;
      if (variables.levelUpCount >= 350) {
        assets.characters.pacman.isLevellingUp = false;
        cancelAnimationFrame(variables.animationId);
        variables.level++;
        // ✅ Only when level becomes 2, add the ghost from GHOST_DATA[1]
        if (variables.level === 2) {
          const ghostData = Factory.GHOST_DATA[Factory.GHOST_DATA.length - 1];
          const ghost = new Ghost(
            {
              position: {
                x: (variables.tileLength * ghostData.position.x) / 2,
                y: (variables.tileLength * ghostData.position.y) / 2,
              },
              velocity: {
                x: variables.tileLength * ghostData.velocity.x,
                y: variables.tileLength * ghostData.velocity.y,
              },
              colour: ghostData.colour,
            },
            variables.tileLength
          );

          ghost.assignSprite();
          assets.characters.ghosts[ghostData.colour] = ghost;

          assets.timers.cycleTimer.ghosts.push(ghost);
          assets.timers.scaredTimer.ghosts.push(ghost);

          const retreatingTimer = new RetreatingTimer(ghost);
          ghost.retreatingTimer = retreatingTimer;
          assets.timers.retreatingTimers.push(retreatingTimer);
        }

        PelletManager.resetAfterLevelUp(assets, variables);
      }
      variables.startTime = performance.now();
    }
  }

  static runDeathAnimation(
    variables: any,
    ctx: CanvasRenderingContext2D,
    assets: any,
    runDeathAnimation = Graphics.runDeathAnimation
  ) {
    variables.animationId = requestAnimationFrame(() =>
      runDeathAnimation(variables, ctx, assets)
    );
    if (performance.now() - variables.startTime >= variables.frameLifetime) {
      Animator.drawBoard(ctx, assets);
      const pacman = assets.characters.pacman;
      if (pacman.radians < Math.PI) {
        pacman.shrink(ctx);
      } else {
        pacman.isShrinking = false;
        cancelAnimationFrame(variables.animationId);
        GhostCollision.checkPacmanLives(assets, variables, ctx);
      }
      variables.startTime = performance.now();
    }
  }
}
