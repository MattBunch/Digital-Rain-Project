<script lang="ts">
  import { canvasSetup } from '$lib/utils/CoordinateUtils';
  import { initTouchControls } from '$lib/input/touchControls';
  import type { CoreEngine } from '$lib/engine/CoreEngine';
  import type { Direction, MouseInteractionMode } from '$lib/types';

  /* eslint-disable prefer-const, no-useless-assignment */
  let {
    engine,
    mode,
    onReturn,
    discoOn = $bindable(false),
    chosenColor = $bindable('green'),
    all4Directions = $bindable(false),
    all8Directions = $bindable(false),
    waveDistortion = $bindable(false),
    mouseInteractionMode = $bindable('off' as MouseInteractionMode),
  } = $props<{
    engine: CoreEngine;
    mode: 'normal' | 'square';
    onReturn: () => void;
    discoOn: boolean;
    chosenColor: string;
    all4Directions: boolean;
    all8Directions: boolean;
    waveDistortion: boolean;
    mouseInteractionMode: MouseInteractionMode;
  }>();
  /* eslint-enable prefer-const, no-useless-assignment */

  let canvas: HTMLCanvasElement;

  function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable
    );
  }

  function isColorShortcut(key: string): boolean {
    return /^[1-8]$/.test(key);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (isColorShortcut(event.key) && isEditableTarget(event.target)) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        onReturn();
        break;
      case 'ArrowLeft':
        handleDirectionInput('west');
        break;
      case 'ArrowUp':
        handleDirectionInput('north');
        break;
      case 'ArrowRight':
        handleDirectionInput('east');
        break;
      case 'ArrowDown':
        handleDirectionInput('south');
        break;
      case ' ':
        if (engine.ctx != null) {
          engine.pause();
        }
        break;
      case 'c':
        engine.clearScreen();
        break;
      case 'd':
        discoOn = !discoOn;
        break;
      case 'PageUp':
        if (engine.ctx != null || !engine.squareAnimationOn) {
          engine.speedController(true);
        }
        break;
      case 'PageDown':
        if (engine.ctx != null || !engine.squareAnimationOn) {
          engine.speedController(false);
        }
        break;
      case '1':
        chosenColor = 'green';
        break;
      case '2':
        chosenColor = 'red';
        break;
      case '3':
        chosenColor = 'yellow';
        break;
      case '4':
        chosenColor = 'blue';
        break;
      case '5':
        chosenColor = 'orange';
        break;
      case '6':
        chosenColor = 'pink';
        break;
      case '7':
        chosenColor = 'cyan';
        break;
      case '8':
        engine.updateRandomColor();
        chosenColor = 'random';
        break;
      case 'w':
        engine.controlFontSize(true);
        break;
      case 'x':
        waveDistortion = !waveDistortion;
        break;
      case 'g':
        mouseInteractionMode = getNextMouseInteractionMode(mouseInteractionMode);
        break;
      case 's':
        engine.controlFontSize(false);
        break;
      case 'q':
        engine.controlStringSize(true);
        break;
      case 'a':
        engine.controlStringSize(false);
        break;
      case 'r':
        engine.rapidWordChangeControl();
        break;
      case 'm':
        if (engine.ctx) {
          engine.switchMode();
        }
        break;
      case 't':
        all4Directions = !all4Directions;
        if (all4Directions) {
          all8Directions = false;
        }
        break;
      case 'T':
        all8Directions = !all8Directions;
        if (all8Directions) {
          all4Directions = false;
        }
        break;
      case 'y':
        updateRainDirection('northwest');
        break;
      case 'u':
        updateRainDirection('northeast');
        break;
      case 'b':
        updateRainDirection('southwest');
        break;
      case 'n':
        updateRainDirection('southeast');
        break;
      default:
        break;
    }
  }

  function handleDirectionInput(direction: Direction): void {
    if (engine.squareAnimationOn) {
      moveSquare(direction);
      return;
    }

    updateRainDirection(direction);
  }

  function moveSquare(direction: Direction): void {
    switch (direction) {
      case 'west':
        engine.moveSquareLeft(false);
        break;
      case 'north':
        engine.moveSquareUp(false);
        break;
      case 'east':
        engine.moveSquareRight(false);
        break;
      case 'south':
        engine.moveSquareDown(false);
        break;
      default:
        break;
    }
  }

  function updateRainDirection(newDirection: Direction): void {
    const oppositeDirection = getOppositeDirection(newDirection);

    if (engine.direction !== newDirection) {
      // We always update the direction if it's new
      const wasOpposite = engine.direction === oppositeDirection;
      engine.direction = newDirection;

      // We only reset if it WASN'T a 180-degree turn
      if (!wasOpposite) {
        engine.resetWordsArray();
      }
    }
  }

  function getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
      case 'north':
        return 'south';
      case 'south':
        return 'north';
      case 'east':
        return 'west';
      case 'west':
        return 'east';
      case 'northeast':
        return 'southwest';
      case 'northwest':
        return 'southeast';
      case 'southeast':
        return 'northwest';
      case 'southwest':
        return 'northeast';
      default:
        return 'south';
    }
  }

  function getNextMouseInteractionMode(currentMode: MouseInteractionMode): MouseInteractionMode {
    if (currentMode === 'off') {
      return 'repel';
    }
    if (currentMode === 'repel') {
      return 'attract';
    }
    return 'off';
  }

  function handlePointerMove(event: PointerEvent): void {
    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const rawCanvasX = (event.clientX - rect.left) * scaleX;
    const rawCanvasY = (event.clientY - rect.top) * scaleY;

    engine.setMousePosition(canvas.width - rawCanvasX, rawCanvasY);
  }

  function handlePointerLeave(): void {
    engine.clearMousePosition();
  }

  $effect(() => {
    if (canvas) {
      const ctx = canvas.getContext('2d')!;
      engine.setContext(canvas, ctx);

      const setup = () => {
        canvasSetup(window.innerWidth, window.innerHeight, canvas, ctx, engine.defaultFontSize);
        engine.updateBoundaries();
      };

      setup();
      engine.run(mode === 'normal');
      const cleanupTouchControls = initTouchControls({
        element: canvas,
        onDirection: handleDirectionInput,
      });

      const handleResize = () => {
        setup();
        engine.clearMousePosition();
        engine.resetWordsArray();
      };

      window.addEventListener('resize', handleResize);

      return () => {
        cleanupTouchControls();
        window.removeEventListener('resize', handleResize);
        engine.stop();
      };
    }

    // NOTE: We return undefined here to satisfy the linter, but the actual cleanup is handled in the returned function above. This is just to avoid a linting error about not returning anything from an effect.
    return undefined;
  });

  // Secondary effect to handle state changes that might happen from App.svelte
  $effect(() => {
    // These values are synced in App.svelte already, but we might want to trigger resetWordsArray
    // if direction or all4Directions change externally (though they mostly change via KeyDown here)
  });
</script>

<svelte:window onkeydown={handleKeyDown} />

<canvas
  bind:this={canvas}
  data-digital-rain-root
  onclick={onReturn}
  onkeydown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onReturn();
    }
  }}
  role="button"
  tabindex="0"
  aria-label="Return to settings"
  style:display="block"
  style:background="black"
  style:cursor="pointer"
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
></canvas>

<style>
  canvas {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }

  canvas[data-digital-rain-root] {
    touch-action: none;
    overscroll-behavior: contain;
  }
</style>
