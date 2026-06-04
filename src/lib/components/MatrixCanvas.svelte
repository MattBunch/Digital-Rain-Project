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
    showMobileControls = true,
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
    showMobileControls?: boolean;
  }>();
  /* eslint-enable prefer-const, no-useless-assignment */

  const coarsePointerQuery = '(hover: none) and (pointer: coarse)';

  let canvas: HTMLCanvasElement;
  let isCoarsePointer = $state(false);

  const shouldShowMobileControls = $derived(showMobileControls && isCoarsePointer);

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
        returnToMenu();
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
        togglePause();
        break;
      case 'c':
        clearCanvas();
        break;
      case 'd':
        toggleDisco();
        break;
      case 'PageUp':
        increaseSpeed();
        break;
      case 'PageDown':
        decreaseSpeed();
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
        increaseFontSize();
        break;
      case 'x':
        waveDistortion = !waveDistortion;
        break;
      case 'g':
        mouseInteractionMode = getNextMouseInteractionMode(mouseInteractionMode);
        break;
      case 's':
        decreaseFontSize();
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
        switchMode();
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

  function returnToMenu(): void {
    onReturn();
  }

  function togglePause(): void {
    if (engine.ctx != null) {
      engine.pause();
    }
  }

  function clearCanvas(): void {
    engine.clearScreen();
  }

  function toggleDisco(): void {
    discoOn = !discoOn;
  }

  function increaseSpeed(): void {
    if (engine.ctx != null || !engine.squareAnimationOn) {
      engine.speedController(true);
    }
  }

  function decreaseSpeed(): void {
    if (engine.ctx != null || !engine.squareAnimationOn) {
      engine.speedController(false);
    }
  }

  function increaseFontSize(): void {
    engine.controlFontSize(true);
  }

  function decreaseFontSize(): void {
    engine.controlFontSize(false);
  }

  function switchMode(): void {
    if (engine.ctx) {
      engine.switchMode();
    }
  }

  function handleCanvasClick(): void {
    if (!isCoarsePointer) {
      returnToMenu();
    }
  }

  function handleCanvasKeyDown(event: KeyboardEvent): void {
    if (isCoarsePointer) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      returnToMenu();
    }
  }

  function runMobileAction(event: MouseEvent, action: () => void): void {
    event.stopPropagation();
    action();
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

  $effect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia?.(coarsePointerQuery);

    if (!mediaQuery) {
      isCoarsePointer = false;
      return undefined;
    }

    const updateCoarsePointer = (event?: MediaQueryListEvent) => {
      isCoarsePointer = event?.matches ?? mediaQuery.matches;
    };

    updateCoarsePointer();
    mediaQuery.addEventListener('change', updateCoarsePointer);

    return () => {
      mediaQuery.removeEventListener('change', updateCoarsePointer);
    };
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
  onclick={handleCanvasClick}
  onkeydown={handleCanvasKeyDown}
  role={isCoarsePointer ? undefined : 'button'}
  tabindex={isCoarsePointer ? undefined : 0}
  aria-label={isCoarsePointer ? undefined : 'Return to settings'}
  style:display="block"
  style:background="var(--canvas-bg)"
  style:cursor={isCoarsePointer ? 'default' : 'pointer'}
  onpointermove={handlePointerMove}
  onpointerleave={handlePointerLeave}
></canvas>

{#if shouldShowMobileControls}
  <button
    type="button"
    class="mobile-menu-button"
    aria-label="Return to settings"
    onclick={(event) => runMobileAction(event, returnToMenu)}
  >
    MENU
  </button>

  <div class="mobile-controls" aria-label="Mobile controls">
    <div class="mobile-control-row">
      <button
        type="button"
        aria-label="Pause or play animation"
        onclick={(event) => runMobileAction(event, togglePause)}
      >
        PAUSE
      </button>
      <button
        type="button"
        aria-label="Clear screen"
        onclick={(event) => runMobileAction(event, clearCanvas)}
      >
        CLR
      </button>
      <button
        type="button"
        aria-label="Toggle disco mode"
        onclick={(event) => runMobileAction(event, toggleDisco)}
      >
        DSC
      </button>
      <button
        type="button"
        aria-label="Switch animation mode"
        onclick={(event) => runMobileAction(event, switchMode)}
      >
        MODE
      </button>
    </div>

    <div class="mobile-control-row">
      <button
        type="button"
        aria-label="Decrease speed"
        onclick={(event) => runMobileAction(event, decreaseSpeed)}
      >
        SPD-
      </button>
      <button
        type="button"
        aria-label="Increase speed"
        onclick={(event) => runMobileAction(event, increaseSpeed)}
      >
        SPD+
      </button>
      <button
        type="button"
        aria-label="Decrease font size"
        onclick={(event) => runMobileAction(event, decreaseFontSize)}
      >
        FNT-
      </button>
      <button
        type="button"
        aria-label="Increase font size"
        onclick={(event) => runMobileAction(event, increaseFontSize)}
      >
        FNT+
      </button>
    </div>

    <div class="mobile-direction-pad" aria-label="Direction controls">
      <button
        type="button"
        class="direction-button north"
        aria-label="Move north"
        onclick={(event) => runMobileAction(event, () => handleDirectionInput('north'))}
      >
        N
      </button>
      <button
        type="button"
        class="direction-button west"
        aria-label="Move west"
        onclick={(event) => runMobileAction(event, () => handleDirectionInput('west'))}
      >
        W
      </button>
      <button
        type="button"
        class="direction-button east"
        aria-label="Move east"
        onclick={(event) => runMobileAction(event, () => handleDirectionInput('east'))}
      >
        E
      </button>
      <button
        type="button"
        class="direction-button south"
        aria-label="Move south"
        onclick={(event) => runMobileAction(event, () => handleDirectionInput('south'))}
      >
        S
      </button>
    </div>
  </div>
{/if}

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

  .mobile-menu-button,
  .mobile-controls button {
    min-width: 44px;
    min-height: 44px;
    border: 1px solid rgba(var(--theme-color-rgb, 0, 255, 65), 0.8);
    background: rgba(0, 0, 0, 0.72);
    color: var(--control-text);
    font-family: var(--font-mono);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0;
    box-shadow:
      inset 0 0 6px rgba(var(--theme-color-rgb, 0, 255, 65), 0.22),
      0 0 12px rgba(var(--theme-color-rgb, 0, 255, 65), 0.16);
    cursor: pointer;
  }

  .mobile-menu-button:focus-visible,
  .mobile-controls button:focus-visible {
    outline: 2px solid var(--control-text);
    outline-offset: 2px;
  }

  .mobile-menu-button:active,
  .mobile-controls button:active {
    background: rgba(var(--theme-color-rgb, 0, 255, 65), 0.2);
  }

  .mobile-menu-button {
    position: fixed;
    z-index: 5;
    top: calc(env(safe-area-inset-top, 0px) + 0.75rem);
    right: calc(env(safe-area-inset-right, 0px) + 0.75rem);
    padding: 0 0.85rem;
  }

  .mobile-controls {
    position: fixed;
    z-index: 5;
    left: 50%;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 0.75rem);
    transform: translateX(-50%);
    width: min(calc(100vw - 1rem), 23rem);
    display: grid;
    gap: 0.45rem;
    padding: 0.55rem;
    background: rgba(0, 0, 0, 0.52);
    border: 1px solid rgba(var(--theme-color-rgb, 0, 255, 65), 0.35);
    backdrop-filter: blur(6px);
  }

  .mobile-control-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.4rem;
  }

  .mobile-direction-pad {
    display: grid;
    grid-template-columns: repeat(3, 44px);
    grid-template-areas:
      '. north .'
      'west . east'
      '. south .';
    justify-content: center;
    gap: 0.35rem;
  }

  .direction-button.north {
    grid-area: north;
  }

  .direction-button.west {
    grid-area: west;
  }

  .direction-button.east {
    grid-area: east;
  }

  .direction-button.south {
    grid-area: south;
  }

  :global(:root[data-theme='light']) .mobile-menu-button,
  :global(:root[data-theme='light']) .mobile-controls button {
    background: rgba(255, 255, 255, 0.78);
  }

  :global(:root[data-theme='light']) .mobile-controls {
    background: rgba(255, 255, 255, 0.55);
  }
</style>
