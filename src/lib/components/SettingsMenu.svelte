<script lang="ts">
  import { getRandomColor } from '$lib/utils/MathUtils';
  import CyberButton from '$lib/components/CyberButton.svelte';
  import CyberCheckbox from '$lib/components/CyberCheckbox.svelte';
  import CyberSelect from '$lib/components/CyberSelect.svelte';
  import CyberNumericInput from '$lib/components/CyberNumericInput.svelte';
  import HelpModal from '$lib/components/HelpModal.svelte';
  import { fallingLetters } from '$lib/utils/FallingLettersAction';
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
  let discoColors = $state(getRandomColors());
  let cachedRandomColor = getRandomColor();
  let lastChosenColor = chosenColor;
  let isHelpOpen = $state(false);

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
        discoColors = getRandomColors();
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

  function showHelp() {
    isHelpOpen = true;
  }

  function getRandomColors(count = 5) {
    return Array.from({ length: count }, () => getRandomColor());
  }
</script>

<div class="menu-container" style:--theme-color={currentColor}>
  <div class="hud-frame">
    <h1 class="fade-in">DIGITAL RAIN</h1>

    <div class="menu-controls fade-in">
      <div class="control-group">
        <CyberButton
          color={discoOn ? discoColors[1] : currentColor}
          onclick={onStartNormal}
          variant="primary"
        >
          START
        </CyberButton>

        <CyberButton
          color={discoOn ? discoColors[2] : currentColor}
          onclick={onStartSquare}
          variant="secondary"
        >
          SQUARE
        </CyberButton>
      </div>

      <div class="control-group">
        <CyberButton
          color={discoOn ? discoColors[3] : currentColor}
          onclick={showHelp}
          variant="primary"
        >
          HELP
        </CyberButton>
      </div>

      <div class="settings-grid">
        <div class="setting-item">
          {#if discoOn}
            <div class="fade-in">
              <CyberNumericInput
                id="frame-count"
                bind:value={frameCount}
                min={1}
                max={100}
                color={currentColor}
                label="REFRESH_RATE:"
              />
            </div>
          {:else}
            <CyberSelect
              id="color-select"
              bind:value={chosenColor}
              color={currentColor}
              label="SYSTEM_COLOR:"
              options={['green', 'red', 'yellow', 'blue', 'orange', 'pink', 'cyan', 'random']}
            />
          {/if}
        </div>

        <div
          class="setting-item"
          use:fallingLetters={{ value: all4Directions, color: currentColor }}
        >
          <CyberCheckbox
            id="all4-toggle"
            bind:checked={all4Directions}
            color={currentColor}
            label="ALL_4_DIRECTIONS:"
          />
        </div>

        <div class="setting-item" use:fallingLetters={{ value: discoOn, color: currentColor }}>
          <CyberCheckbox
            id="disco-toggle"
            bind:checked={discoOn}
            color={currentColor}
            label="DISCO_MODE:"
          />
        </div>
      </div>
    </div>
  </div>
</div>

<HelpModal isOpen={isHelpOpen} onClose={() => (isHelpOpen = false)} color={currentColor} />

<style>
  .menu-container {
    text-align: center;
    background-color: transparent;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--theme-color);
  }

  .hud-frame {
    padding: 3rem;
    border: 1px solid rgba(var(--theme-color), 0.3);
    background: rgba(0, 0, 0, 0.8);
    position: relative;
    backdrop-filter: blur(5px);
  }

  .hud-frame::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 20px;
    height: 20px;
    border-top: 2px solid var(--theme-color);
    border-left: 2px solid var(--theme-color);
  }

  .hud-frame::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    border-bottom: 2px solid var(--theme-color);
    border-right: 2px solid var(--theme-color);
  }

  h1 {
    font-family: var(--font-title);
    font-size: 5rem;
    margin-bottom: 2rem;
    letter-spacing: 0.5rem;
    text-shadow:
      2px 0 #ff003c,
      -2px 0 #00e5ff,
      0 0 10px var(--theme-color);
  }

  .menu-controls {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .control-group {
    display: flex;
    gap: 1.5rem;
    justify-content: center;
  }

  .settings-grid {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-end;
    font-family: var(--font-mono);
    font-size: 0.9rem;
  }

  .setting-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-height: 70px; /* Prevent layout shifting */
    justify-content: flex-end;
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

  :global(.active) {
    background: var(--theme-color) !important;
    color: black !important;
  }
</style>
