<script lang="ts">
  import { getRandomColor, hexToRgb } from '$lib/utils/MathUtils';
  import CyberButton from '$lib/components/CyberButton.svelte';
  import CyberCheckbox from '$lib/components/CyberCheckbox.svelte';
  import CyberSelect from '$lib/components/CyberSelect.svelte';
  import CyberNumericInput from '$lib/components/CyberNumericInput.svelte';
  import CyberTextInput from '$lib/components/CyberTextInput.svelte';
  import CyberSquareButton from '$lib/components/CyberSquareButton.svelte';
  import CyberAccordion from '$lib/components/CyberAccordion.svelte';
  import HelpModal from '$lib/components/HelpModal.svelte';
  import AboutModal from '$lib/components/AboutModal.svelte';
  import SavePresetModal from '$lib/components/SavePresetModal.svelte';
  import { fallingLetters } from '$lib/utils/FallingLettersAction';
  import { signalMorph } from '$lib/utils/Transitions';
  import { COLORS } from '$lib/constants/matrix';
  import { PRESETS } from '$lib/constants/presets';
  import { saveCustomPreset, loadCustomPresets } from '$lib/utils/StorageUtils';
  import { compareSettings } from '$lib/utils/SettingsUtils';
  import type { IEngineSettings, IPreset } from '$lib/types';

  interface Props {
    settings: IEngineSettings;
    onStartNormal: () => void;
    onStartSquare: () => void;
  }

  /* eslint-disable prefer-const */
  let { settings = $bindable(), onStartNormal, onStartSquare }: Props = $props();
  /* eslint-enable prefer-const */

  let menuInterval: ReturnType<typeof setInterval> | null = null;
  let discoColors = $state(getRandomColors());
  let cachedRandomColor = $state(getRandomColor());
  let lastChosenColor = $state(settings.chosenColor);
  let isHelpOpen = $state(false);
  let isAboutOpen = $state(false);
  let isConfigOpen = $state(false);
  let isSaveModalOpen = $state(false);

  // Preset state
  const CUSTOM_PRESET_NAME = 'CUSTOM';
  let selectedPresetName = $state(PRESETS[0].name);
  let customPresets = $state(loadCustomPresets());
  const allPresets = $derived([...PRESETS, ...customPresets]);
  const presetOptions = $derived([...allPresets.map((p) => p.name), CUSTOM_PRESET_NAME]);

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
    if (settings.discoOn) {
      return discoColors[0] || COLORS.MATRIX_GREEN;
    }
    if (settings.chosenColor === 'random') {
      return cachedRandomColor || COLORS.MATRIX_GREEN;
    }
    return colorMap[settings.chosenColor] ?? COLORS.MATRIX_GREEN;
  });

  const currentColorRgb = $derived(hexToRgb(currentColor));

  // Safe button colors with fallbacks
  const startBtnColor = $derived(settings.discoOn ? discoColors[1] || currentColor : currentColor);
  const squareBtnColor = $derived(settings.discoOn ? discoColors[2] || currentColor : currentColor);
  const helpBtnColor = $derived(settings.discoOn ? discoColors[3] || currentColor : currentColor);
  const aboutBtnColor = $derived(settings.discoOn ? discoColors[4] || currentColor : currentColor);

  // Auto-detect preset based on current settings
  $effect(() => {
    const match = allPresets.find((p) => compareSettings(p.settings, settings));
    if (match) {
      selectedPresetName = match.name;
    } else {
      selectedPresetName = CUSTOM_PRESET_NAME;
    }
  });

  $effect(() => {
    if (settings.chosenColor === 'random' && lastChosenColor !== 'random') {
      cachedRandomColor = getRandomColor();
    }
    lastChosenColor = settings.chosenColor;
  });

  $effect(() => {
    if (settings.discoOn) {
      menuInterval = setInterval(() => {
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

  function handlePresetChange(name: string) {
    if (name === CUSTOM_PRESET_NAME) {
      return;
    }
    const preset = allPresets.find((p) => p.name === name);
    if (preset) {
      settings = { ...preset.settings };
    }
  }

  function handleSavePreset() {
    isSaveModalOpen = true;
  }

  function confirmSavePreset(name: string) {
    const newPreset: IPreset = { name, settings: $state.snapshot(settings) };
    saveCustomPreset(newPreset);
    customPresets = loadCustomPresets();
  }

  const transitionDuration =
    (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') ||
    (typeof window !== 'undefined' && (window as unknown as { IS_E2E: boolean }).IS_E2E)
      ? 0
      : 400;
</script>

<div
  class="menu-container"
  style:--theme-color={currentColor}
  style:--theme-color-rgb={currentColorRgb}
>
  <div class="hud-frame">
    <h1 class="fade-in">DIGITAL RAIN</h1>

    <div class="menu-controls fade-in">
      <div class="main-actions">
        <CyberButton color={startBtnColor} onclick={onStartNormal} variant="primary">
          START
        </CyberButton>

        <CyberButton color={squareBtnColor} onclick={onStartSquare} variant="secondary">
          SQUARE
        </CyberButton>

        <CyberButton color={helpBtnColor} onclick={() => (isHelpOpen = true)} variant="primary">
          HELP
        </CyberButton>

        <CyberButton color={aboutBtnColor} onclick={() => (isAboutOpen = true)} variant="secondary">
          ABOUT
        </CyberButton>
      </div>

      <CyberAccordion title="SYSTEM_CONFIGURATION" bind:isOpen={isConfigOpen} color={currentColor}>
        <div class="settings-grid">
          <div class="setting-item preset-group">
            <div class="preset-wrapper">
              <div class="transition-stack">
                {#key selectedPresetName}
                  <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                    <CyberSelect
                      id="preset-select"
                      bind:value={selectedPresetName}
                      color={currentColor}
                      label="PRESET:"
                      options={presetOptions}
                      onchange={handlePresetChange}
                    />
                  </div>
                {/key}
              </div>
              <div class="save-btn-container">
                <CyberSquareButton
                  color={currentColor}
                  onclick={handleSavePreset}
                  title="SAVE_PRESET"
                >
                  S
                </CyberSquareButton>
              </div>
            </div>
          </div>

          <div class="setting-item">
            <div class="transition-stack">
              {#if settings.discoOn}
                {#key settings.frameCount}
                  <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                    <CyberNumericInput
                      id="frame-count"
                      bind:value={settings.frameCount}
                      min={1}
                      max={100}
                      color={currentColor}
                      label="REFRESH_RATE:"
                    />
                  </div>
                {/key}
              {:else}
                {#key settings.chosenColor}
                  <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                    <CyberSelect
                      id="color-select"
                      bind:value={settings.chosenColor}
                      color={currentColor}
                      label="SYSTEM_COLOR:"
                      options={[
                        'green',
                        'red',
                        'yellow',
                        'blue',
                        'orange',
                        'pink',
                        'cyan',
                        'random',
                      ]}
                    />
                  </div>
                {/key}
              {/if}
            </div>
          </div>

          <div class="setting-item">
            <div class="transition-stack">
              {#key settings.fontSize}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberNumericInput
                    id="font-size"
                    bind:value={settings.fontSize}
                    min={8}
                    max={100}
                    color={currentColor}
                    label="FONT_SIZE:"
                  />
                </div>
              {/key}
            </div>
          </div>

          <div class="setting-item">
            <div class="transition-stack">
              {#key settings.speed}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberNumericInput
                    id="speed"
                    bind:value={settings.speed}
                    min={1}
                    max={200}
                    color={currentColor}
                    label="SPEED:"
                  />
                </div>
              {/key}
            </div>
          </div>

          <div class="setting-item">
            <div class="transition-stack">
              {#key settings.intensity}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberNumericInput
                    id="intensity"
                    bind:value={settings.intensity}
                    min={10}
                    max={300}
                    color={currentColor}
                    label="RAIN_DENSITY:"
                  />
                </div>
              {/key}
            </div>
          </div>

          <div class="setting-item">
            <div class="transition-stack">
              {#key settings.charSet}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberSelect
                    id="charset-select"
                    bind:value={settings.charSet}
                    color={currentColor}
                    label="CHARACTER_SET:"
                    options={['katakana', 'latin', 'binary', 'hex', 'braille', 'custom']}
                  />
                </div>
              {/key}
            </div>
          </div>

          {#if settings.charSet === 'custom'}
            <div class="setting-item">
              <div class="transition-stack">
                {#key settings.customCharSet}
                  <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                    <CyberTextInput
                      id="custom-charset-input"
                      bind:value={settings.customCharSet}
                      color={currentColor}
                      label="CUSTOM_CHARSET:"
                      placeholder="ENTER_CHARACTERS..."
                    />
                  </div>
                {/key}
              </div>
            </div>
          {/if}

          <div
            class="setting-item"
            use:fallingLetters={{ value: settings.all4Directions, color: currentColor }}
          >
            <div class="transition-stack">
              {#key settings.all4Directions}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberCheckbox
                    id="all4-toggle"
                    bind:checked={settings.all4Directions}
                    color={currentColor}
                    label="ALL_4_DIRECTIONS:"
                  />
                </div>
              {/key}
            </div>
          </div>

          <div
            class="setting-item"
            use:fallingLetters={{ value: settings.discoOn, color: currentColor }}
          >
            <div class="transition-stack">
              {#key settings.discoOn}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberCheckbox
                    id="disco-toggle"
                    bind:checked={settings.discoOn}
                    color={currentColor}
                    label="DISCO_MODE:"
                  />
                </div>
              {/key}
            </div>
          </div>

          <div
            class="setting-item"
            use:fallingLetters={{ value: settings.perStringColor, color: currentColor }}
          >
            <div class="transition-stack">
              {#key settings.perStringColor}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberCheckbox
                    id="multi-color-toggle"
                    bind:checked={settings.perStringColor}
                    color={currentColor}
                    label="MULTI_COLOR:"
                  />
                </div>
              {/key}
            </div>
          </div>

          <div
            class="setting-item"
            use:fallingLetters={{ value: settings.waveDistortion, color: currentColor }}
          >
            <div class="transition-stack">
              {#key settings.waveDistortion}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberCheckbox
                    id="wave-distortion-toggle"
                    bind:checked={settings.waveDistortion}
                    color={currentColor}
                    label="WAVE_DISTORTION:"
                  />
                </div>
              {/key}
            </div>
          </div>
        </div>
      </CyberAccordion>
    </div>
  </div>
</div>

<HelpModal isOpen={isHelpOpen} onClose={() => (isHelpOpen = false)} color={currentColor} />
<AboutModal isOpen={isAboutOpen} onClose={() => (isAboutOpen = false)} color={currentColor} />
<SavePresetModal
  isOpen={isSaveModalOpen}
  onClose={() => (isSaveModalOpen = false)}
  onSave={confirmSavePreset}
  color={currentColor}
/>

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
    width: 90%;
    max-width: 800px;
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

  .main-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    justify-content: center;
  }

  @media (min-width: 600px) {
    .main-actions {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 2rem;
    font-family: var(--font-mono);
    font-size: 0.9rem;
  }

  @media (min-width: 700px) {
    .settings-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .setting-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    justify-content: flex-start;
    width: 100%;
    min-height: 70px;
  }

  .transition-stack {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    width: 200px;
    height: 70px;
    position: relative;
  }

  .stack-item {
    grid-area: 1 / 1;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .preset-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
  }

  .save-btn-container {
    margin-top: 24px;
    display: flex;
    height: 42px;
    align-items: center;
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
