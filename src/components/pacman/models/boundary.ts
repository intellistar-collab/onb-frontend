interface Position {
  x: number;
  y: number;
}

export default class Boundary {
  position: Position;
  width: number;
  height: number;
  regularImage: HTMLImageElement;
  whiteImage: HTMLImageElement;
  image: HTMLImageElement;

  constructor({ position, regularImage, whiteImage }: { position: Position; regularImage: HTMLImageElement; whiteImage: HTMLImageElement }, tileLength: number) {
    this.position = position;
    this.width = tileLength;
    this.height = tileLength;
    this.regularImage = regularImage;
    this.whiteImage = whiteImage;
    this.image = regularImage;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }

  flash() {
    const imageSource = this.image.src;
    this.image = imageSource.includes("white")
      ? this.regularImage
      : this.whiteImage;
  }
}
