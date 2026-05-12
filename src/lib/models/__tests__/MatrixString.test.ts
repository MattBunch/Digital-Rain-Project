import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MatrixString } from '../MatrixString';
import { COLORS } from '../../constants/matrix';

describe('MatrixString', () => {
  let matrixString: MatrixString;
  const initialWord = 'TEST';
  const initialX = 100;
  const initialY = 100;
  const initialXSpeed = 2;
  const initialYSpeed = 5;
  const initialFontSize = 20;

  beforeEach(() => {
    matrixString = new MatrixString(
      initialWord,
      initialX,
      initialY,
      initialXSpeed,
      initialYSpeed,
      initialFontSize,
    );
  });

  it('should initialize correctly', () => {
    expect(matrixString.word).toBe(initialWord);
    expect(matrixString.x).toBe(initialX);
    expect(matrixString.y).toBe(initialY);
    expect(matrixString.xSpeed).toBe(initialXSpeed);
    expect(matrixString.ySpeed).toBe(initialYSpeed);
    expect(matrixString.fontSize).toBe(initialFontSize);
    expect(matrixString.XYCoordinates.length).toBe(initialWord.length);
  });

  it('should increase string size', () => {
    const originalLength = matrixString.word.length;
    matrixString.increaseStringSize();
    expect(matrixString.word.length).toBe(originalLength + 1);
  });

  it('should decrease string size', () => {
    const originalLength = matrixString.word.length;
    matrixString.decreaseStringSize();
    expect(matrixString.word.length).toBe(originalLength - 1);
  });

  describe('Coordinate calculation', () => {
    it('should calculate correct Y for south direction', () => {
      const y = matrixString.getYCoordinateFromDirection(1, 'south', false);
      expect(y).toBe(initialY + initialFontSize);
    });

    it('should calculate correct Y for north direction (alternative)', () => {
      const y = matrixString.getYCoordinateFromDirection(1, 'north', true);
      expect(y).toBe(initialY - initialFontSize);
    });

    it('should calculate correct X for east direction', () => {
      const x = matrixString.getXCoordinateFromDirection(1, 'east', false);
      expect(x).toBe(initialX + initialFontSize);
    });

    it('should calculate correct X for west direction (alternative)', () => {
      const x = matrixString.getXCoordinateFromDirection(1, 'west', true);
      expect(x).toBe(initialX - initialFontSize);
    });
  });

  describe('Rendering (show)', () => {
    let mockCtx: Partial<CanvasRenderingContext2D>;
    const colorArray = ['#111', '#222', '#333'];
    const config = { rapidWordChange: false, discoOn: false, direction: 'south' };
    const discoCallback = vi.fn();

    beforeEach(() => {
      mockCtx = {
        fillText: vi.fn(),
        fillStyle: '',
      };
    });

    it('should call fillText for each character except last one in show()', () => {
      matrixString.show(mockCtx as CanvasRenderingContext2D, colorArray, config, discoCallback);
      // show() iterates word.length - 1
      expect(mockCtx.fillText).toHaveBeenCalledTimes(initialWord.length - 1);
    });

    it('should set fillStyle to WHITE for head in south direction', () => {
      // In south, head is at index word.length - 2
      const word = 'ABCDE'; // length 5
      const ms = new MatrixString(word, 0, 0, 0, 0, 20);
      ms.show(mockCtx as CanvasRenderingContext2D, colorArray, config, discoCallback);

      expect(mockCtx.fillStyle).toBe(COLORS.WHITE);
    });
  });

  describe('showAlternative', () => {
    let mockCtx: Partial<CanvasRenderingContext2D>;
    const colorArray = ['#111', '#222', '#333'];
    const config = { rapidWordChange: false, discoOn: false, direction: 'south' };
    const squareConfig = {
      x1: 10,
      x2: 50,
      y1: 10,
      y2: 50,
      alternativeFontSize: 20,
      returnAlternativeFadeCondition: vi.fn().mockReturnValue(false),
      discoColorCounterCheck: vi.fn(),
      getRandomColor: vi.fn().mockReturnValue('#fff'),
    };

    beforeEach(() => {
      mockCtx = {
        fillText: vi.fn(),
        fillStyle: '',
      };
    });

    it('should call fillText for each character', () => {
      matrixString.showAlternative(
        mockCtx as CanvasRenderingContext2D,
        colorArray,
        config,
        squareConfig,
      );
      expect(mockCtx.fillText).toHaveBeenCalledTimes(initialWord.length);
    });

    it('should call returnAlternativeFadeCondition', () => {
      matrixString.showAlternative(
        mockCtx as CanvasRenderingContext2D,
        colorArray,
        config,
        squareConfig,
      );
      expect(squareConfig.returnAlternativeFadeCondition).toHaveBeenCalled();
    });
  });

  describe('generateXYCoordinates', () => {
    it('should generate an array of coordinates', () => {
      const coords = matrixString.generateXYCoordinates();
      expect(coords.length).toBe(initialWord.length);
      expect(coords[0]).toHaveProperty('xCoordinate');
      expect(coords[0]).toHaveProperty('yCoordinate');
    });
  });
});
