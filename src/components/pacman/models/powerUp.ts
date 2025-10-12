"use client";

interface Position {
  x: number;
  y: number;
}

export default class PowerUp {
  position: Position;
  radius: number;
  hasBeenEaten: boolean;
  rate: number;
  tileLength: number;
  image: HTMLImageElement;

  constructor({ position, imageSrc }: { position: Position; imageSrc: string }, tileLength: number) {
    this.position = position;
    this.radius = (tileLength * 7) / 20;
    this.hasBeenEaten = false;
    this.rate = -tileLength / 90;
    this.tileLength = tileLength;
    if (typeof window !== "undefined") {
      this.image = new window.Image();
      this.image.src = imageSrc;
    } else {
      // Initialize with placeholder object for SSR
      this.image = { complete: false, naturalWidth: 0, src: "" } as HTMLImageElement;
    }
  }

  changeEatenState() {
    this.hasBeenEaten = this.hasBeenEaten ? false : true;
  }

  update(ctx: CanvasRenderingContext2D) {
    this.draw(ctx);
    this.flash();
  }

  draw(ctx: CanvasRenderingContext2D) {
    const dynamicSize = this.radius * 4;

    ctx.drawImage(
      this.image,
      this.position.x - dynamicSize / 2,
      this.position.y - dynamicSize / 2,
      dynamicSize,
      dynamicSize
    );
  }

  flash() {
    if (
      this.radius <= this.tileLength / 4 ||
      this.radius >= (this.tileLength * 9) / 20
    ) {
      this.rate = -this.rate;
    }
    this.radius += this.rate;
  }
}
