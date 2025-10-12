"use client";

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

export default class Ghost {
  originalPosition: Position;
  position: Position;
  originalVelocity: Velocity;
  velocity: Velocity;
  tileLength: number;
  radius: number;
  colour: string;
  prevCollisions: any[];
  speed: number;
  isScared: boolean;
  isChasing: boolean;
  isRetreating: boolean;
  retreatingTimer: any;
  image: HTMLImageElement;
  up: HTMLImageElement;
  left: HTMLImageElement;
  right: HTMLImageElement;
  down: HTMLImageElement;
  scared: HTMLImageElement;
  eyesUp: HTMLImageElement;
  eyesLeft: HTMLImageElement;
  eyesRight: HTMLImageElement;
  eyesDown: HTMLImageElement;
  isResetting: boolean;
  resetTimeout: any;
  released: boolean;

  constructor({ position, velocity, colour }: { position: Position; velocity: Velocity; colour: string }, tileLength: number) {
    this.originalPosition = position;
    this.position = { ...this.originalPosition };
    this.originalVelocity = velocity;
    this.velocity = { ...this.originalVelocity };
    this.tileLength = tileLength;
    this.radius = (this.tileLength * 3) / 8;
    this.colour = colour;
    this.prevCollisions = [];
    this.speed = this.tileLength / 8;
    this.isScared = false;
    this.isChasing = false;
    this.isRetreating = false;
    this.retreatingTimer = null;
    this.isResetting = false; // Strict lock for preventing multiple resets
    this.resetTimeout = null;
    this.released = false;
    
    // Initialize image properties only on client side
    if (typeof window !== "undefined") {
      this.image = new window.Image();
      this.up = new window.Image();
      this.left = new window.Image();
      this.right = new window.Image();
      this.down = new window.Image();
      this.scared = new window.Image();
      this.eyesUp = new window.Image();
      this.eyesLeft = new window.Image();
      this.eyesRight = new window.Image();
      this.eyesDown = new window.Image();
      this.up.src = `/images/${this.colour}-ghost-up.png`;
      this.left.src = `/images/${this.colour}-ghost-left.png`;
      this.right.src = `/images/${this.colour}-ghost-right.png`;
      this.down.src = `/images/${this.colour}-ghost-down.png`;
      this.scared.src = `/images/scared-ghost-${this.colour}.png`;
      this.scared.onerror = () => {
        this.scared.src = `/images/scared-ghost-blue.png`;
      };
      
      // Add debugging for ghost images
      this.up.onload = () => console.log(`${this.colour} ghost up image loaded`);
      this.up.onerror = () => console.log(`${this.colour} ghost up image failed to load`);
      this.left.onload = () => console.log(`${this.colour} ghost left image loaded`);
      this.left.onerror = () => console.log(`${this.colour} ghost left image failed to load`);
      this.right.onload = () => console.log(`${this.colour} ghost right image loaded`);
      this.right.onerror = () => console.log(`${this.colour} ghost right image failed to load`);
      this.down.onload = () => console.log(`${this.colour} ghost down image loaded`);
      this.down.onerror = () => console.log(`${this.colour} ghost down image failed to load`);

      this.eyesUp.src = `/images/eyes-up.png`;
      this.eyesLeft.src = `/images/eyes-left.png`;
      this.eyesRight.src = `/images/eyes-right.png`;
      this.eyesDown.src = `/images/eyes-down.png`;
    } else {
      // Initialize with placeholder objects for SSR
      this.image = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
      this.up = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
      this.left = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
      this.right = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
      this.down = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
      this.scared = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
      this.eyesUp = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
      this.eyesLeft = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
      this.eyesRight = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
      this.eyesDown = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Check if image is loaded
    if (this.image && this.image.complete && this.image.naturalWidth > 0) {
      ctx.drawImage(
        this.image,
        this.position.x - this.radius * 2,
        this.position.y - this.radius * 2
      );
    } else {
      // Fallback: draw a simple colored circle
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      
      // Set color based on ghost state
      if (this.isScared && !this.isRetreating) {
        ctx.fillStyle = "#0000FF"; // Blue when scared
      } else if (this.isRetreating) {
        ctx.fillStyle = "#FFFFFF"; // White when retreating
      } else {
        // Regular ghost colors
        switch (this.colour) {
          case "red":
            ctx.fillStyle = "#FF0000";
            break;
          case "pink":
            ctx.fillStyle = "#FFB8FF";
            break;
          case "cyan":
            ctx.fillStyle = "#00FFFF";
            break;
          case "blue":
            ctx.fillStyle = "#0000FF";
            break;
          default:
            ctx.fillStyle = "#FF0000";
        }
      }
      
      // Draw ghost body
      ctx.beginPath();
      ctx.arc(0, -this.radius / 2, this.radius, Math.PI, 0, false);
      ctx.lineTo(this.radius, this.radius / 2);
      ctx.lineTo(this.radius / 2, this.radius);
      ctx.lineTo(-this.radius / 2, this.radius);
      ctx.lineTo(-this.radius, this.radius / 2);
      ctx.closePath();
      ctx.fill();
      
      // Draw eyes
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(-this.radius / 3, -this.radius / 3, this.radius / 6, 0, Math.PI * 2);
      ctx.arc(this.radius / 3, -this.radius / 3, this.radius / 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw pupils
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(-this.radius / 3, -this.radius / 3, this.radius / 12, 0, Math.PI * 2);
      ctx.arc(this.radius / 3, -this.radius / 3, this.radius / 12, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    }
  }

  update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  changeScaredState() {
    this.isScared = this.isScared ? false : true;
  }

  changeChasingState() {
    this.isChasing = this.isChasing ? false : true;
  }

  changeRetreatingState() {
    this.isRetreating = this.isRetreating ? false : true;
  }

  reset(index: number) {
    this.released = false; // Disable movement

    // Reset position and state
    this.position = { ...this.originalPosition };
    this.velocity = { x: 0, y: 0 };
    this.speed = this.tileLength / 8;
    this.prevCollisions = [];

    // Clear previous reset timeout
    if (this.resetTimeout) clearTimeout(this.resetTimeout);

    // 🚀 Apply delayed release
    const releaseDelay = Math.floor(Math.random() * (2500 - 500 + 1)) + 500;
    // Stagger release

    this.resetTimeout = setTimeout(() => {
      this.released = true;
      this.velocity = { ...this.originalVelocity };
      this.#resetStates();
      this.assignSprite();
    }, releaseDelay);
  }

  assignSprite() {
    if (this.isRetreating) this.#assignRetreatingSprite();
    else if (this.isScared) this.#assignScaredSprite();
    else this.#assignRegularSprite();
  }

  checkSpeedMatchesState() {
    if (this.isScared && this.speed === this.tileLength / 8) {
      this.adjustPosition();
      this.velocity.x /= 2;
      this.velocity.y /= 2;
      this.speed /= 2;
    } else if (this.isRetreating && this.speed === this.tileLength / 16) {
      this.adjustPosition();
      this.velocity.x *= 4;
      this.velocity.y *= 4;
      this.speed *= 4;
    } else if (!this.isScared && this.speed === this.tileLength / 16) {
      this.adjustPosition();
      this.velocity.x *= 2;
      this.velocity.y *= 2;
      this.speed *= 2;
    } else if (!this.isRetreating && this.speed === this.tileLength / 4) {
      this.adjustPosition();
      this.velocity.x /= 2;
      this.velocity.y /= 2;
      this.speed /= 2;
    }
  }

  adjustPosition() {
    if (this.isRetreating) this.shiftBeforeRetreating();
    else this.shiftRegular();
  }

  shiftBeforeRetreating() {
    if (this.velocity.x > 0) {
      this.shiftLeft();
    } else if (this.velocity.x < 0) {
      this.shiftRight();
    }
    if (this.velocity.y > 0) {
      this.shiftUp();
    } else if (this.velocity.y < 0) {
      this.shiftDown();
    }
  }

  shiftRegular() {
    if (this.position.x % 4 !== 0) this.position.x += 2;
    if (this.position.y % 4 !== 0) this.position.y += 2;
  }

  shiftLeft() {
    if (this.position.x % 8 === 2) this.position.x -= 2;
    else if (this.position.x % 8 === 4) this.position.x -= 4;
    else if (this.position.x % 8 === 6) this.position.x -= 6;
  }

  shiftRight() {
    if (this.position.x % 8 === 2) this.position.x += 6;
    else if (this.position.x % 8 === 4) this.position.x += 4;
    else if (this.position.x % 8 === 6) this.position.x += 2;
  }

  shiftUp() {
    if (this.position.y % 8 === 2) this.position.y -= 2;
    else if (this.position.y % 8 === 4) this.position.y -= 4;
    else if (this.position.y % 8 === 6) this.position.y -= 6;
  }

  shiftDown() {
    if (this.position.y % 8 === 2) this.position.y += 6;
    else if (this.position.y % 8 === 4) this.position.y += 4;
    else if (this.position.y % 8 === 6) this.position.y += 2;
  }

  #resetStates() {
    if (this.isScared) this.changeScaredState();
    if (this.isChasing) this.changeChasingState();
    this.retreatingTimer.reset();
    if (this.isRetreating) this.changeRetreatingState();
  }

  #assignRetreatingSprite() {
    if (this.velocity.y < 0) this.image = this.eyesUp;
    else if (this.velocity.x < 0) this.image = this.eyesLeft;
    else if (this.velocity.x > 0) this.image = this.eyesRight;
    else if (this.velocity.y > 0) this.image = this.eyesDown;
  }

  #assignScaredSprite() {
    this.image = this.scared;
  }

  #assignRegularSprite() {
    if (this.velocity.y < 0) this.image = this.up;
    else if (this.velocity.x < 0) this.image = this.left;
    else if (this.velocity.x > 0) this.image = this.right;
    else if (this.velocity.y > 0) this.image = this.down;
  }

}
