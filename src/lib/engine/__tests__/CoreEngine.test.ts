import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { CoreEngine } from '../CoreEngine';

describe('CoreEngine', () => {
  let engine: CoreEngine;
  let mockCanvas: Partial<HTMLCanvasElement>;
  let mockCtx: Partial<CanvasRenderingContext2D>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn().mockImplementation((cb) => setTimeout(() => cb(performance.now()), 16)),
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn().mockImplementation((id) => clearTimeout(id)),
    );

    engine = new CoreEngine();
    mockCtx = {
      clearRect: vi.fn(),
      fillText: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
    } as unknown as Partial<CanvasRenderingContext2D>;
    mockCanvas = {
      width: 1000,
      height: 1000,
      getContext: vi.fn().mockReturnValue(mockCtx),
    } as unknown as Partial<HTMLCanvasElement>;
    engine.setContext(mockCanvas as HTMLCanvasElement, mockCtx as CanvasRenderingContext2D);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Animation Lifecycle (RAF)', () => {
    it('should start animation when run is called', () => {
      engine.run(true);
      expect(engine.animationOn).toBe(true);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should toggle animation when pause is called', () => {
      engine.run(true);
      expect(engine.animationOn).toBe(true);

      engine.pause();
      expect(engine.animationOn).toBe(false);
      expect(window.cancelAnimationFrame).toHaveBeenCalled();

      engine.pause();
      expect(engine.animationOn).toBe(true);
    });

    it('should calculate deltaTime and call draw in the loop', async () => {
      const drawSpy = vi.spyOn(engine, 'draw');
      engine.run(true);

      await vi.advanceTimersByTimeAsync(32); // Advance enough for ~2 frames

      expect(drawSpy).toHaveBeenCalled();
      // speedFactor should be roughly 16.6 / 50 = 0.33 per frame
      const speedFactor = drawSpy.mock.calls[0][2];
      expect(speedFactor).toBeGreaterThan(0);
    });
  });

  describe('Pure Logic: matchColorToIndex', () => {
    it('should map color strings to correct indices', () => {
      expect(engine.matchColorToIndex('green')).toBe(0);
      expect(engine.matchColorToIndex('red')).toBe(1);
      expect(engine.matchColorToIndex('yellow')).toBe(2);
      expect(engine.matchColorToIndex('blue')).toBe(3);
      expect(engine.matchColorToIndex('orange')).toBe(4);
      expect(engine.matchColorToIndex('pink')).toBe(5);
      expect(engine.matchColorToIndex('cyan')).toBe(6);
      expect(engine.matchColorToIndex('random')).toBe(7);
    });

    it('should be case-insensitive', () => {
      expect(engine.matchColorToIndex('GREEN')).toBe(0);
      expect(engine.matchColorToIndex('Red')).toBe(1);
    });

    it('should default to 0 for unknown colors', () => {
      expect(engine.matchColorToIndex('unknown')).toBe(0);
      expect(engine.matchColorToIndex('')).toBe(0);
    });
  });

  describe('Pure Logic: switchColor', () => {
    it('should update chosenColor index', () => {
      engine.switchColor('red');
      expect(engine.chosenColor).toBe(1);

      engine.switchColor('blue');
      expect(engine.chosenColor).toBe(3);
    });
  });

  describe('Square Movement (Mirrored Logic - Migrated from JS)', () => {
    beforeEach(() => {
      // Set initial positions for testing
      engine.x1 = 250;
      engine.x2 = 500;
      engine.y1 = 250;
      engine.y2 = 500;
      engine.alternativeFontSize = 20;
      engine.squareAnimationOn = true;
    });

    it('should move square left (mirrored: +X) when moveSquareLeft is called', () => {
      const initialX1 = engine.x1;
      const initialX2 = engine.x2;
      engine.moveSquareLeft(false);
      expect(engine.x1).toBe(initialX1 + engine.alternativeFontSize);
      expect(engine.x2).toBe(initialX2 + engine.alternativeFontSize);
    });

    it('should move square right (mirrored: -X) when moveSquareRight is called', () => {
      const initialX1 = engine.x1;
      const initialX2 = engine.x2;
      engine.moveSquareRight(false);
      expect(engine.x1).toBe(initialX1 - engine.alternativeFontSize);
      expect(engine.x2).toBe(initialX2 - engine.alternativeFontSize);
    });

    it('should move square up (-Y) when moveSquareUp is called', () => {
      const initialY1 = engine.y1;
      const initialY2 = engine.y2;
      engine.moveSquareUp(false);
      expect(engine.y1).toBe(initialY1 - engine.alternativeFontSize);
      expect(engine.y2).toBe(initialY2 - engine.alternativeFontSize);
    });

    it('should move square down (+Y) when moveSquareDown is called', () => {
      const initialY1 = engine.y1;
      const initialY2 = engine.y2;
      engine.moveSquareDown(false);
      expect(engine.y1).toBe(initialY1 + engine.alternativeFontSize);
      expect(engine.y2).toBe(initialY2 + engine.alternativeFontSize);
    });

    it('should respect left boundary (unconventional name: rightEdge)', () => {
      engine.x1 = engine.rightEdge;
      engine.x2 = engine.x1 + 250;
      engine.moveSquareRight(false);
      expect(engine.x1).toBe(engine.rightEdge);
    });

    it('should respect right boundary (unconventional name: leftEdge)', () => {
      engine.x2 = engine.leftEdge;
      engine.x1 = engine.x2 - 250;
      engine.moveSquareLeft(false);
      expect(engine.x2).toBe(engine.leftEdge);
    });

    it('should respect top boundary', () => {
      engine.y1 = engine.topEdge;
      engine.y2 = engine.y1 + 250;
      engine.moveSquareUp(false);
      expect(engine.y1).toBe(engine.topEdge);
    });

    it('should respect bottom boundary', () => {
      engine.y2 = engine.bottomEdge;
      engine.y1 = engine.y2 - 250;
      engine.moveSquareDown(false);
      expect(engine.y2).toBe(engine.bottomEdge);
    });

    it('should update boundaries when canvas size changes and updateBoundaries is called', () => {
      mockCanvas.width = 1920;
      mockCanvas.height = 1080;
      engine.updateBoundaries();
      expect(engine.leftEdge).toBe(1920 - 60);
      expect(engine.bottomEdge).toBe(1080 - 60);
      expect(engine.leftEdgeDisco).toBe(1920 - 20);
      expect(engine.bottomEdgeDisco).toBe(1080 - 20);
    });
  });
});
