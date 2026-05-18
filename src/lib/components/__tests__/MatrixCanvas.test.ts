import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CoreEngine } from '$lib/engine/CoreEngine';
import MatrixCanvas from '../MatrixCanvas.svelte';

describe('MatrixCanvas', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn().mockReturnValue({
        font: '',
        translate: vi.fn(),
        scale: vi.fn(),
        fillRect: vi.fn(),
        clearRect: vi.fn(),
        fillText: vi.fn(),
      }),
    });

    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 600,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function createEngine() {
    return {
      ctx: {},
      canvas: undefined,
      squareAnimationOn: false,
      direction: 'south',
      defaultFontSize: 20,
      setContext: vi.fn(),
      updateBoundaries: vi.fn(),
      run: vi.fn(),
      stop: vi.fn(),
      resetWordsArray: vi.fn(),
      clearMousePosition: vi.fn(),
      setMousePosition: vi.fn(),
      pause: vi.fn(),
      clearScreen: vi.fn(),
      speedController: vi.fn(),
      updateRandomColor: vi.fn(),
      controlFontSize: vi.fn(),
      controlStringSize: vi.fn(),
      rapidWordChangeControl: vi.fn(),
      switchMode: vi.fn(),
      moveSquareLeft: vi.fn(),
      moveSquareRight: vi.fn(),
      moveSquareUp: vi.fn(),
      moveSquareDown: vi.fn(),
    } as unknown as CoreEngine;
  }

  function renderCanvas(engine = createEngine(), mode: 'normal' | 'square' = 'normal') {
    const onReturn = vi.fn();
    const rendered = render(MatrixCanvas, {
      props: {
        engine,
        mode,
        onReturn,
        discoOn: false,
        chosenColor: 'green',
        all4Directions: false,
        all8Directions: false,
        waveDistortion: false,
        mouseInteractionMode: 'off',
      },
    });

    return { ...rendered, engine, onReturn };
  }

  it('sets up the canvas, starts the engine, and cleans up on unmount', () => {
    const { engine, unmount } = renderCanvas();

    expect(engine.setContext).toHaveBeenCalled();
    expect(engine.updateBoundaries).toHaveBeenCalled();
    expect(engine.run).toHaveBeenCalledWith(true);

    unmount();

    expect(engine.stop).toHaveBeenCalled();
  });

  it('handles return, pause, clear, speed, mode, and size keyboard shortcuts', async () => {
    const { engine, onReturn } = renderCanvas();

    await fireEvent.keyDown(window, { key: 'Escape' });
    await fireEvent.keyDown(window, { key: ' ' });
    await fireEvent.keyDown(window, { key: 'c' });
    await fireEvent.keyDown(window, { key: 'PageUp' });
    await fireEvent.keyDown(window, { key: 'PageDown' });
    await fireEvent.keyDown(window, { key: 'w' });
    await fireEvent.keyDown(window, { key: 's' });
    await fireEvent.keyDown(window, { key: 'q' });
    await fireEvent.keyDown(window, { key: 'a' });
    await fireEvent.keyDown(window, { key: 'r' });
    await fireEvent.keyDown(window, { key: 'm' });

    expect(onReturn).toHaveBeenCalled();
    expect(engine.pause).toHaveBeenCalled();
    expect(engine.clearScreen).toHaveBeenCalled();
    expect(engine.speedController).toHaveBeenCalledWith(true);
    expect(engine.speedController).toHaveBeenCalledWith(false);
    expect(engine.controlFontSize).toHaveBeenCalledWith(true);
    expect(engine.controlFontSize).toHaveBeenCalledWith(false);
    expect(engine.controlStringSize).toHaveBeenCalledWith(true);
    expect(engine.controlStringSize).toHaveBeenCalledWith(false);
    expect(engine.rapidWordChangeControl).toHaveBeenCalled();
    expect(engine.switchMode).toHaveBeenCalled();
  });

  it('changes directions and only resets words for non-opposite turns', async () => {
    const { engine } = renderCanvas();

    await fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(engine.direction).toBe('east');
    expect(engine.resetWordsArray).toHaveBeenCalledTimes(1);

    await fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(engine.direction).toBe('west');
    expect(engine.resetWordsArray).toHaveBeenCalledTimes(1);

    await fireEvent.keyDown(window, { key: 'ArrowUp' });
    expect(engine.direction).toBe('north');
    expect(engine.resetWordsArray).toHaveBeenCalledTimes(2);

    await fireEvent.keyDown(window, { key: 'y' });
    expect(engine.direction).toBe('northwest');
    expect(engine.resetWordsArray).toHaveBeenCalledTimes(3);
  });

  it('moves the square with arrow keys in square animation mode', async () => {
    const engine = createEngine();
    engine.squareAnimationOn = true;
    renderCanvas(engine);

    await fireEvent.keyDown(window, { key: 'ArrowLeft' });
    await fireEvent.keyDown(window, { key: 'ArrowRight' });
    await fireEvent.keyDown(window, { key: 'ArrowUp' });
    await fireEvent.keyDown(window, { key: 'ArrowDown' });

    expect(engine.moveSquareLeft).toHaveBeenCalledWith(false);
    expect(engine.moveSquareRight).toHaveBeenCalledWith(false);
    expect(engine.moveSquareUp).toHaveBeenCalledWith(false);
    expect(engine.moveSquareDown).toHaveBeenCalledWith(false);
  });

  it('tracks mirrored pointer coordinates and clears pointer state on leave', async () => {
    const { engine } = renderCanvas();
    const canvas = screen.getByRole('button', { name: 'Return to settings' });

    vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({
      x: 0,
      y: 0,
      left: 10,
      top: 20,
      right: 410,
      bottom: 220,
      width: 400,
      height: 200,
      toJSON: vi.fn(),
    });

    Object.defineProperty(canvas, 'width', {
      configurable: true,
      value: 800,
    });
    Object.defineProperty(canvas, 'height', {
      configurable: true,
      value: 400,
    });

    await fireEvent.pointerMove(canvas, { clientX: 110, clientY: 70 });
    expect(engine.setMousePosition).toHaveBeenCalledWith(600, 100);

    await fireEvent.pointerLeave(canvas);
    expect(engine.clearMousePosition).toHaveBeenCalled();
  });

  it('resets canvas state on window resize', async () => {
    const { engine } = renderCanvas();

    await fireEvent.resize(window);

    expect(engine.updateBoundaries).toHaveBeenCalledTimes(2);
    expect(engine.clearMousePosition).toHaveBeenCalled();
    expect(engine.resetWordsArray).toHaveBeenCalled();
  });

  it('returns to settings on canvas click and keyboard activation', async () => {
    const { onReturn } = renderCanvas();
    const canvas = screen.getByRole('button', { name: 'Return to settings' });

    await fireEvent.click(canvas);
    await fireEvent.keyDown(canvas, { key: 'Enter' });

    expect(onReturn).toHaveBeenCalledTimes(2);
  });
});
