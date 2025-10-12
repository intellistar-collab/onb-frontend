import Graphics from "../../graphics/graphics";
import playGame from "../../../playGame";

export default class PelletManager {
  static eatPellet(pellet: any, pacman: any, variables: any) {
    if (
      pellet.position.x === pacman.position.x &&
      pellet.position.y === pacman.position.y
    ) {
      pellet.changeEatenState();
      variables.score += 10;
    }
  }

  static checkLevelUpCondition(assets: any, variables: any, ctx: CanvasRenderingContext2D) {
    let eatenPellets = 0;
    assets.props.pellets.forEach((pellet: any) => {
      if (pellet.hasBeenEaten) {
        eatenPellets++;
      }
      if (eatenPellets === assets.props.pellets.length) {
        cancelAnimationFrame(variables.animationId);
        assets.audioPlayer.stopGhostAudio();
        assets.audioPlayer.playLevelUp();
        assets.characters.pacman.isLevellingUp = true;
        Graphics.runLevelUpAnimation(variables, assets, ctx);
      }
    });
  }

  static resetAfterLevelUp(assets: any, variables: any, callback = playGame) {
    assets.characters.pacman.reset();
    variables.lastKeyPressed = "";
    variables.levelUpCount = 0;
    assets.timers.cycleTimer.reset();
    assets.timers.scaredTimer.reset();
    if (assets.timers.scaredTimer.duration > 0)
      assets.timers.scaredTimer.duration -= 500;

    // Apply reset with delay for each ghost
    Object.values(assets.characters.ghosts).forEach((ghost: any, index: number) => {
      ghost.reset(index);
    });
    assets.props.pellets.forEach((pellet: any) => {
      pellet.changeEatenState();
    });
    assets.props.powerUps.forEach((powerUp: any) => {
      if (powerUp.hasBeenEaten) powerUp.changeEatenState();
    });
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    assets.timers.cycleTimer.start();
    callback(variables.player, variables.reactRoot);
  }
}
