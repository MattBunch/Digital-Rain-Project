import { describe, it, expect, vi } from 'vitest';
import * as MathUtils from '../MathUtils';
import { alphabet } from '../../constants/Assets';

describe('MathUtils', () => {
  describe('getRandomColor', () => {
    it('should generate a valid hex color string', () => {
      const color = MathUtils.getRandomColor();
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });
  });

  describe('generateRandomColorArray', () => {
    it('should generate an array of 3 color strings', () => {
      const colors = MathUtils.generateRandomColorArray();
      expect(colors).toHaveLength(3);
      colors.forEach(color => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/);
      });
    });
  });

  describe('generateRandomNumber', () => {
    it('should return a number between min and max', () => {
      const min = 5;
      const max = 10;
      const result = MathUtils.generateRandomNumber(min, max);
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });

    it('should be deterministic with mocked Math.random', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      expect(MathUtils.generateRandomNumber(0, 10)).toBe(5);
      vi.restoreAllMocks();
    });
  });

  describe('onePercentChance', () => {
    it('should return true when Math.random is less than 0.01', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.005);
      expect(MathUtils.onePercentChance()).toBe(true);
      vi.restoreAllMocks();
    });

    it('should return false when Math.random is 0.01 or greater', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.01);
      expect(MathUtils.onePercentChance()).toBe(false);
      vi.restoreAllMocks();
    });
  });

  describe('twentyfivePercentChance', () => {
    it('should return true when Math.random is less than 0.25', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.24);
      expect(MathUtils.twentyfivePercentChance()).toBe(true);
      vi.restoreAllMocks();
    });

    it('should return false when Math.random is 0.25 or greater', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.25);
      expect(MathUtils.twentyfivePercentChance()).toBe(false);
      vi.restoreAllMocks();
    });
  });

  describe('generateWordSizeRand', () => {
    it('should return a floored random number in range', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.9);
      // Math.floor(0.9 * (20 - 10) + 10) = Math.floor(19) = 19
      expect(MathUtils.generateWordSizeRand(10, 20)).toBe(19);
      vi.restoreAllMocks();
    });
  });

  describe('generateWordSizeRandHanging', () => {
    it('should return a floored random number in modified range', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      // min = 10 - 10 = 0
      // max = 20 + 3 = 23
      // Math.floor(0.5 * (23 - 0) + 0) = Math.floor(11.5) = 11
      expect(MathUtils.generateWordSizeRandHanging(10, 20)).toBe(11);
      vi.restoreAllMocks();
    });
  });

  describe('generateFontSize', () => {
    it('should return a floored font size in range', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      // base = 20
      // min = 15, max = 25
      // Math.floor(0.5 * (25 - 15) + 15) = Math.floor(20) = 20
      expect(MathUtils.generateFontSize(20)).toBe(20);
      vi.restoreAllMocks();
    });
  });

  describe('generateSpeed', () => {
    it('should return a random number in speed range', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      // min = 0.001, max = 9.999
      // 0.5 * (9.999 - 0.001) + 0.001 = 0.5 * 9.998 + 0.001 = 4.999 + 0.001 = 5
      expect(MathUtils.generateSpeed()).toBeCloseTo(5);
      vi.restoreAllMocks();
    });
  });

  describe('getRandomChar', () => {
    it('should return a character from the alphabet', () => {
      const char = MathUtils.getRandomChar();
      expect(alphabet).toContain(char);
    });

    it('should return the correct character based on Math.random', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      expect(MathUtils.getRandomChar()).toBe(alphabet.charAt(0));
      
      vi.spyOn(Math, 'random').mockReturnValue(0.9999);
      expect(MathUtils.getRandomChar()).toBe(alphabet.charAt(alphabet.length - 1));
      
      vi.restoreAllMocks();
    });
  });

  describe('generateWord', () => {
    it('should generate a word of the specified length', () => {
      expect(MathUtils.generateWord(0)).toBe('');
      expect(MathUtils.generateWord(5).length).toBe(5);
    });

    it('should build word from getRandomChar', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const firstChar = alphabet.charAt(0);
      expect(MathUtils.generateWord(3)).toBe(firstChar + firstChar + firstChar);
      vi.restoreAllMocks();
    });
  });

  describe('generateWordChangeTurnoverNumber', () => {
    it('should return a floored number between 1 and 10', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      // Math.floor(0.5 * (10 - 1) + 1) = Math.floor(5.5) = 5
      expect(MathUtils.generateWordChangeTurnoverNumber()).toBe(5);
      vi.restoreAllMocks();
    });
  });

  describe('doubleInt', () => {
    it('should double the input number', () => {
      expect(MathUtils.doubleInt(5)).toBe(10);
      expect(MathUtils.doubleInt(-2)).toBe(-4);
    });
  });
});
