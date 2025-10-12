import Ghost from "./ghost";

export default class CycleTimer {
  timeout: NodeJS.Timeout | null;
  ghosts: Ghost[];
  count: number;
  startTime: number | null;
  timeRemaining: number | null;
  isRunning: boolean;

  constructor(ghosts: Ghost[]) {
    this.timeout = null;
    this.ghosts = ghosts;
    this.count = 0;
    this.startTime = null;
    this.timeRemaining = null;
    this.isRunning = false;
  }

  start(dateNow = Date.now()) {
    this.startTime = dateNow;
    this.timeout = setTimeout(
      () => {
        this.#switchChaseScatterState();
      },
      this.count === 0 ? 7000 : 20000
    );
    if (this.count === 0) {
      this.count++;
      this.timeRemaining = 7000;
    } else {
      this.count--;
      this.timeRemaining = 20000;
    }
    this.isRunning = true;
  }

  pause(dateNow = Date.now()) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    const timeElapsed = dateNow - (this.startTime || 0);
    this.timeRemaining = (this.timeRemaining || 0) - timeElapsed;
    this.isRunning = false;
  }

  resume(dateNow = Date.now()) {
    this.startTime = dateNow;
    this.timeout = setTimeout(() => {
      this.#switchChaseScatterState();
    }, this.timeRemaining || 0);
    this.isRunning = true;
  }

  reset() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.count = 0;
    this.isRunning = false;
  }

  #switchChaseScatterState() {
    this.ghosts.forEach((ghost) => {
      ghost.changeChasingState();
    });
    this.#carryOnCycle();
  }

  #carryOnCycle() {
    this.start();
  }
}
