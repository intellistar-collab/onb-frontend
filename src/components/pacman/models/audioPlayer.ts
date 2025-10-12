import { Howl } from "howler";

export default class AudioPlayer {
  ghostSiren: Howl;
  ghostScared: Howl;
  ghostRetreating: Howl;
  ghostAudioWantsToPlay: boolean;
  pacmanDeath: Howl;
  levelUp: Howl;

  constructor(
    ghostSiren = new Howl({
      src: "/audio/siren.wav",
      loop: true,
      volume: 0.1,
    }),
    ghostScared = new Howl({
      src: "/audio/scared.wav",
      loop: true,
      volume: 0.08,
    }),
    ghostRetreating = new Howl({
      src: "/audio/retreating.wav",
      loop: true,
      volume: 0.1,
    }),
    pacmanDeath = new Howl({
      src: "/audio/pacman_death.wav",
      volume: 0.3,
    }),
    levelUp = new Howl({
      src: "/audio/level_up.wav",
      volume: 0.2,
    })
  ) {
    this.ghostSiren = ghostSiren;
    this.ghostScared = ghostScared;
    this.ghostRetreating = ghostRetreating;
    this.ghostAudioWantsToPlay = false;
    this.pacmanDeath = pacmanDeath;
    this.levelUp = levelUp;
  }

  playGhostSiren() {
    this.ghostScared.pause();
    this.ghostRetreating.pause();
    this.ghostSiren.play();
  }

  playGhostScared() {
    this.ghostSiren.pause();
    this.ghostRetreating.pause();
    this.ghostScared.play();
  }

  playGhostRetreating() {
    this.ghostSiren.pause();
    this.ghostScared.pause();
    this.ghostRetreating.play();
  }

  stopGhostAudio() {
    this.#pauseGhostAudio();
    this.ghostAudioWantsToPlay = false;
  }

  playPacmanDeath() {
    this.pacmanDeath.play();
  }

  playLevelUp() {
    this.levelUp.play();
  }

  playPacmanDeathAndLevelUpIfWantTo() {
    // This method is no longer needed since we removed wantsToPlay
    // Keeping for compatibility but it does nothing
  }

  pauseAll() {
    this.#pauseGhostAudio();
    this.pacmanDeath.pause();
    this.levelUp.pause();
  }

  #pauseGhostAudio() {
    this.ghostSiren.pause();
    this.ghostScared.pause();
    this.ghostRetreating.pause();
  }
}
