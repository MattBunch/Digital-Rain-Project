import { describe, expect, it, vi } from 'vitest';
import { initTouchControls } from '../touchControls';

function createTouchEvent(
  type: string,
  options: {
    touches?: Array<Pick<Touch, 'clientX' | 'clientY'>>;
    changedTouches?: Array<Pick<Touch, 'clientX' | 'clientY'>>;
  },
): TouchEvent {
  const event = new Event(type, { bubbles: true, cancelable: true }) as TouchEvent;

  Object.defineProperty(event, 'touches', {
    value: options.touches ?? [],
  });
  Object.defineProperty(event, 'changedTouches', {
    value: options.changedTouches ?? [],
  });

  return event;
}

function dispatchSwipe(
  element: HTMLElement,
  start: Pick<Touch, 'clientX' | 'clientY'>,
  end: Pick<Touch, 'clientX' | 'clientY'>,
): void {
  element.dispatchEvent(createTouchEvent('touchstart', { touches: [start] }));
  element.dispatchEvent(createTouchEvent('touchend', { changedTouches: [end] }));
}

describe('initTouchControls', () => {
  it('maps horizontal and vertical swipes to directions', () => {
    const element = document.createElement('div');
    const onDirection = vi.fn();

    initTouchControls({ element, onDirection });

    dispatchSwipe(element, { clientX: 100, clientY: 100 }, { clientX: 20, clientY: 100 });
    dispatchSwipe(element, { clientX: 100, clientY: 100 }, { clientX: 180, clientY: 100 });
    dispatchSwipe(element, { clientX: 100, clientY: 100 }, { clientX: 100, clientY: 20 });
    dispatchSwipe(element, { clientX: 100, clientY: 100 }, { clientX: 100, clientY: 180 });

    expect(onDirection).toHaveBeenNthCalledWith(1, 'west');
    expect(onDirection).toHaveBeenNthCalledWith(2, 'east');
    expect(onDirection).toHaveBeenNthCalledWith(3, 'north');
    expect(onDirection).toHaveBeenNthCalledWith(4, 'south');
  });

  it('ignores movement below the minimum swipe distance', () => {
    const element = document.createElement('div');
    const onDirection = vi.fn();

    initTouchControls({ element, onDirection });

    dispatchSwipe(element, { clientX: 100, clientY: 100 }, { clientX: 130, clientY: 100 });

    expect(onDirection).not.toHaveBeenCalled();
  });

  it('uses the dominant swipe axis', () => {
    const element = document.createElement('div');
    const onDirection = vi.fn();

    initTouchControls({ element, onDirection });

    dispatchSwipe(element, { clientX: 100, clientY: 100 }, { clientX: 170, clientY: 130 });
    dispatchSwipe(element, { clientX: 100, clientY: 100 }, { clientX: 130, clientY: 170 });

    expect(onDirection).toHaveBeenNthCalledWith(1, 'east');
    expect(onDirection).toHaveBeenNthCalledWith(2, 'south');
  });

  it('removes listeners during cleanup', () => {
    const element = document.createElement('div');
    const onDirection = vi.fn();
    const cleanup = initTouchControls({ element, onDirection });

    cleanup();
    dispatchSwipe(element, { clientX: 100, clientY: 100 }, { clientX: 180, clientY: 100 });

    expect(onDirection).not.toHaveBeenCalled();
  });

  it('replaces existing listeners when initialized again for the same element', () => {
    const element = document.createElement('div');
    const firstDirection = vi.fn();
    const secondDirection = vi.fn();

    initTouchControls({ element, onDirection: firstDirection });
    initTouchControls({ element, onDirection: secondDirection });
    dispatchSwipe(element, { clientX: 100, clientY: 100 }, { clientX: 180, clientY: 100 });

    expect(firstDirection).not.toHaveBeenCalled();
    expect(secondDirection).toHaveBeenCalledWith('east');
  });
});
