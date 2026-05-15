// src/utils/MathUtils.ts
import { ALPHABET } from '../constants/matrix.ts';

export function getRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  if (color.length !== 7) {
    console.error(`[MathUtils] getRandomColor generated invalid hex: "${color}"`);
    return '#00FF41'; // Emergency fallback
  }

  return color;
}

export function hexToRgb(hex: string): string {
  if (!hex || typeof hex !== 'string') {
    return '0, 255, 65'; // Fallback to matrix green
  }

  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Handle shorthand hex like #03F
  let r, g, b;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }

  return `${r}, ${g}, ${b}`;
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

export function generateWord(wordSize: number, alphabet?: string): string {
  let word = '';
  for (let i = 0; i < wordSize; i++) {
    word += getRandomChar(alphabet);
  }
  return word;
}

export function getRandomChar(alphabet: string = ALPHABET): string {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

export function generateWordChangeTurnoverNumber(): number {
  return Math.floor(generateRandomNumber(1, 10));
}

export function doubleInt(input: number): number {
  return input * 2;
}
