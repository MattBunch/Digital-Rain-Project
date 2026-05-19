import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnimationManager } from '../AnimationManager';

describe('AnimationManager', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn().mockReturnValue(1));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
    vi.spyOn(performance, 'now').mockReturnValue(100);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('starts animation and cancels an existing frame before restarting', () => {
    const callback = vi.fn();
    const manager = new AnimationManager(callback);

    manager.requestId = 42;
    manager.start();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(42);
    expect(requestAnimationFrame).toHaveBeenCalledWith(callback);
    expect(manager.animationOn).toBe(true);
    expect(manager.requestId).toBe(1);
  });

  it('stops animation and clears request id', () => {
    const manager = new AnimationManager(vi.fn());
    manager.requestId = 7;
    manager.animationOn = true;

    manager.stop();

    expect(cancelAnimationFrame).toHaveBeenCalledWith(7);
    expect(manager.requestId).toBeNull();
    expect(manager.animationOn).toBe(false);
  });

  it('toggles pause state', () => {
    const manager = new AnimationManager(vi.fn());

    expect(manager.pause()).toBe(true);
    expect(manager.pause()).toBe(false);
  });

  it('calculates delta time, fps, and speed factor', () => {
    const manager = new AnimationManager(vi.fn());
    manager.lastTime = 100;
    manager.intervalSpeed = 25;

    expect(manager.getDeltaTime(125)).toBe(25);
    expect(manager.getSpeedFactor(25)).toBe(1);

    manager.getDeltaTime(1126);

    expect(manager.fps).toBe(2);
  });
});
