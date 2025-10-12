import playGame from "../../../playGame";
import Graphics from "../graphics";

export default class Animator {
  static loadPauseOverlay(
    ctx: CanvasRenderingContext2D,
    pauseTextImage: HTMLImageElement,
    loadTint = Animator.loadTint,
    loadPauseText = Animator.loadPauseText
  ) {
    loadTint(ctx);
    loadPauseText(ctx, pauseTextImage);
  }

  static loadTint(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = 0.7;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 896, 992);
  }

  static loadPauseText(ctx: CanvasRenderingContext2D, pauseTextImage: HTMLImageElement) {
    ctx.globalAlpha = 1;
    ctx.drawImage(pauseTextImage, 98, 394, 700, 140);
  }

  static resumeAnimation(variables: any, ctx: CanvasRenderingContext2D, assets: any, callback = playGame) {
    if (assets.characters.pacman.isShrinking) {
      Graphics.runDeathAnimation(variables, ctx, assets);
    } else if (assets.characters.pacman.isLevellingUp) {
      Graphics.runLevelUpAnimation(variables, assets, ctx);
    } else {
      callback(variables.player, variables.reactRoot);
    }
  }

  static drawLevelUpBoard(ctx: CanvasRenderingContext2D, boundaries: any[]) {
    ctx.clearRect(0, 0, 896, 992);
    boundaries.forEach((boundary: any) => boundary.draw(ctx));

    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "30px 'Pricedown', sans-serif";
    ctx.fillText("Level Up!", 448, 560);
  }

  static drawBoard(ctx: CanvasRenderingContext2D, assets: any) {
    ctx.clearRect(0, 0, 896, 992);
    assets.props.boundaries.forEach((boundary: any) => boundary.draw(ctx));
    assets.props.pellets.forEach((pellet: any) => {
      if (!pellet.hasBeenEaten) pellet.draw(ctx);
    });
    assets.props.powerUps.forEach((powerUp: any) => {
      if (!powerUp.hasBeenEaten) powerUp.update(ctx);
    });
  }

  static displayPleaseWait(ctx: CanvasRenderingContext2D, loadTint = Animator.loadTint) {
    loadTint(ctx);

    ctx.font = "100px 'Pricedown', sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Please wait...", 448, 496);
  }
}
