import { Howl } from "howler";

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

export default class PacMan {
  originalPosition: Position;
  position: Position;
  originalVelocity: Velocity;
  velocity: Velocity;
  tileLength: number;
  radius: number;
  speed: number;
  radians: number;
  openRate: number;
  shrinkRate: number;
  rotation: number;
  lives: number;
  isEating: boolean;
  isShrinking: boolean;
  isLevellingUp: boolean;
  munchOne: Howl;
  munchTwo: Howl;
  scale: number;
  frames: HTMLImageElement[];
  currentFrame: number;
  frameTick: number;

  constructor(
    { position, velocity }: { position: Position; velocity: Velocity },
    tileLength: number,
    munchOne = new Howl({
      src: "/audio/munch_one.wav",
      volume: 0.1,
    }),
    munchTwo = new Howl({
      src: "/audio/munch_two.wav",
      volume: 0.1,
    })
  ) {
    this.originalPosition = position;
    this.position = { ...this.originalPosition };
    this.originalVelocity = velocity;
    this.velocity = { ...this.originalVelocity };
    this.tileLength = tileLength;
    this.radius = (tileLength * 3) / 8;
    this.speed = tileLength / 8;
    this.radians = Math.PI / 4;
    this.openRate = Math.PI / 36;
    this.shrinkRate = Math.PI / 220;
    this.rotation = 0;
    this.lives = 2;
    this.isEating = false;
    this.isShrinking = false;
    this.isLevellingUp = false;
    this.munchOne = munchOne;
    this.munchTwo = munchTwo;
    this.scale = 1;
    this.frames = [];
    this.currentFrame = 0;
    this.frameTick = 0;
    
    if (typeof window !== "undefined") {
      this.frames = [new window.Image(), new window.Image()];
      this.frames[0].src = "/images/pacman_open.png";
      this.frames[1].src = "/images/pacman_closed.png";
      
      // Add load event listeners for debugging
      this.frames[0].onload = () => console.log("Pacman open image loaded");
      this.frames[0].onerror = () => console.log("Pacman open image failed to load");
      this.frames[1].onload = () => console.log("Pacman closed image loaded");
      this.frames[1].onerror = () => console.log("Pacman closed image failed to load");
    } else {
      // Initialize with placeholder objects for SSR
      this.frames = [
        { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement,
        { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement
      ];
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const img = this.frames[this.currentFrame];
    
    // Check if image is loaded
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.scale(this.scale, this.scale);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    } else {
      // Fallback: draw a simple yellow circle
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.scale(this.scale, this.scale);
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, this.radians, Math.PI * 2 - this.radians);
      ctx.lineTo(0, 0);
      ctx.fillStyle = "#FFDD00";
      ctx.fill();
      ctx.restore();
    }
  }

  update(ctx: CanvasRenderingContext2D) {
    this.frameTick++;
    if (this.frameTick % 10 === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }

    this.checkRotation();

    this.draw(ctx);

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.velocity.x !== 0 || this.velocity.y !== 0) {
      this.chomp();
    } else {
      this.radians = Math.PI / 4;
    }
  }

  chomp() {
    if (this.radians < Math.PI / 36 || this.radians > Math.PI / 4) {
      if (this.isEating) {
        if (this.openRate < 0) {
          this.munchOne.play();
        } else {
          this.munchTwo.play();
        }
      }
      this.openRate = -this.openRate;
    }
    this.radians += this.openRate;
  }

  checkRotation() {
    if (this.velocity.x > 0) this.rotation = 0;
    else if (this.velocity.x < 0) this.rotation = Math.PI;
    else if (this.velocity.y > 0) this.rotation = Math.PI / 2;
    else if (this.velocity.y < 0) this.rotation = (Math.PI * 3) / 2;
  }

  shrink(ctx: CanvasRenderingContext2D) {
    this.draw(ctx);
    this.radians += this.shrinkRate;
    this.scale -= this.shrinkRate;
    if (this.scale <= 0) {
      this.scale = 0;
      this.isShrinking = false;
    }
  }


  reset() {
    this.position = { ...this.originalPosition };
    this.velocity = { ...this.originalVelocity };
    this.radians = Math.PI / 4;
    this.openRate = Math.PI / 36;
    this.rotation = 0;
    this.scale = 1;
  }
}
