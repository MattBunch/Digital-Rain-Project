// src/utils/CoordinateUtils.ts
import { generateRandomNumber, doubleInt } from './MathUtils.ts';
import { DIRECTIONS } from '../constants/matrix.ts';
import { ICoordinate } from '../types/index.ts';

export function canvasSetup(
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  defaultFontSize: number,
): { columns: number; rows: number } {
  const fontSize = defaultFontSize;
  ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";
  ctx.fillStyle = '#00FF41';

  canvas.width = width;
  canvas.height = height;
  const columns = canvas.width / fontSize;
  const rows = canvas.height / fontSize;

  // mirror the screen
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  return { columns, rows };
}

export function generateStartingPointInput(
  inputMin: number,
  inputMax: number,
  canvasHeight: number,
): number {
  if (canvasHeight > 1000) {
    inputMax = doubleInt(inputMax);
  }
  return generateRandomNumber(inputMin, inputMax);
}

export function generateXEast(canvasWidth: number, canvasHeight: number): number {
  const minNum = canvasWidth;
  const maxNum = canvasWidth + 1200;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateXWest(
  wordLength: number,
  inputFontSize: number,
  canvasWidth: number,
  canvasHeight: number,
): number {
  const minNum = 0 - (wordLength * inputFontSize + 20);
  const maxNum = canvasWidth * -1 * 1.5;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateYNorth(canvasHeight: number): number {
  const minNum = canvasHeight + 2;
  const maxNum = Math.round(canvasHeight + canvasHeight * 2 + canvasHeight * 0.7021);
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateYSouth(
  wordLength: number,
  inputFontSize: number,
  canvasHeight: number,
): number {
  const minNum = 0 - wordLength * inputFontSize;
  const maxNum = canvasHeight * -1 * 4;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function isCanvasLarge(canvasHeight: number): boolean {
  return canvasHeight > 1000;
}

export function calculateAverageStartingPosition(
  inputArray: ICoordinate[],
  inputDirection: string,
): number {
  let total = 0;
  let counter = 0;
  for (let i = 0; i < inputArray.length; i++) {
    if (inputDirection === DIRECTIONS.VERTICAL) {
      total += inputArray[i].y;
    } else if (inputDirection === DIRECTIONS.HORIZONTAL) {
      total += inputArray[i].x;
    }
    counter++;
  }
  return total / counter;
}
