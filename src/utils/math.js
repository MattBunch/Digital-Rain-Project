// src/utils/math.js

export function generateRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export function onePercentChance() {
  return Math.random() < 0.01;
}

export function twentyfivePercentChance() {
  return Math.random() < 0.25;
}

export function getRandomChar(alphabet) {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

export function getRandomHexColor() {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
