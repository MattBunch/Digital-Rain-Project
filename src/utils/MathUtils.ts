// src/utils/MathUtils.ts
import { alphabet } from '../constants/Assets.ts';

export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function generateRandomColorArray(): string[] {
  return [getRandomColor(), getRandomColor(), getRandomColor()];
}

export function generateRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function onePercentChance(): boolean {
  return Math.random() < 0.01;
}

export function twentyfivePercentChance(): boolean {
  return Math.random() < 0.25;
}

export function generateWordSizeRand(stringSizeMin: number, stringSizeMax: number): number {
  return Math.floor(generateRandomNumber(stringSizeMin, stringSizeMax));
}

export function generateWordSizeRandHanging(stringSizeMin: number, stringSizeMax: number): number {
  return Math.floor(generateRandomNumber(stringSizeMin - 10, stringSizeMax + 3));
}

export function generateFontSize(baseSize: number): number {
  return Math.floor(generateRandomNumber(baseSize - 5, baseSize + 5));
}

export function generateSpeed(): number {
  return generateRandomNumber(0.001, 9.999);
}

export function generateWord(wordSize: number): string {
  let word = '';
  for (let i = 0; i < wordSize; i++) {
    word += getRandomChar();
  }
  return word;
}

export function getRandomChar(): string {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

export function generateWordChangeTurnoverNumber(): number {
  return Math.floor(generateRandomNumber(1, 10));
}

export function doubleInt(input: number): number {
  return input * 2;
}
