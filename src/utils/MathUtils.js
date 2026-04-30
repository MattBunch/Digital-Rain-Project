// src/utils/MathUtils.js
import { alphabet } from '../constants/Assets.js';

export function getRandomColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function generateRandomColorArray() {
  return [getRandomColor(), getRandomColor(), getRandomColor()];
}

export function generateRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export function onePercentChance() {
  return Math.random() < 0.01;
}

export function twentyfivePercentChance() {
  return Math.random() < 0.25;
}

export function generateWordSizeRand(stringSizeMin, stringSizeMax) {
  return Math.floor(generateRandomNumber(stringSizeMin, stringSizeMax));
}

export function generateWordSizeRandHanging(stringSizeMin, stringSizeMax) {
  return Math.floor(
    generateRandomNumber(stringSizeMin - 10, stringSizeMax + 3),
  );
}

export function generateFontSize(baseSize) {
  return Math.floor(generateRandomNumber(baseSize - 5, baseSize + 5));
}

export function generateSpeed() {
  return generateRandomNumber(0.001, 9.999);
}

export function generateWord(wordSize) {
  let word = '';
  for (let i = 0; i < wordSize; i++) {
    word += getRandomChar();
  }
  return word;
}

export function getRandomChar() {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

export function generateWordChangeTurnoverNumber() {
  return Math.floor(generateRandomNumber(1, 10));
}

export function doubleInt(input) {
  return input * 2;
}
