import AudioManager from "../audio/audioManager";
import Timer from "../timer/timer";
import Animator from "../graphics/animator/animator";

export default class EventListener {
  static addDirectionDetection(variables: any) {
    window.addEventListener(
      "keydown",
      (variables.directionEventListener = ({ key }: { key: string }) => {
        if (key === "ArrowUp") {
          variables.lastKeyPressed = "up";
        } else if (key === "ArrowLeft") {
          variables.lastKeyPressed = "left";
        } else if (key === "ArrowRight") {
          variables.lastKeyPressed = "right";
        } else if (key === "ArrowDown") {
          variables.lastKeyPressed = "down";
        }
      })
    );
  }

  static addVisibilityDetection(variables: any, assets: any) {
    window.addEventListener(
      "visibilitychange",
      (variables.visibilityEventListener = () => {
        if (!variables.isGamePaused && variables.isWindowVisible) {
          variables.isWindowVisible = false;
          AudioManager.pauseAudio(assets.audioPlayer);
          Timer.pauseTimers(assets.timers);
        } else if (!variables.isGamePaused && !variables.isWindowVisible) {
          variables.isWindowVisible = true;
          AudioManager.resumeAudio(assets.audioPlayer);
          Timer.resumeTimers(assets.timers);
        }
      })
    );
  }

  static addPauseDetection(variables: any, assets: any, ctx: CanvasRenderingContext2D, onPauseChange?: (paused: boolean) => void) {
    window.addEventListener(
      "keydown",
      (variables.pauseEventListener = ({ key }: { key: string }) => {
        if (key === "Escape") {
          if (!variables.isGamePaused) {
            variables.isGamePaused = true;
            cancelAnimationFrame(variables.animationId);
            AudioManager.pauseAudio(assets.audioPlayer);
            Timer.pauseTimers(assets.timers);
            Animator.loadPauseOverlay(ctx, assets.pauseTextImage);
          } else {
            variables.isGamePaused = false;
            AudioManager.resumeAudio(assets.audioPlayer);
            Timer.resumeTimers(assets.timers);
            Animator.resumeAnimation(variables, ctx, assets);
          }
          if (onPauseChange) onPauseChange(variables.isGamePaused);
        }
      })
    );
  }
}
