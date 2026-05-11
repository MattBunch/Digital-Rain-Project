// src/models/MatrixString.ts
import {
  generateWord,
  getRandomChar,
  onePercentChance,
  generateWordChangeTurnoverNumber,
} from '../utils/MathUtils.ts';
import { colorWhite } from '../constants/Assets.ts';

export class CoordinateObject {
  xCoordinate: number;
  yCoordinate: number;

  constructor(xCoordinate: number, yCoordinate: number) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }
}

export interface IMatrixStringConfig {
  rapidWordChange: boolean;
  discoOn: boolean;
  direction: string;
}

export interface ISquareConfig {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  alternativeFontSize: number;
  returnAlternativeFadeCondition: (
    index: number,
    x: number,
    y: number,
    config: ISquareConfig,
    direction: string,
  ) => boolean;
  discoColorCounterCheck: (ctx: CanvasRenderingContext2D) => void;
  getRandomColor: () => string;
}

export class MatrixString {
  word: string;
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
  fontSize: number;
  wordChangeCounter: number;
  wordChangeCounterTurnoverPoint: number;
  XYCoordinates: CoordinateObject[];

  constructor(
    word: string,
    x: number,
    y: number,
    xSpeed: number,
    ySpeed: number,
    inputFontSize: number,
  ) {
    this.word = word;
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
    this.fontSize = inputFontSize;
    this.wordChangeCounter = 0;
    this.wordChangeCounterTurnoverPoint = generateWordChangeTurnoverNumber();
    this.XYCoordinates = this.generateXYCoordinates();
  }

  show(
    ctx: CanvasRenderingContext2D,
    inputColorArray: string[],
    config: IMatrixStringConfig,
    discoColorCounterCheck: (ctx: CanvasRenderingContext2D) => void,
  ): void {
    const { rapidWordChange, discoOn } = config;

    if (rapidWordChange) {
      this.word = generateWord(this.word.length);
    }

    if (discoOn) {
      discoColorCounterCheck(ctx);
    }

    for (let i = 0; i < this.word.length - 1; i++) {
      let letter = this.word.substring(i, i + 1);
      const xCoordinate = this.getXCoordinateFromDirection(i, config.direction, false);
      const yCoordinate = this.getYCoordinateFromDirection(i, config.direction, false);

      if (onePercentChance() && !rapidWordChange) {
        letter = getRandomChar();
      }

      if (!discoOn) {
        this.setColors(ctx, i, inputColorArray, config.direction);
      }

      ctx.fillText(letter, xCoordinate, yCoordinate);
    }
  }

  showAlternative(
    ctx: CanvasRenderingContext2D,
    inputColorArray: string[],
    config: IMatrixStringConfig,
    squareConfig: ISquareConfig,
  ): void {
    const { rapidWordChange } = config;

    if (rapidWordChange) {
      this.word = generateWord(this.word.length);
    }

    for (let i = 0; i < this.word.length; i++) {
      let letter = this.word.substring(i, i + 1);

      const xCoordinate = this.getXCoordinateFromDirection(i, config.direction, true);
      const yCoordinate = this.getYCoordinateFromDirection(i, config.direction, true);

      if (onePercentChance() && !rapidWordChange && i != 0) {
        letter = getRandomChar();
      }

      if (i == 0) {
        letter = ' ';
      }

      this.drawSquare(ctx, xCoordinate, yCoordinate, inputColorArray, config, squareConfig);

      ctx.fillText(letter, xCoordinate, yCoordinate);
    }
  }

  drawSquare(
    ctx: CanvasRenderingContext2D,
    xCoordinate: number,
    yCoordinate: number,
    inputColorArray: string[],
    config: IMatrixStringConfig,
    squareConfig: ISquareConfig,
  ): void {
    const { x1, x2, y1, y2 } = squareConfig;
    const { discoOn } = config;

    const primaryColorCondition =
      xCoordinate < x1 || xCoordinate > x2 || yCoordinate < y1 || yCoordinate > y2;

    const { returnAlternativeFadeCondition, discoColorCounterCheck, getRandomColor } = squareConfig;

    const alternativeFade1Condition = returnAlternativeFadeCondition(
      0,
      xCoordinate,
      yCoordinate,
      squareConfig,
      config.direction,
    );

    const alternativeFade2Condition = returnAlternativeFadeCondition(
      1,
      xCoordinate,
      yCoordinate,
      squareConfig,
      config.direction,
    );

    if (primaryColorCondition) {
      if (discoOn) {
        discoColorCounterCheck(ctx);
      } else if (alternativeFade1Condition) {
        ctx.fillStyle = inputColorArray[0];
      } else if (alternativeFade2Condition) {
        ctx.fillStyle = inputColorArray[1];
      } else {
        ctx.fillStyle = inputColorArray[2];
      }
    } else {
      if (discoOn) {
        ctx.fillStyle = getRandomColor();
      } else {
        ctx.fillStyle = colorWhite;
      }
    }
  }

  setColors(
    ctx: CanvasRenderingContext2D,
    i: number,
    inputColorArray: string[],
    direction: string,
  ): void {
    if (direction == 'south' || direction == 'west') {
      if (i == this.word.length - 2) {
        ctx.fillStyle = colorWhite;
      } else if (i == this.word.length - 3) {
        ctx.fillStyle = inputColorArray[0];
      } else if (i == this.word.length - 4) {
        ctx.fillStyle = inputColorArray[1];
      } else {
        ctx.fillStyle = inputColorArray[2];
      }
    } else if (direction == 'north' || direction == 'east') {
      if (i == 0) {
        ctx.fillStyle = colorWhite;
      } else if (i == 1) {
        ctx.fillStyle = inputColorArray[0];
      } else if (i == 2) {
        ctx.fillStyle = inputColorArray[1];
      } else {
        ctx.fillStyle = inputColorArray[2];
      }
    }
  }

  getYCoordinateFromDirection(i: number, direction: string, alternative: boolean): number {
    const defaultYCoordinate = this.y + i * this.fontSize;
    switch (direction) {
      case 'south':
        return defaultYCoordinate;
      case 'north':
        if (!alternative) {
          return defaultYCoordinate;
        }
        return this.y - i * this.fontSize;
      case 'east':
        return this.y;
      case 'west':
        return this.y;
      default:
        return defaultYCoordinate;
    }
  }

  getXCoordinateFromDirection(i: number, direction: string, alternative: boolean): number {
    const defaultXCoordinate = this.x + i * this.fontSize;
    switch (direction) {
      case 'south':
        return this.x;
      case 'north':
        return this.x;
      case 'east':
        return defaultXCoordinate;
      case 'west':
        if (!alternative) {
          return defaultXCoordinate;
        }
        return this.x - i * this.fontSize;
      default:
        return defaultXCoordinate;
    }
  }

  generateXYCoordinates(): CoordinateObject[] {
    const output = new Array<CoordinateObject>();
    for (let i = 0; i < this.word.length; i++) {
      const xCoordinate = this.x;
      const yCoordinate = this.y + i * this.fontSize;
      output.push(new CoordinateObject(xCoordinate, yCoordinate));
    }
    return output;
  }

  increaseStringSize(): void {
    this.word = this.word.concat(getRandomChar());
  }

  decreaseStringSize(): void {
    this.word = this.word.slice(0, -1);
  }
}
