// src/models/MatrixString.ts
import {
  generateWord,
  getRandomChar,
  onePercentChance,
  generateWordChangeTurnoverNumber,
} from '../utils/MathUtils.ts';
import { COLORS } from '../constants/matrix.ts';
import type { IMatrixStringConfig, IMouseInteractionState, ISquareConfig } from '../types/index';

const WAVE_AMPLITUDE_FONT_SIZE_MULTIPLIER = 0.35;
const WAVE_POSITION_FREQUENCY = 0.08;
const WAVE_CHARACTER_FREQUENCY = 0.7;
const DIAGONAL_WAVE_MULTIPLIER = 0.5;
const MOUSE_INTERACTION_RADIUS = 180;
const MOUSE_INTERACTION_MAX_OFFSET = 80;

export class CoordinateObject {
  xCoordinate: number;
  yCoordinate: number;

  constructor(xCoordinate: number, yCoordinate: number) {
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
  }
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
  colorOffset: number = 0;
  private currentAlphabet: string | undefined;

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
    const { rapidWordChange, discoOn, alphabet } = config;
    this.currentAlphabet = alphabet;

    if (rapidWordChange) {
      this.word = generateWord(this.word.length, alphabet);
    }

    if (discoOn) {
      discoColorCounterCheck(ctx);
    }

    for (let i = 0; i < this.word.length - 1; i++) {
      let letter = this.word.substring(i, i + 1);
      const { xCoordinate, yCoordinate } = this.getRenderCoordinates(i, config.direction, false, {
        waveDistortion: config.waveDistortion,
        mouseInteraction: config.mouseInteraction,
      });

      if (onePercentChance() && !rapidWordChange) {
        letter = getRandomChar(alphabet);
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
    const { rapidWordChange, alphabet } = config;
    this.currentAlphabet = alphabet;

    if (rapidWordChange) {
      this.word = generateWord(this.word.length, alphabet);
    }

    for (let i = 0; i < this.word.length; i++) {
      let letter = this.word.substring(i, i + 1);

      const { xCoordinate, yCoordinate } = this.getRenderCoordinates(i, config.direction, true, {
        waveDistortion: config.waveDistortion,
        mouseInteraction: config.mouseInteraction,
      });

      if (onePercentChance() && !rapidWordChange && i != 0) {
        letter = getRandomChar(alphabet);
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
        ctx.fillStyle = inputColorArray[(0 + this.colorOffset) % 3];
      } else if (alternativeFade2Condition) {
        ctx.fillStyle = inputColorArray[(1 + this.colorOffset) % 3];
      } else {
        ctx.fillStyle = inputColorArray[(2 + this.colorOffset) % 3];
      }
    } else {
      if (discoOn) {
        ctx.fillStyle = getRandomColor();
      } else {
        ctx.fillStyle = COLORS.WHITE;
      }
    }
  }

  setColors(
    ctx: CanvasRenderingContext2D,
    i: number,
    inputColorArray: string[],
    direction: string,
  ): void {
    if (
      direction == 'south' ||
      direction == 'west' ||
      direction == 'southeast' ||
      direction == 'southwest'
    ) {
      if (i == this.word.length - 2) {
        ctx.fillStyle = COLORS.WHITE;
      } else if (i == this.word.length - 3) {
        ctx.fillStyle = inputColorArray[(0 + this.colorOffset) % 3];
      } else if (i == this.word.length - 4) {
        ctx.fillStyle = inputColorArray[(1 + this.colorOffset) % 3];
      } else {
        ctx.fillStyle = inputColorArray[(2 + this.colorOffset) % 3];
      }
    } else if (
      direction == 'north' ||
      direction == 'east' ||
      direction == 'northeast' ||
      direction == 'northwest'
    ) {
      if (i == 0) {
        ctx.fillStyle = COLORS.WHITE;
      } else if (i == 1) {
        ctx.fillStyle = inputColorArray[(0 + this.colorOffset) % 3];
      } else if (i == 2) {
        ctx.fillStyle = inputColorArray[(1 + this.colorOffset) % 3];
      } else {
        ctx.fillStyle = inputColorArray[(2 + this.colorOffset) % 3];
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
      case 'southeast':
      case 'southwest':
      case 'northeast':
      case 'northwest':
        return defaultYCoordinate;
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
      case 'southeast':
        return this.x - i * this.fontSize;
      case 'southwest':
        return defaultXCoordinate;
      case 'northeast':
        return defaultXCoordinate;
      case 'northwest':
        return this.x - i * this.fontSize;
      default:
        return defaultXCoordinate;
    }
  }

  getRenderCoordinates(
    i: number,
    direction: string,
    alternative: boolean,
    config: Pick<IMatrixStringConfig, 'waveDistortion' | 'mouseInteraction'> = {},
  ): CoordinateObject {
    const xCoordinate = this.getXCoordinateFromDirection(i, direction, alternative);
    const yCoordinate = this.getYCoordinateFromDirection(i, direction, alternative);
    let renderCoordinates = new CoordinateObject(xCoordinate, yCoordinate);

    if (config.waveDistortion) {
      const waveOffset = this.getWaveOffset(i, direction);

      if (this.isVerticalDirection(direction)) {
        renderCoordinates = new CoordinateObject(xCoordinate + waveOffset, yCoordinate);
      } else if (this.isHorizontalDirection(direction)) {
        renderCoordinates = new CoordinateObject(xCoordinate, yCoordinate + waveOffset);
      } else {
        renderCoordinates = new CoordinateObject(
          xCoordinate + waveOffset * DIAGONAL_WAVE_MULTIPLIER,
          yCoordinate - waveOffset * DIAGONAL_WAVE_MULTIPLIER,
        );
      }
    }

    return this.applyMouseInteraction(renderCoordinates, config.mouseInteraction);
  }

  private applyMouseInteraction(
    coordinates: CoordinateObject,
    mouseInteraction?: IMouseInteractionState,
  ): CoordinateObject {
    if (
      !mouseInteraction?.active ||
      mouseInteraction.mode === 'off' ||
      !Number.isFinite(mouseInteraction.x) ||
      !Number.isFinite(mouseInteraction.y)
    ) {
      return coordinates;
    }

    const deltaX = coordinates.xCoordinate - mouseInteraction.x;
    const deltaY = coordinates.yCoordinate - mouseInteraction.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance <= 0 || distance >= MOUSE_INTERACTION_RADIUS) {
      return coordinates;
    }

    const falloff = 1 - distance / MOUSE_INTERACTION_RADIUS;
    const rawOffset = MOUSE_INTERACTION_MAX_OFFSET * falloff * falloff;
    const offset = mouseInteraction.mode === 'attract' ? Math.min(rawOffset, distance) : rawOffset;
    const directionMultiplier = mouseInteraction.mode === 'repel' ? 1 : -1;
    const normalizedX = deltaX / distance;
    const normalizedY = deltaY / distance;

    return new CoordinateObject(
      coordinates.xCoordinate + normalizedX * offset * directionMultiplier,
      coordinates.yCoordinate + normalizedY * offset * directionMultiplier,
    );
  }

  private getWaveOffset(i: number, direction: string): number {
    const travelPosition = this.isHorizontalDirection(direction) ? this.x : this.y;
    const phase = travelPosition * WAVE_POSITION_FREQUENCY + i * WAVE_CHARACTER_FREQUENCY;
    return Math.sin(phase) * this.fontSize * WAVE_AMPLITUDE_FONT_SIZE_MULTIPLIER;
  }

  private isVerticalDirection(direction: string): boolean {
    return direction === 'north' || direction === 'south';
  }

  private isHorizontalDirection(direction: string): boolean {
    return direction === 'east' || direction === 'west';
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
    this.word = this.word.concat(getRandomChar(this.currentAlphabet));
  }

  decreaseStringSize(): void {
    this.word = this.word.slice(0, -1);
  }
}
