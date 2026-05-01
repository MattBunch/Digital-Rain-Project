import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CoreEngine } from '../CoreEngine';

describe('CoreEngine Square Movement (Mirrored Logic)', () => {
  let engine;
  let mockCanvas;
  let mockCtx;

  beforeEach(() => {
    engine = new CoreEngine();
    mockCtx = {
      clearRect: vi.fn(),
      fillText: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
    };
    mockCanvas = {
      width: 1000,
      height: 1000,
      getContext: vi.fn().mockReturnValue(mockCtx),
    };
    engine.setContext(mockCanvas, mockCtx);
    
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
