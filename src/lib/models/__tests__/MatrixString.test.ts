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

    it('should calculate correct X for southeast direction', () => {
      const x = matrixString.getXCoordinateFromDirection(1, 'southeast', false);
      expect(x).toBe(initialX - initialFontSize);
    });

    it('should calculate correct X for southwest direction', () => {
      const x = matrixString.getXCoordinateFromDirection(1, 'southwest', false);
      expect(x).toBe(initialX + initialFontSize);
    });

    it('should calculate correct X for northeast direction', () => {
      const x = matrixString.getXCoordinateFromDirection(1, 'northeast', false);
      expect(x).toBe(initialX + initialFontSize);
    });

    it('should calculate correct X for northwest direction', () => {
      const x = matrixString.getXCoordinateFromDirection(1, 'northwest', false);
      expect(x).toBe(initialX - initialFontSize);
    });

    it('should calculate correct Y for diagonal directions', () => {
      const directions = ['southeast', 'southwest', 'northeast', 'northwest'];
      directions.forEach((dir) => {
        const y = matrixString.getYCoordinateFromDirection(1, dir, false);
        expect(y).toBe(initialY + initialFontSize);
      });
    });

    it('should return base render coordinates when wave distortion is disabled', () => {
      const coords = matrixString.getRenderCoordinates(1, 'south', false, {
        waveDistortion: false,
      });
      expect(coords.xCoordinate).toBe(initialX);
      expect(coords.yCoordinate).toBe(initialY + initialFontSize);
    });

    it('should offset X for vertical directions when wave distortion is enabled', () => {
      const coords = matrixString.getRenderCoordinates(1, 'south', false, {
        waveDistortion: true,
      });
      expect(coords.xCoordinate).not.toBe(initialX);
      expect(coords.yCoordinate).toBe(initialY + initialFontSize);
    });

    it('should offset Y for horizontal directions when wave distortion is enabled', () => {
      const coords = matrixString.getRenderCoordinates(1, 'east', false, {
        waveDistortion: true,
      });
      expect(coords.xCoordinate).toBe(initialX + initialFontSize);
      expect(coords.yCoordinate).not.toBe(initialY);
    });

    it('should offset both axes for diagonal directions when wave distortion is enabled', () => {
      const coords = matrixString.getRenderCoordinates(1, 'southeast', false, {
        waveDistortion: true,
      });
      expect(coords.xCoordinate).not.toBe(initialX - initialFontSize);
      expect(coords.yCoordinate).not.toBe(initialY + initialFontSize);
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

    it('should respect colorOffset in setColors', () => {
      const ms = new MatrixString('ABCDE', 0, 0, 0, 0, 20);
      ms.colorOffset = 1;
      const inputColors = ['#111', '#222', '#333'];
      // For south, index word.length - 3 (index 2) should be inputColors[(0+1)%3] = inputColors[1]
      ms.show(mockCtx as CanvasRenderingContext2D, inputColors, config, discoCallback);

      // We need to capture the fillStyle at a specific point, but MatrixString.show calls setColors multiple times.
      // Let's test setColors directly for simplicity and precision.
      ms.setColors(mockCtx as CanvasRenderingContext2D, 2, inputColors, 'south');
      // In 'south', if i == word.length - 3 (5-3=2), it sets fillStyle to inputColors[(0+offset)%3]
      expect(mockCtx.fillStyle).toBe(inputColors[1]);
    });

    it('should set head color for diagonals', () => {
      const ms = new MatrixString('ABCDE', 0, 0, 0, 0, 20);
      const inputColors = ['#111', '#222', '#333'];
      const mockCtx = { fillStyle: '' } as unknown as CanvasRenderingContext2D;

      // southeast: head at length - 2 (index 3)
      ms.setColors(mockCtx, 3, inputColors, 'southeast');
      expect(mockCtx.fillStyle).toBe(COLORS.WHITE);

      // northwest: head at 0
      ms.setColors(mockCtx, 0, inputColors, 'northwest');
      expect(mockCtx.fillStyle).toBe(COLORS.WHITE);
    });

    it('should render with distorted coordinates when wave distortion is enabled', () => {
      const ms = new MatrixString('ABCDE', 100, 100, 0, 0, 20);
      ms.show(
        mockCtx as CanvasRenderingContext2D,
        colorArray,
        { ...config, waveDistortion: true },
        discoCallback,
      );

      const firstCall = vi.mocked(mockCtx.fillText).mock.calls[0];
      expect(firstCall[1]).not.toBe(100);
      expect(firstCall[2]).toBe(100);
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

    it('should render alternative mode with distorted coordinates when wave distortion is enabled', () => {
      const ms = new MatrixString('ABCDE', 100, 100, 0, 0, 20);
      ms.showAlternative(
        mockCtx as CanvasRenderingContext2D,
        colorArray,
        { ...config, waveDistortion: true },
        squareConfig,
      );

      const firstCall = vi.mocked(mockCtx.fillText).mock.calls[0];
      expect(firstCall[1]).not.toBe(100);
      expect(firstCall[2]).toBe(100);
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
