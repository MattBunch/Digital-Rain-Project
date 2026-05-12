<script lang="ts">
  import { getRandomColor, hexToRgb } from '$lib/utils/MathUtils';
  import CyberButton from '$lib/components/CyberButton.svelte';
  import CyberCheckbox from '$lib/components/CyberCheckbox.svelte';
  import CyberSelect from '$lib/components/CyberSelect.svelte';
  import CyberNumericInput from '$lib/components/CyberNumericInput.svelte';
  import HelpModal from '$lib/components/HelpModal.svelte';
  import AboutModal from '$lib/components/AboutModal.svelte';
  import { fallingLetters } from '$lib/utils/FallingLettersAction';
  import { signalMorph } from '$lib/utils/Transitions';
  import { COLORS } from '$lib/constants/matrix';

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
  let cachedRandomColor = $state(getRandomColor());
  let lastChosenColor = $state(chosenColor);
  let isHelpOpen = $state(false);
  let isAboutOpen = $state(false);

  const colorMap: Record<string, string> = {
    green: COLORS.MATRIX_GREEN,
    red: COLORS.RED_VARIANTS[2],
    yellow: COLORS.YELLOW_VARIANTS[2],
    blue: COLORS.BLUE_VARIANTS[2],
    orange: COLORS.ORANGE_VARIANTS[2],
    pink: COLORS.PINK_VARIANTS[2],
    cyan: COLORS.CYAN_VARIANTS[2],
  };

  const currentColor = $derived.by(() => {
    if (discoOn) {
      return discoColors[0] || COLORS.MATRIX_GREEN;
    }
    if (chosenColor === 'random') {
      return cachedRandomColor || COLORS.MATRIX_GREEN;
    }
    return colorMap[chosenColor] ?? COLORS.MATRIX_GREEN;
  });

  const currentColorRgb = $derived(hexToRgb(currentColor));

  // Safe button colors with fallbacks
  const startBtnColor = $derived(discoOn ? discoColors[1] || currentColor : currentColor);
  const squareBtnColor = $derived(discoOn ? discoColors[2] || currentColor : currentColor);
  const helpBtnColor = $derived(discoOn ? discoColors[3] || currentColor : currentColor);
  const aboutBtnColor = $derived(discoOn ? discoColors[4] || currentColor : currentColor);

  $effect(() => {
    if (chosenColor === 'random' && lastChosenColor !== 'random') {
      cachedRandomColor = getRandomColor();
    }
    lastChosenColor = chosenColor;
  });

  $effect(() => {
    if (discoOn) {
      // console.log('[SettingsMenu] Disco Mode ON. Current colors:', $state.snapshot(discoColors));

      const invalidColors = discoColors.filter(
        (c) => !c || typeof c !== 'string' || !c.startsWith('#'),
      );
      if (invalidColors.length > 0) {
        console.error('[SettingsMenu] CRITICAL: Invalid disco colors detected!', {
          allColors: $state.snapshot(discoColors),
          invalidCount: invalidColors.length,
          invalidValues: invalidColors,
        });
      }
    }
  });

  $effect(() => {
    if (discoOn) {
      menuInterval = setInterval(() => {
        // Reassign the array for cleaner Svelte 5 reactivity
        discoColors = getRandomColors();
      }, 1000);
    } else {
      if (menuInterval) {
        clearInterval(menuInterval);
        menuInterval = null;
      }
    }
    return () => {
      if (menuInterval) {
        clearInterval(menuInterval);
        menuInterval = null;
      }
    };
  });

  function getRandomColors(count = 5) {
    return Array.from({ length: count }, () => getRandomColor());
  }
</script>

<div
  class="menu-container"
  style:--theme-color={currentColor}
  style:--theme-color-rgb={currentColorRgb}
>
  <div class="hud-frame">
    <h1 class="fade-in">DIGITAL RAIN</h1>

    <div class="menu-controls fade-in">
      <div class="control-group">
        <CyberButton color={startBtnColor} onclick={onStartNormal} variant="primary">
          START
        </CyberButton>

        <CyberButton color={squareBtnColor} onclick={onStartSquare} variant="secondary">
          SQUARE
        </CyberButton>
      </div>

      <div class="control-group">
        <CyberButton color={helpBtnColor} onclick={() => (isHelpOpen = true)} variant="primary">
          HELP
        </CyberButton>
        <CyberButton color={aboutBtnColor} onclick={() => (isAboutOpen = true)} variant="secondary">
          ABOUT
        </CyberButton>
      </div>

      <div class="settings-grid">
        <div class="setting-item">
          {#if discoOn}
            <div
              class="glitch-wrapper"
              in:signalMorph={{ duration: 400 }}
              out:signalMorph={{ duration: 200 }}
            >
              <div class="component-wrapper">
                <CyberNumericInput
                  id="frame-count"
                  bind:value={frameCount}
                  min={1}
                  max={100}
                  color={currentColor}
                  label="REFRESH_RATE:"
                />
              </div>
            </div>
          {:else}
            <div
              class="glitch-wrapper"
              in:signalMorph={{ duration: 400 }}
              out:signalMorph={{ duration: 200 }}
            >
              <div class="component-wrapper">
                <CyberSelect
                  id="color-select"
                  bind:value={chosenColor}
                  color={currentColor}
                  label="SYSTEM_COLOR:"
                  options={['green', 'red', 'yellow', 'blue', 'orange', 'pink', 'cyan', 'random']}
                />
              </div>
            </div>
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
<AboutModal isOpen={isAboutOpen} onClose={() => (isAboutOpen = false)} color={currentColor} />

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
    border: 1px solid rgba(var(--theme-color-rgb), 0.3);
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
    display: grid;
    grid-template-areas: 'stack';
    align-items: center;
    min-height: 80px;
    justify-content: flex-end;
  }

  .setting-item:nth-child(n + 2) {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-height: 70px;
    justify-content: flex-end;
  }

  .glitch-wrapper {
    grid-area: stack;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    position: relative;
  }

  .component-wrapper {
    width: 100%;
    display: flex;
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
