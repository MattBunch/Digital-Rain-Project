// src/utils/CoordinateUtils.js
import { generateRandomNumber, doubleInt } from './MathUtils.js';
import { vertical, horizontal } from '../constants/Assets.js';

export function canvasSetup(width, height, canvas, ctx, defaultFontSize) {
  let fontSize = defaultFontSize;
  ctx.font = fontSize + "px 'Consolas', 'Lucida Console'";
  ctx.fillStyle = '#00FF41';

  ctx.canvas.width = width;
  ctx.canvas.height = height;
  let columns = canvas.width / fontSize;
  let rows = canvas.height / fontSize;

  // mirror the screen
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  return { columns, rows };
}

export function generateStartingPointInput(inputMin, inputMax, canvasHeight) {
  if (canvasHeight > 1000) {
    inputMax = doubleInt(inputMax);
  }
  return generateRandomNumber(inputMin, inputMax);
}

export function generateXEast(canvasWidth, canvasHeight) {
  let minNum = canvasWidth;
  let maxNum = canvasWidth + 1200;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateXWest(wordLength, inputFontSize, canvasWidth, canvasHeight) {
  let minNum = 0 - (wordLength * inputFontSize + 20);
  let maxNum = canvasWidth * -1 * 1.5;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateYNorth(canvasHeight) {
  let minNum = canvasHeight + 2;
  let maxNum = Math.round(
    canvasHeight + canvasHeight * 2 + canvasHeight * 0.7021,
  );
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function generateYSouth(wordLength, inputFontSize, canvasHeight) {
  let minNum = 0 - wordLength * inputFontSize;
  let maxNum = canvasHeight * -1 * 4;
  return generateStartingPointInput(minNum, maxNum, canvasHeight);
}

export function isCanvasLarge(canvasHeight) {
  return canvasHeight > 1000;
}

export function calculateAverageStartingPosition(inputArray, inputDirection) {
  let total = 0;
  let counter = 0;
  for (let i = 0; i < inputArray.length; i++) {
    if (inputDirection === vertical) total += inputArray[i].y;
    else if (inputDirection === horizontal) total += inputArray[i].x;
    counter++;
  }
  return total / counter;
}

export function getMiddleElementOfArray(inputArray) {
  return inputArray[Math.round((inputArray.length - 1) / 2)];
}

export function getMiddleLevel(inputArray) {
  return inputArray[getMiddleElementOfArray(inputArray)];
}
