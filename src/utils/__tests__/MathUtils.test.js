import { describe, it, expect } from 'vitest';
import * as MathUtils from '../MathUtils.js';

describe('MathUtils', () => {
  it('should generate a valid hex color', () => {
    const color = MathUtils.getRandomColor();
    expect(color).toMatch(/^#[0-9A-F]{6}$/i);
  });

  it('should generate a valid random number in range', () => {
    const min = 10, max = 20;
    const num = MathUtils.generateRandomNumber(min, max);
    expect(num).toBeGreaterThanOrEqual(min);
    expect(num).toBeLessThanOrEqual(max);
  });

  it('should generate a word of correct size', () => {
    const size = 5;
    const word = MathUtils.generateWord(size);
    expect(word.length).toBe(size);
  });
});
