import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { glitchClick } from '../GlitchAction';

describe('glitchClick', () => {
  let rafCallbacks: FrameRequestCallback[];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    rafCallbacks = [];
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        rafCallbacks.push(callback);
        return rafCallbacks.length;
      }),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  function runNextFrame(time: number) {
    const callback = rafCallbacks.shift();
    if (!callback) {
      throw new Error('Expected a queued animation frame');
    }
    vi.setSystemTime(time);
    callback(time);
  }

  it('applies glitch styles on mousedown and resets them after duration', () => {
    const node = document.createElement('button');
    const action = glitchClick(node, { duration: 100 });

    node.dispatchEvent(new MouseEvent('mousedown'));
    expect(requestAnimationFrame).toHaveBeenCalledTimes(1);

    runNextFrame(50);
    expect(node.style.transform).toMatch(/^translateX\(/);
    expect(node.style.filter).toContain('blur(');
    expect(node.style.textShadow).toContain('rgba(255,0,0,0.7)');

    runNextFrame(100);
    expect(node.style.textShadow).toBe('none');
    expect(node.style.transform).toBe('none');
    expect(node.style.filter).toBe('none');
    expect(node.style.opacity).toBe('1');

    action.destroy();
  });

  it('uses updated duration and removes the listener on destroy', () => {
    const node = document.createElement('button');
    const action = glitchClick(node, { duration: 100 });

    action.update({ duration: 200 });
    node.dispatchEvent(new MouseEvent('mousedown'));
    runNextFrame(100);

    expect(node.style.transform).toMatch(/^translateX\(/);

    runNextFrame(200);
    expect(node.style.transform).toBe('none');

    action.destroy();
    vi.clearAllMocks();

    node.dispatchEvent(new MouseEvent('mousedown'));
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });
});
