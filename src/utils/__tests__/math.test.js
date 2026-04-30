import { describe, it, expect } from 'vitest';
import { generateRandomNumber } from '../math.js';

describe('generateRandomNumber', () => {
  it('should return a number between min and max', () => {
    const min = 10;
    const max = 20;
    const result = generateRandomNumber(min, max);
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  });

  it('should handle negative ranges', () => {
    const min = -10;
    const max = -5;
    const result = generateRandomNumber(min, max);
    expect(result).toBeLessThanOrEqual(-5);
    expect(result).toBeGreaterThanOrEqual(-10);
  });
});
