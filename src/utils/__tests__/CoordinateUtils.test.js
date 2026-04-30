import { describe, it, expect } from 'vitest';
import * as CoordinateUtils from '../CoordinateUtils.js';

describe('CoordinateUtils', () => {
  it('should detect large canvas', () => {
    expect(CoordinateUtils.isCanvasLarge(1001)).toBe(true);
    expect(CoordinateUtils.isCanvasLarge(500)).toBe(false);
  });

  it('should generate south starting point', () => {
    const y = CoordinateUtils.generateYSouth(10, 20, 1000);
    // minNum = 0 - 10 * 20 = -200
    // maxNum = 1000 * -1 * 4 = -4000
    expect(y).toBeLessThanOrEqual(-200);
    expect(y).toBeGreaterThanOrEqual(-4000);
  });
});
