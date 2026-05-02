import { describe, it, expect, vi } from 'vitest';
import * as CoordinateUtils from '../CoordinateUtils';
import { vertical, horizontal } from '../../constants/Assets';

describe('CoordinateUtils', () => {
  describe('isCanvasLarge', () => {
    it('should return true if height > 1000', () => {
      expect(CoordinateUtils.isCanvasLarge(1001)).toBe(true);
    });

    it('should return false if height <= 1000', () => {
      expect(CoordinateUtils.isCanvasLarge(1000)).toBe(false);
      expect(CoordinateUtils.isCanvasLarge(500)).toBe(false);
    });
  });

  describe('generateStartingPointInput', () => {
    it('should use doubleInt for max if canvas is large', () => {
      // Mocking Math.random to 1 to test max boundary
      vi.spyOn(Math, 'random').mockReturnValue(1);
      const min = 10,
        max = 20,
        height = 1500;
      // doubleInt(20) = 40. range = 40 - 10 = 30. result = 1 * 30 + 10 = 40.
      expect(CoordinateUtils.generateStartingPointInput(min, max, height)).toBe(40);
      vi.restoreAllMocks();
    });

    it('should not use doubleInt for max if canvas is small', () => {
      vi.spyOn(Math, 'random').mockReturnValue(1);
      const min = 10,
        max = 20,
        height = 500;
      // range = 20 - 10 = 10. result = 1 * 10 + 10 = 20.
      expect(CoordinateUtils.generateStartingPointInput(min, max, height)).toBe(20);
      vi.restoreAllMocks();
    });
  });

  describe('generateXEast', () => {
    it('should generate X coordinate east of canvas', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const width = 1000,
        height = 500;
      // minNum = 1000, maxNum = 2200. range = 1200. 0.5 * 1200 + 1000 = 1600
      expect(CoordinateUtils.generateXEast(width, height)).toBe(1600);
      vi.restoreAllMocks();
    });
  });

  describe('generateXWest', () => {
    it('should generate X coordinate west of canvas', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const wordLength = 10,
        fontSize = 20,
        width = 1000,
        height = 500;
      // minNum = 0 - (10 * 20 + 20) = -220
      // maxNum = 1000 * -1 * 1.5 = -1500
      // range = -1500 - (-220) = -1280. 0.5 * -1280 + (-220) = -640 - 220 = -860
      expect(CoordinateUtils.generateXWest(wordLength, fontSize, width, height)).toBe(-860);
      vi.restoreAllMocks();
    });
  });

  describe('generateYNorth', () => {
    it('should generate Y coordinate north of canvas', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const height = 1000;
      // minNum = 1002
      // maxNum = Math.round(1000 + 2000 + 702.1) = 3702
      // range = 2700. 0.5 * 2700 + 1002 = 1350 + 1002 = 2352
      expect(CoordinateUtils.generateYNorth(height)).toBe(2352);
      vi.restoreAllMocks();
    });
  });

  describe('generateYSouth', () => {
    it('should generate Y coordinate south of canvas', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const wordLength = 10,
        fontSize = 20,
        height = 1000;
      // minNum = 0 - 10 * 20 = -200
      // maxNum = 1000 * -1 * 4 = -4000
      // range = -4000 - (-200) = -3800. 0.5 * -3800 + (-200) = -1900 - 200 = -2100
      expect(CoordinateUtils.generateYSouth(wordLength, fontSize, height)).toBe(-2100);
      vi.restoreAllMocks();
    });
  });

  describe('calculateAverageStartingPosition', () => {
    const coords = [
      { x: 10, y: 20 },
      { x: 30, y: 40 },
    ];

    it('should calculate average Y for vertical direction', () => {
      expect(CoordinateUtils.calculateAverageStartingPosition(coords, vertical)).toBe(30);
    });

    it('should calculate average X for horizontal direction', () => {
      expect(CoordinateUtils.calculateAverageStartingPosition(coords, horizontal)).toBe(20);
    });

    it('should return 0/NaN for unknown direction or empty array', () => {
      expect(CoordinateUtils.calculateAverageStartingPosition([], vertical)).toBeNaN();
      expect(CoordinateUtils.calculateAverageStartingPosition(coords, 'unknown')).toBe(0);
    });
  });

  describe('getMiddleElementOfArray', () => {
    it('should return the middle element', () => {
      expect(CoordinateUtils.getMiddleElementOfArray([1, 2, 3])).toBe(2);
      expect(CoordinateUtils.getMiddleElementOfArray([1, 2, 3, 4])).toBe(3);
    });
  });

  describe('getMiddleLevel', () => {
    it('should return element at index of middle element (original logic)', () => {
      const arr = [2, 0, 1];
      expect(CoordinateUtils.getMiddleLevel(arr)).toBe(2);
    });
  });

  describe('canvasSetup', () => {
    it('should set up canvas context and return dimensions', () => {
      const mockCanvas = { width: 0, height: 0 } as HTMLCanvasElement;
      const mockCtx = {
        font: '',
        fillStyle: '',
        translate: vi.fn(),
        scale: vi.fn(),
      } as unknown as CanvasRenderingContext2D;
      const dims = CoordinateUtils.canvasSetup(1000, 1000, mockCanvas, mockCtx, 20);
      expect(dims.columns).toBe(50);
      expect(dims.rows).toBe(50);
      expect(mockCanvas.width).toBe(1000);
      expect(mockCanvas.height).toBe(1000);
      expect(mockCtx.translate).toHaveBeenCalledWith(1000, 0);
      expect(mockCtx.scale).toHaveBeenCalledWith(-1, 1);
    });
  });
});
