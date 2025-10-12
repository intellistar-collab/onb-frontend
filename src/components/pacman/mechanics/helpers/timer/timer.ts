import CycleTimer from "../../../models/cycleTimer";
import ScaredTimer from "../../../models/scaredTimer";
import RetreatingTimer from "../../../models/retreatingTimer";

interface Timers {
  cycleTimer: CycleTimer;
  scaredTimer: ScaredTimer;
  retreatingTimers: RetreatingTimer[];
}

export default class Timer {
  static pauseTimers(timers: Timers) {
    if (timers.scaredTimer.isRunning) timers.scaredTimer.pause();
    else timers.cycleTimer.pause();
    timers.retreatingTimers.forEach((timer: RetreatingTimer) => {
      if (timer.isRunning) timer.pause();
    });
  }

  static resumeTimers(timers: Timers) {
    if (timers.scaredTimer.isRunning)
      timers.scaredTimer.resume(timers.cycleTimer);
    else timers.cycleTimer.resume();
    timers.retreatingTimers.forEach((timer: RetreatingTimer) => {
      if (timer.isRunning) timer.resume();
    });
  }
}
