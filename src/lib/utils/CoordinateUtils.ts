// src/utils/CoordinateUtils.ts
import { generateRandomNumber, doubleInt } from './MathUtils.ts';
import { DIRECTIONS, ENGINE_CONSTANTS } from '../constants/matrix.ts';
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
  let adjustedMax = inputMax;
  if (canvasHeight > ENGINE_CONSTANTS.CANVAS_LARGE_THRESHOLD) {
    adjustedMax = doubleInt(inputMax);
  }
  return generateRandomNumber(inputMin, adjustedMax);
}

export function generateXEast(canvasWidth: number, canvasHeight: number): number {
  const minNum = canvasWidth;
  const maxNum = canvasWidth + ENGINE_CONSTANTS.MAX_X_EAST_OFFSET;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateXWest(
  wordLength: number,
  inputFontSize: number,
  canvasWidth: number,
  canvasHeight: number,
): number {
  const minNum = 0 - (wordLength * inputFontSize + ENGINE_CONSTANTS.X_WEST_OFFSET);
  const maxNum = canvasWidth * -1 * ENGINE_CONSTANTS.X_WEST_MULTIPLIER;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateYNorth(canvasHeight: number): number {
  const minNum = canvasHeight + ENGINE_CONSTANTS.Y_NORTH_OFFSET;
  const maxNum = Math.round(
    canvasHeight +
      canvasHeight * ENGINE_CONSTANTS.Y_NORTH_MULTIPLIER +
      canvasHeight * ENGINE_CONSTANTS.Y_NORTH_MYSTERY_CONSTANT,
  );
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateYSouth(
  wordLength: number,
  inputFontSize: number,
  canvasHeight: number,
): number {
  const minNum = 0 - wordLength * inputFontSize;
  const maxNum = canvasHeight * -1 * ENGINE_CONSTANTS.Y_SOUTH_MULTIPLIER;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function isCanvasLarge(canvasHeight: number): boolean {
  return canvasHeight > ENGINE_CONSTANTS.CANVAS_LARGE_THRESHOLD;
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
