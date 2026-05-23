import type { Direction } from '$lib/types';

type TouchDirection = Extract<Direction, 'north' | 'south' | 'east' | 'west'>;

const DEFAULT_MIN_SWIPE_DISTANCE = 40;
const cleanupByElement = new WeakMap<HTMLElement, () => void>();

export function initTouchControls(options: {
  element: HTMLElement;
  onDirection: (direction: TouchDirection) => void;
  minSwipeDistance?: number;
}): () => void {
  const { element, onDirection, minSwipeDistance = DEFAULT_MIN_SWIPE_DISTANCE } = options;
  const existingCleanup = cleanupByElement.get(element);

  if (existingCleanup) {
    existingCleanup();
  }

  let startX: number | null = null;
  let startY: number | null = null;
  let hasHandledSwipe = false;

  function resetSwipe(): void {
    startX = null;
    startY = null;
    hasHandledSwipe = false;
  }

  function handleTouchStart(event: TouchEvent): void {
    const touch = event.touches[0];

    if (!touch) {
      resetSwipe();
      return;
    }

    startX = touch.clientX;
    startY = touch.clientY;
    hasHandledSwipe = false;
  }

  function handleTouchMove(event: TouchEvent): void {
    if (startX !== null && startY !== null) {
      event.preventDefault();
    }
  }

  function handleTouchEnd(event: TouchEvent): void {
    if (startX === null || startY === null || hasHandledSwipe) {
      resetSwipe();
      return;
    }

    const touch = event.changedTouches[0];

    if (!touch) {
      resetSwipe();
      return;
    }

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (Math.max(absDeltaX, absDeltaY) < minSwipeDistance) {
      resetSwipe();
      return;
    }

    const direction =
      absDeltaX > absDeltaY ? (deltaX > 0 ? 'east' : 'west') : deltaY > 0 ? 'south' : 'north';

    hasHandledSwipe = true;
    event.preventDefault();
    onDirection(direction);
    resetSwipe();
  }

  element.addEventListener('touchstart', handleTouchStart, { passive: true });
  element.addEventListener('touchmove', handleTouchMove, { passive: false });
  element.addEventListener('touchend', handleTouchEnd, { passive: false });
  element.addEventListener('touchcancel', resetSwipe);

  const cleanup = () => {
    element.removeEventListener('touchstart', handleTouchStart);
    element.removeEventListener('touchmove', handleTouchMove);
    element.removeEventListener('touchend', handleTouchEnd);
    element.removeEventListener('touchcancel', resetSwipe);

    if (cleanupByElement.get(element) === cleanup) {
      cleanupByElement.delete(element);
    }
  };

  cleanupByElement.set(element, cleanup);
  return cleanup;
}
