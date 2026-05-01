// src/utils/math.ts

export function generateRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function onePercentChance(): boolean {
  return Math.random() < 0.01;
}

export function twentyfivePercentChance(): boolean {
  return Math.random() < 0.25;
}

export function getRandomChar(alphabet: string): string {
  return alphabet.charAt(Math.floor(Math.random() * alphabet.length));
}

export function getRandomHexColor(): string {
  let letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
