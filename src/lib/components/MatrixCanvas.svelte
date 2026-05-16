<script lang="ts">
  import { canvasSetup } from '$lib/utils/CoordinateUtils';
  import type { CoreEngine } from '$lib/engine/CoreEngine';

  /* eslint-disable prefer-const, no-useless-assignment */
  let {
    engine,
    mode,
    onReturn,
    discoOn = $bindable(false),
    chosenColor = $bindable('green'),
    all4Directions = $bindable(false),
    all8Directions = $bindable(false),
  } = $props<{
    engine: CoreEngine;
    mode: 'normal' | 'square';
    onReturn: () => void;
    discoOn: boolean;
    chosenColor: string;
    all4Directions: boolean;
    all8Directions: boolean;
  }>();
  /* eslint-enable prefer-const, no-useless-assignment */

  let canvas: HTMLCanvasElement;

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape':
        onReturn();
        break;
      case 'ArrowLeft':
        if (engine.squareAnimationOn) {
          engine.moveSquareLeft(false);
        } else {
          arrowDirectionControl('west', 'east');
        }
        break;
      case 'ArrowUp':
        if (engine.squareAnimationOn) {
          engine.moveSquareUp(false);
        } else {
          arrowDirectionControl('north', 'south');
        }
        break;
      case 'ArrowRight':
        if (engine.squareAnimationOn) {
          engine.moveSquareRight(false);
        } else {
          arrowDirectionControl('east', 'west');
        }
        break;
      case 'ArrowDown':
        if (engine.squareAnimationOn) {
          engine.moveSquareDown(false);
        } else {
          arrowDirectionControl('south', 'north');
        }
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
        arrowDirectionControl('northwest', 'southeast');
        break;
      case 'u':
        arrowDirectionControl('northeast', 'southwest');
        break;
      case 'b':
        arrowDirectionControl('southwest', 'northeast');
        break;
      case 'n':
        arrowDirectionControl('southeast', 'northwest');
        break;
      default:
        break;
    }
  }

  function arrowDirectionControl(newDirection: string, oppositeDirection: string): void {
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

      const handleResize = () => {
        setup();
        engine.resetWordsArray();
      };

      window.addEventListener('resize', handleResize);

      return () => {
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
></canvas>

<style>
  canvas {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
  }
</style>
