import EventListener from "../helpers/eventListener/eventListener";
import Physics from "../helpers/physics/physics";
import Graphics from "../helpers/graphics/graphics";
import AudioManager from "../helpers/audio/audioManager";

export default class Game {
  static finishSetup(variables: any, player: any, reactRoot: any, assets: any, ctx: CanvasRenderingContext2D, onPauseChange?: (paused: boolean) => void) {
    variables.player = player;
    if (!variables.reactRoot) {
      const container = document.getElementById("game-root");
      if (container) {
        variables.reactRoot = container;
      }
    }

    assets.timers.cycleTimer.start();
    EventListener.addDirectionDetection(variables);
    EventListener.addVisibilityDetection(variables, assets);
    EventListener.addPauseDetection(variables, assets, ctx, onPauseChange);
    variables.start = false;
    assets.audioPlayer.ghostAudioWantsToPlay = true;
    variables.startTime = performance.now();

    // 🚀 Delay each ghost's movement based on `startDelay`
    const ghosts = Object.values(assets.characters.ghosts); // Convert to array

    ghosts.forEach((ghost: any, index: number) => {
      setTimeout(() => {
        ghost.released = true; // Enable movement after delay
      }, (index + 1) * 2000); // 2 seconds delay per ghost (adjust as needed)
    });
  }

  static implementPhysics(assets: any, ctx: CanvasRenderingContext2D, variables: any) {
    Physics.implementBoundaries(assets, ctx);
    Physics.implementPellets(assets, ctx, variables);
    Physics.implementPowerUps(assets, ctx, variables);
    Physics.implementGhosts(assets, ctx, variables);
    Physics.implementPacman(variables, assets, ctx);
  }

  static implementGraphics(variables: any, pacman: any) {
    const info = document.querySelector("#info") as HTMLCanvasElement;
    if (!info) return;
    const ctx = info.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, info.width, info.height);
    ctx.font = "20px microN56";
    ctx.textBaseline = "middle";
    Graphics.displayScore(ctx, variables);
    Graphics.displayLevel(ctx, variables);
    Graphics.displayLives(ctx, pacman);
  }

  static manageGhostAudio(assets: any) {
    if (assets.audioPlayer.ghostAudioWantsToPlay)
      AudioManager.playGhostAudio(assets);
  }
}
