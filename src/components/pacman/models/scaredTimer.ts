import Ghost from "./ghost";
import CycleTimer from "./cycleTimer";

export default class ScaredTimer {
  timeout: NodeJS.Timeout | null;
  ghosts: Ghost[];
  startTime: number | null;
  timeRemaining: number | null;
  isRunning: boolean;
  duration: number;

  constructor(ghosts: Ghost[]) {
    this.timeout = null;
    this.ghosts = ghosts;
    this.startTime = null;
    this.timeRemaining = null;
    this.isRunning = false;
    this.duration = 7000;
  }

  start(cycleTimer: CycleTimer, dateNow = Date.now()) {
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      this.ghosts.forEach((ghost: Ghost) => {
        if (ghost.isScared) {
          ghost.changeScaredState();
          ghost.assignSprite();
          ghost.checkSpeedMatchesState();
        }
      });
      cycleTimer.resume();
      this.isRunning = false;
    }, this.duration);
    this.timeRemaining = this.duration;
    this.isRunning = true;
  }

  pause(dateNow = Date.now()) {
    clearTimeout(this.timeout!);
    const timeElapsed = dateNow - this.startTime!;
    this.timeRemaining = this.timeRemaining! - timeElapsed;
  }

  resume(cycleTimer: CycleTimer, dateNow = Date.now()) {
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      this.ghosts.forEach((ghost: Ghost) => {
        if (ghost.isScared) {
          ghost.changeScaredState();
          ghost.assignSprite();
          ghost.checkSpeedMatchesState();
        }
      });
      cycleTimer.resume();
      this.isRunning = false;
    }, this.timeRemaining!);
  }

  reset() {
    clearTimeout(this.timeout!);
    this.isRunning = false;
  }
}
