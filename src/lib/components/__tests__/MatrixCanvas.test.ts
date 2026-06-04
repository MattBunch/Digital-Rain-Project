import { fireEvent, render, screen } from '@testing-library/svelte';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CoreEngine } from '$lib/engine/CoreEngine';
import MatrixCanvas from '../MatrixCanvas.svelte';
import MatrixCanvasBindingWrapper from './MatrixCanvasBindingWrapper.svelte';

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

    mockCoarsePointer(false);
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

  function mockCoarsePointer(matches: boolean) {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(hover: none) and (pointer: coarse)' ? matches : false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  function getCanvas(container: HTMLElement): HTMLElement {
    const canvas = container.querySelector('canvas');

    if (!(canvas instanceof HTMLElement)) {
      throw new Error('Expected MatrixCanvas to render a canvas element');
    }

    return canvas;
  }

  function renderCanvas(
    engine = createEngine(),
    mode: 'normal' | 'square' = 'normal',
    showMobileControls = true,
  ) {
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
        showMobileControls,
      },
    });

    return { ...rendered, engine, onReturn };
  }

  async function swipeCanvas(
    canvas: HTMLElement,
    start: Pick<Touch, 'clientX' | 'clientY'>,
    end: Pick<Touch, 'clientX' | 'clientY'>,
  ) {
    await fireEvent.touchStart(canvas, {
      touches: [start],
    });
    await fireEvent.touchEnd(canvas, {
      changedTouches: [end],
    });
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

  it('ignores color keyboard shortcuts from editable inputs', async () => {
    const engine = createEngine();
    render(MatrixCanvasBindingWrapper, { props: { engine } });
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const colorKeys = ['1', '2', '3', '4', '5', '6', '7', '8'];
    for (const key of colorKeys) {
      await fireEvent.keyDown(input, { key });
    }

    expect(screen.getByTestId('chosen-color')).toHaveTextContent('green');
    expect(engine.updateRandomColor).not.toHaveBeenCalled();
    expect(input).toHaveFocus();

    document.body.removeChild(input);
  });

  it('changes color from non-editable keyboard shortcut targets', async () => {
    const engine = createEngine();
    render(MatrixCanvasBindingWrapper, { props: { engine } });

    await fireEvent.keyDown(window, { key: '2' });
    expect(screen.getByTestId('chosen-color')).toHaveTextContent('red');

    await fireEvent.keyDown(window, { key: '8' });
    expect(engine.updateRandomColor).toHaveBeenCalled();
    expect(screen.getByTestId('chosen-color')).toHaveTextContent('random');
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

  it('changes direction from canvas swipes', async () => {
    const { container, engine } = renderCanvas();
    const canvas = getCanvas(container);

    await swipeCanvas(canvas, { clientX: 100, clientY: 100 }, { clientX: 20, clientY: 100 });
    expect(engine.direction).toBe('west');
    expect(engine.resetWordsArray).toHaveBeenCalledTimes(1);

    await swipeCanvas(canvas, { clientX: 100, clientY: 100 }, { clientX: 180, clientY: 100 });
    expect(engine.direction).toBe('east');
    expect(engine.resetWordsArray).toHaveBeenCalledTimes(1);

    await swipeCanvas(canvas, { clientX: 100, clientY: 100 }, { clientX: 100, clientY: 20 });
    expect(engine.direction).toBe('north');
    expect(engine.resetWordsArray).toHaveBeenCalledTimes(2);

    await swipeCanvas(canvas, { clientX: 100, clientY: 100 }, { clientX: 100, clientY: 180 });
    expect(engine.direction).toBe('south');
    expect(engine.resetWordsArray).toHaveBeenCalledTimes(2);
  });

  it('moves the square from canvas swipes in square animation mode', async () => {
    const engine = createEngine();
    engine.squareAnimationOn = true;
    const { container } = renderCanvas(engine);
    const canvas = getCanvas(container);

    await swipeCanvas(canvas, { clientX: 100, clientY: 100 }, { clientX: 20, clientY: 100 });
    await swipeCanvas(canvas, { clientX: 100, clientY: 100 }, { clientX: 180, clientY: 100 });
    await swipeCanvas(canvas, { clientX: 100, clientY: 100 }, { clientX: 100, clientY: 20 });
    await swipeCanvas(canvas, { clientX: 100, clientY: 100 }, { clientX: 100, clientY: 180 });

    expect(engine.moveSquareLeft).toHaveBeenCalledWith(false);
    expect(engine.moveSquareRight).toHaveBeenCalledWith(false);
    expect(engine.moveSquareUp).toHaveBeenCalledWith(false);
    expect(engine.moveSquareDown).toHaveBeenCalledWith(false);
  });

  it('ignores tiny canvas swipes', async () => {
    const { container, engine } = renderCanvas();
    const canvas = getCanvas(container);

    await swipeCanvas(canvas, { clientX: 100, clientY: 100 }, { clientX: 130, clientY: 100 });

    expect(engine.direction).toBe('south');
    expect(engine.resetWordsArray).not.toHaveBeenCalled();
  });

  it('tracks mirrored pointer coordinates and clears pointer state on leave', async () => {
    const { container, engine } = renderCanvas();
    const canvas = getCanvas(container);

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

  it('does not return to settings on coarse-pointer canvas taps', async () => {
    mockCoarsePointer(true);
    const { container, onReturn } = renderCanvas();
    const canvas = getCanvas(container);

    await screen.findByRole('button', { name: 'Return to settings' });

    await fireEvent.click(canvas);
    await fireEvent.keyDown(canvas, { key: 'Enter' });

    expect(onReturn).not.toHaveBeenCalled();
    expect(canvas).not.toHaveAttribute('role');
    expect(canvas).not.toHaveAttribute('aria-label');
  });

  it('returns to settings from the coarse-pointer mobile menu button', async () => {
    mockCoarsePointer(true);
    const { onReturn } = renderCanvas();
    const menuButton = await screen.findByRole('button', { name: 'Return to settings' });

    await fireEvent.click(menuButton);

    expect(onReturn).toHaveBeenCalledTimes(1);
  });

  it('hides coarse-pointer mobile controls when disabled', async () => {
    mockCoarsePointer(true);
    renderCanvas(createEngine(), 'normal', false);

    expect(screen.queryByRole('button', { name: 'Return to settings' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Pause or play animation' }),
    ).not.toBeInTheDocument();
  });

  it('runs shared actions from coarse-pointer mobile controls', async () => {
    mockCoarsePointer(true);
    const engine = createEngine();
    render(MatrixCanvasBindingWrapper, { props: { engine } });

    await fireEvent.click(await screen.findByRole('button', { name: 'Pause or play animation' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Clear screen' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Toggle disco mode' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Switch animation mode' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Decrease speed' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Increase speed' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Decrease font size' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Increase font size' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Move west' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Move north' }));

    expect(engine.pause).toHaveBeenCalled();
    expect(engine.clearScreen).toHaveBeenCalled();
    expect(screen.getByTestId('disco-on')).toHaveTextContent('true');
    expect(engine.switchMode).toHaveBeenCalled();
    expect(engine.speedController).toHaveBeenCalledWith(false);
    expect(engine.speedController).toHaveBeenCalledWith(true);
    expect(engine.controlFontSize).toHaveBeenCalledWith(false);
    expect(engine.controlFontSize).toHaveBeenCalledWith(true);
    expect(engine.direction).toBe('north');
  });

  it('moves the square from coarse-pointer direction controls in square animation mode', async () => {
    mockCoarsePointer(true);
    const engine = createEngine();
    engine.squareAnimationOn = true;
    renderCanvas(engine);

    await fireEvent.click(await screen.findByRole('button', { name: 'Move west' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Move east' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Move north' }));
    await fireEvent.click(screen.getByRole('button', { name: 'Move south' }));

    expect(engine.moveSquareLeft).toHaveBeenCalledWith(false);
    expect(engine.moveSquareRight).toHaveBeenCalledWith(false);
    expect(engine.moveSquareUp).toHaveBeenCalledWith(false);
    expect(engine.moveSquareDown).toHaveBeenCalledWith(false);
  });
});
