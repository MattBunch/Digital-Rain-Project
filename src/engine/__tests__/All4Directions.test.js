import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CoreEngine } from '../CoreEngine';

describe('CoreEngine All 4 Directions', () => {
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
      scale: vi.fn(),
      translate: vi.fn(),
    };
    mockCanvas = {
      width: 1000,
      height: 1000,
      getContext: vi.fn().mockReturnValue(mockCtx),
    };
    engine.setContext(mockCanvas, mockCtx);
  });

  it('should initialize all4DirectionsArray in North, South, East, West order', () => {
    engine.initializeAll4Directions();
    expect(engine.all4DirectionsArray).toHaveLength(4);
    
    // We can check the ySpeed/xSpeed of the first word in each array to infer direction
    // North: ySpeed should be negative
    expect(engine.all4DirectionsArray[0][0].ySpeed).toBeLessThan(0);
    // South: ySpeed should be positive
    expect(engine.all4DirectionsArray[1][0].ySpeed).toBeGreaterThan(0);
    // East: xSpeed should be positive
    expect(engine.all4DirectionsArray[2][0].xSpeed).toBeGreaterThan(0);
    // West: xSpeed should be negative
    expect(engine.all4DirectionsArray[3][0].xSpeed).toBeLessThan(0);
  });

  it('should move words in correct directions with correct speed regardless of speed sign', () => {
    // Setup a word for each direction
    const northWord = { y: 500, ySpeed: -5, fontSize: 20, word: 'test', show: vi.fn() };
    const southWord = { y: 500, ySpeed: 5, fontSize: 20, word: 'test', show: vi.fn() };
    const eastWord = { x: 500, xSpeed: 5, fontSize: 20, word: 'test', show: vi.fn() };
    const westWord = { x: 500, xSpeed: -5, fontSize: 20, word: 'test', show: vi.fn() };

    // Test North
    engine.direction = 'north';
    engine.draw([northWord], true);
    // Expect y: 500 - (20 + 5) = 475
    expect(northWord.y).toBe(475);
    
    // Test South
    engine.direction = 'south';
    engine.draw([southWord], true);
    // Expect y: 500 + (20 + 5) = 525
    expect(southWord.y).toBe(525);

    // Test East
    engine.direction = 'east';
    engine.draw([eastWord], true);
    // Expect x: 500 - (20 + 5) = 475
    expect(eastWord.x).toBe(475);

    // Test West
    engine.direction = 'west';
    engine.draw([westWord], true);
    // Expect x: 500 + (20 + 5) = 525
    expect(westWord.x).toBe(525);
  });

  it('should call draw with correct directions in drawAll4Directions', () => {
    engine.initializeAll4Directions();
    const drawSpy = vi.spyOn(engine, 'draw');
    
    engine.drawAll4Directions();
    
    // Check call order and arguments
    // north, south, east, west
    expect(drawSpy).toHaveBeenCalledTimes(4);
    expect(drawSpy).toHaveBeenNthCalledWith(1, engine.all4DirectionsArray[0], true);
    expect(engine.all4DirectionsArray[0][0].ySpeed).toBeLessThan(0); // confirms it's north words
    
    expect(drawSpy).toHaveBeenNthCalledWith(2, engine.all4DirectionsArray[1], true);
    expect(engine.all4DirectionsArray[1][0].ySpeed).toBeGreaterThan(0); // confirms it's south words

    expect(drawSpy).toHaveBeenNthCalledWith(3, engine.all4DirectionsArray[2], true);
    expect(engine.all4DirectionsArray[2][0].xSpeed).toBeGreaterThan(0); // confirms it's east words

    expect(drawSpy).toHaveBeenNthCalledWith(4, engine.all4DirectionsArray[3], true);
    expect(engine.all4DirectionsArray[3][0].xSpeed).toBeLessThan(0); // confirms it's west words
  });
});
