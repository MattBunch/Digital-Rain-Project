// src/utils/CoordinateUtils.ts
import { generateRandomNumber, doubleInt } from './MathUtils.ts';
import { vertical, horizontal } from '../constants/Assets.ts';
import { ICoordinate } from '../types/index.ts';

export function canvasSetup(
  width: number,
  height: number,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  defaultFontSize: number
): { columns: number; rows: number } {
  let fontSize = defaultFontSize;
  ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";
  ctx.fillStyle = '#00FF41';

  canvas.width = width;
  canvas.height = height;
  let columns = canvas.width / fontSize;
  let rows = canvas.height / fontSize;

  // mirror the screen
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  return { columns, rows };
}

export function generateStartingPointInput(inputMin: number, inputMax: number, canvasHeight: number): number {
  if (canvasHeight > 1000) {
    inputMax = doubleInt(inputMax);
  }
  return generateRandomNumber(inputMin, inputMax);
}

export function generateXEast(canvasWidth: number, canvasHeight: number): number {
  let minNum = canvasWidth;
  let maxNum = canvasWidth + 1200;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateXWest(wordLength: number, inputFontSize: number, canvasWidth: number, canvasHeight: number): number {
  let minNum = 0 - (wordLength * inputFontSize + 20);
  let maxNum = canvasWidth * -1 * 1.5;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateYNorth(canvasHeight: number): number {
  let minNum = canvasHeight + 2;
  let maxNum = Math.round(
    canvasHeight + canvasHeight * 2 + canvasHeight * 0.7021,
  );
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateYSouth(wordLength: number, inputFontSize: number, canvasHeight: number): number {
  let minNum = 0 - wordLength * inputFontSize;
  let maxNum = canvasHeight * -1 * 4;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function isCanvasLarge(canvasHeight: number): boolean {
  return canvasHeight > 1000;
}

export function calculateAverageStartingPosition(inputArray: ICoordinate[], inputDirection: string): number {
  let total = 0;
  let counter = 0;
  for (let i = 0; i < inputArray.length; i++) {
    if (inputDirection === vertical) total += inputArray[i].y;
    else if (inputDirection === horizontal) total += inputArray[i].x;
    counter++;
  }
  return total / counter;
}

export function getMiddleElementOfArray<T>(inputArray: T[]): T {
  return inputArray[Math.round((inputArray.length - 1) / 2)];
}

export function getMiddleLevel<T>(inputArray: T[]): T {
  // Original JS was: return inputArray[getMiddleElementOfArray(inputArray)];
  // This looks like a bug in original code if inputArray is an array and getMiddleElementOfArray returns an element.
  // However, I'll stick to the logic for now but typed. 
  // If getMiddleElementOfArray returns an index (number), it works. Let's check getMiddleElementOfArray implementation above.
  // It returns an element. So inputArray[element] only works if element is a valid key.
  // Actually, getMiddleElementOfArray returns T. If T is number, it might work as index.
  // Let's look at the usage if possible. For now, I'll keep it as is to maintain behavior.
  return (inputArray as any)[getMiddleElementOfArray(inputArray) as any];
}
