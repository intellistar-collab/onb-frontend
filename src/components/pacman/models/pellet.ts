interface Position {
  x: number;
  y: number;
}

export default class Pellet {
  position: Position;
  radius: number;
  hasBeenEaten: boolean;

  constructor({ position }: { position: Position }, tileLength: number) {
    this.position = position;
    this.radius = tileLength / 10;
    this.hasBeenEaten = false;
  }

  changeEatenState() {
    this.hasBeenEaten = this.hasBeenEaten ? false : true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  }
}
