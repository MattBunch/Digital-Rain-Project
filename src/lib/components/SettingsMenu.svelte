<script lang="ts">
  import { getRandomColor } from '$lib/utils/MathUtils';
  import {
    colorMatrixGreen,
    colorRed,
    colorYellow,
    colorBlue,
    colorOrange,
    colorPink,
    colorCyan,
  } from '$lib/constants/Assets';

  interface Props {
    discoOn?: boolean;
    chosenColor?: string;
    all4Directions?: boolean;
    frameCount?: number;
    onStartNormal: () => void;
    onStartSquare: () => void;
  }

  /* eslint-disable prefer-const */
  let {
    discoOn = $bindable(false),
    chosenColor = $bindable('green'),
    all4Directions = $bindable(false),
    frameCount = $bindable(10),
    onStartNormal,
    onStartSquare,
  }: Props = $props();
  /* eslint-enable prefer-const */

  let menuInterval: ReturnType<typeof setInterval> | null = null;
  let discoColors = $state([getRandomColor(), getRandomColor(), getRandomColor()]);
  let cachedRandomColor = getRandomColor();
  let lastChosenColor = chosenColor;

  const colorMap: Record<string, string> = {
    green: colorMatrixGreen,
    red: colorRed,
    yellow: colorYellow,
    blue: colorBlue,
    orange: colorOrange,
    pink: colorPink,
    cyan: colorCyan,
  };

  const currentColor = $derived.by(() => {
    if (discoOn) {
      return discoColors[0];
    }
    if (chosenColor === 'random') {
      if (lastChosenColor !== 'random') {
        cachedRandomColor = getRandomColor();
      }
      lastChosenColor = chosenColor;
      return cachedRandomColor;
    }
    lastChosenColor = chosenColor;
    return colorMap[chosenColor] ?? colorMatrixGreen;
  });

  $effect(() => {
    if (discoOn) {
      menuInterval = setInterval(() => {
        discoColors = [getRandomColor(), getRandomColor(), getRandomColor()];
      }, 1000);
    } else {
      if (menuInterval) {
        clearInterval(menuInterval);
      }
    }
    return () => {
      if (menuInterval) {
        clearInterval(menuInterval);
      }
    };
  });

  async function showHelp() {
    const { helpText } = await import('$lib/constants/Assets');
    alert(helpText);
  }

  const all4DirectionsLabel = $derived(`All 4 Directions:\n${all4Directions ? 'ON' : 'OFF'}`);
</script>

<div class="menu-container" style:color={currentColor}>
  <h1 class="fade-in">DIGITAL RAIN</h1>

  <div class="menu-controls fade-in">
    <div class="control-group">
      <button
        class="menu-button"
        style:border-color={currentColor}
        style:color={discoOn ? discoColors[1] : currentColor}
        onclick={() => onStartNormal()}
      >
        START
      </button>

      <button
        class="menu-button"
        style:border-color={currentColor}
        style:color={discoOn ? discoColors[2] : currentColor}
        onclick={() => onStartSquare()}
      >
        SQUARE
      </button>
    </div>

    <div class="control-group">
      <button
        class="menu-button all4-button"
        style:border-color={currentColor}
        style:background-color={all4Directions
          ? discoOn
            ? discoColors[0]
            : currentColor
          : 'black'}
        style:color={all4Directions ? 'black' : discoOn ? discoColors[1] : currentColor}
        onclick={() => (all4Directions = !all4Directions)}
      >
        {all4DirectionsLabel}
      </button>

      <button
        class="menu-button"
        style:border-color={currentColor}
        style:color={discoOn ? discoColors[2] : currentColor}
        onclick={showHelp}
      >
        HELP
      </button>
    </div>

    <div class="settings-grid">
      <label id="colorsLabel" style:display={discoOn ? 'none' : 'inline-block'}>
        Colors:
        <select
          bind:value={chosenColor}
          style:border-color={currentColor}
          style:color={currentColor}
        >
          <option value="green">Green</option>
          <option value="red">Red</option>
          <option value="yellow">Yellow</option>
          <option value="blue">Blue</option>
          <option value="orange">Orange</option>
          <option value="pink">Pink</option>
          <option value="cyan">Cyan</option>
          <option value="random">Random</option>
        </select>
      </label>

      {#if discoOn}
        <label class="fade-in">
          Frame Count:
          <input
            type="number"
            bind:value={frameCount}
            min="1"
            max="100"
            style:border-color={currentColor}
            style:color={currentColor}
            style:background-color={discoColors[1]}
          />
        </label>
      {/if}

      <label>
        Disco:
        <input type="checkbox" bind:checked={discoOn} />
      </label>
    </div>
  </div>
</div>

<style>
  .menu-container {
    text-align: center;
    background-color: black;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Consolas', 'Lucida Console', monospace;
  }

  h1 {
    font-size: 5rem;
    margin-bottom: 2rem;
    letter-spacing: 0.5rem;
  }

  .menu-controls {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .control-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .menu-button {
    background: black;
    border: 1px solid;
    padding: 10px 20px;
    font-size: 1.2rem;
    cursor: pointer;
    min-width: 150px;
    transition: all 0.2s;
    font-family: inherit;
    white-space: pre-wrap;
  }

  .menu-button:hover {
    filter: brightness(1.2);
  }

  .settings-grid {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }

  select,
  input[type='number'] {
    background: black;
    border: 1px solid;
    padding: 5px;
    font-family: inherit;
  }

  .fade-in {
    animation: fadeIn 2s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .all4-button {
    line-height: 1.2;
  }
</style>
