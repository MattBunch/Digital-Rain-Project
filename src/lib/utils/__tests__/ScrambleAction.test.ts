import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scramble } from '../ScrambleAction';

describe('scramble', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('scrambles text on hover and restores the original text on mouseleave', () => {
    const node = document.createElement('button');
    node.textContent = 'HELLO WORLD';
    const action = scramble(node, { duration: 200 });

    node.dispatchEvent(new MouseEvent('mouseenter'));
    vi.setSystemTime(40);
    vi.advanceTimersByTime(40);

    expect(node.textContent).not.toBe('HELLO WORLD');
    expect(node.textContent?.charAt(5)).toBe(' ');

    node.dispatchEvent(new MouseEvent('mouseleave'));
    expect(node.textContent).toBe('HELLO WORLD');

    action.destroy();
  });

  it('does not start duplicate intervals while already scrambling', () => {
    const node = document.createElement('button');
    node.textContent = 'SIGNAL';
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const action = scramble(node, 200);

    node.dispatchEvent(new MouseEvent('mouseenter'));
    node.dispatchEvent(new MouseEvent('mouseenter'));

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    action.destroy();
  });

  it('supports string, number, and object updates', () => {
    const node = document.createElement('button');
    const action = scramble(node, 'INITIAL');

    expect(node.textContent).toBe('');

    action.update('UPDATED');
    expect(node.textContent).toBe('UPDATED');

    action.update(500);
    node.dispatchEvent(new MouseEvent('mouseenter'));
    vi.setSystemTime(300);
    vi.advanceTimersByTime(40);
    expect(node.textContent).not.toBe('UPDATED');

    action.update({ text: 'FINAL', duration: 50 });
    node.dispatchEvent(new MouseEvent('mouseleave'));
    expect(node.textContent).toBe('FINAL');

    action.destroy();
  });

  it('clears an active interval on destroy', () => {
    const node = document.createElement('button');
    node.textContent = 'ACTIVE';
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const action = scramble(node, { duration: 200 });

    node.dispatchEvent(new MouseEvent('mouseenter'));
    action.destroy();

    expect(clearIntervalSpy).toHaveBeenCalled();
  });
});
