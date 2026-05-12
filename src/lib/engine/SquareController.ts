export class SquareController {
  x1: number = 250;
  x2: number = 500;
  y1: number = 250;
  y2: number = 500;
  SQUARE_SIZE: number = 250;

  topEdge: number = 60;
  rightEdge: number = 60;
  bottomEdge: number = 0;
  leftEdge: number = 0;

  topEdgeDisco: number = 20;
  rightEdgeDisco: number = 20;
  bottomEdgeDisco: number = 0;
  leftEdgeDisco: number = 0;

  constructor() {}

  updateBoundaries(canvasWidth: number, canvasHeight: number): void {
    this.topEdge = 60;
    this.rightEdge = 60;
    this.bottomEdge = canvasHeight - 60;
    this.leftEdge = canvasWidth - 60;

    this.topEdgeDisco = 20;
    this.rightEdgeDisco = 20;
    this.bottomEdgeDisco = canvasHeight - 20;
    this.leftEdgeDisco = canvasWidth - 20;
  }

  generateRandomSquarePositions(canvasWidth: number, canvasHeight: number): void {
    this.x1 = Math.floor(Math.random() * (canvasWidth - this.SQUARE_SIZE));
    this.y1 = Math.floor(Math.random() * (canvasHeight - this.SQUARE_SIZE));
    this.x2 = this.x1 + this.SQUARE_SIZE;
    this.y2 = this.y1 + this.SQUARE_SIZE;
  }

  // Maintaining mirrored behavior for bug-compatibility
  moveLeft(movement: number, discoOn: boolean): void {
    const edge = discoOn ? this.leftEdgeDisco : this.leftEdge;
    if (this.x2 < edge) {
      this.x1 += movement;
      this.x2 += movement;
    }
  }

  moveRight(movement: number, discoOn: boolean): void {
    const edge = discoOn ? this.rightEdgeDisco : this.rightEdge;
    if (this.x1 > edge) {
      this.x1 -= movement;
      this.x2 -= movement;
    }
  }

  moveUp(movement: number, discoOn: boolean): void {
    const edge = discoOn ? this.topEdgeDisco : this.topEdge;
    if (this.y1 > edge) {
      this.y1 -= movement;
      this.y2 -= movement;
    }
  }

  moveDown(movement: number, discoOn: boolean): void {
    const edge = discoOn ? this.bottomEdgeDisco : this.bottomEdge;
    if (this.y2 < edge) {
      this.y1 += movement;
      this.y2 += movement;
    }
  }
}
