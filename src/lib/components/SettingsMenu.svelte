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
  import { glitchClick } from '$lib/utils/GlitchAction';
  import { signalMorph } from '$lib/utils/Transitions';
  import { COLORS } from '$lib/constants/matrix';
  import { PRESETS } from '$lib/constants/presets';
  import { saveCustomPreset, loadCustomPresets } from '$lib/utils/StorageUtils';
  import { compareSettings } from '$lib/utils/SettingsUtils';
  import type { IEngineSettings, IPreset, ThemeMode } from '$lib/types';

  interface Props {
    settings: IEngineSettings;
    themeMode: ThemeMode;
    discoColors?: string[];
    onStartNormal: () => void;
    onStartSquare: () => void;
  }

  /* eslint-disable prefer-const */
  let {
    settings = $bindable(),
    themeMode = $bindable('system'),
    discoColors = [
      COLORS.MATRIX_GREEN,
      COLORS.RED_VARIANTS[2],
      COLORS.YELLOW_VARIANTS[2],
      COLORS.BLUE_VARIANTS[2],
      COLORS.CYAN_VARIANTS[2],
    ],
    onStartNormal,
    onStartSquare,
  }: Props = $props();
  /* eslint-enable prefer-const */

  let cachedRandomColor = $state(getRandomColor());
  let lastChosenColor = $state(settings.chosenColor);
  let isHelpOpen = $state(false);
  let isAboutOpen = $state(false);
  let isConfigOpen = $state(false);
  let isSaveModalOpen = $state(false);
  const numericStepEffectKeys = $state({
    frameCount: 0,
    fontSize: 0,
    speed: 0,
    intensity: 0,
  });

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

  function triggerNumericStepEffect(field: keyof typeof numericStepEffectKeys) {
    numericStepEffectKeys[field] += 1;
  }

  function confirmSavePreset(name: string) {
    const newPreset: IPreset = { name, settings: $state.snapshot(settings) };
    saveCustomPreset(newPreset);
    customPresets = loadCustomPresets();
  }

  function handleBackHome(event: MouseEvent) {
    event.preventDefault();
    window.location.assign('/');
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
    <a
      class="back-link"
      href="/"
      title="BACK_HOME"
      aria-label="BACK_HOME"
      onclick={handleBackHome}
      use:glitchClick
    >
      <span class="back-glitch-layer" aria-hidden="true">‹</span>
      <span class="back-icon" aria-hidden="true">‹</span>
      <span class="back-glitch-layer" aria-hidden="true">‹</span>
    </a>

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
              {#key themeMode}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberSelect
                    id="theme-mode-select"
                    bind:value={themeMode}
                    color={currentColor}
                    label="DISPLAY_MODE:"
                    options={['system', 'dark', 'light']}
                  />
                </div>
              {/key}
            </div>
          </div>

          <div class="setting-item">
            <div class="transition-stack">
              {#key settings.discoOn}
                <div
                  class="stack-item mode-swap"
                  data-testid="system-mode-swap"
                  transition:signalMorph={{
                    duration: transitionDuration === 0 ? 0 : 550,
                    jitterX: 18,
                    jitterY: 4,
                    blur: 6,
                    brightness: 0.9,
                    shadowDistance: 14,
                  }}
                >
                  {#if settings.discoOn}
                    {#key numericStepEffectKeys.frameCount}
                      <div
                        class="stack-item"
                        data-testid="frame-count-step-effect"
                        transition:signalMorph={{ duration: transitionDuration }}
                      >
                        <CyberNumericInput
                          id="frame-count"
                          bind:value={settings.frameCount}
                          min={1}
                          max={100}
                          color={currentColor}
                          label="REFRESH_RATE:"
                          onstep={() => triggerNumericStepEffect('frameCount')}
                        />
                      </div>
                    {/key}
                  {:else}
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
                  {/if}
                </div>
              {/key}
            </div>
          </div>

          <div class="setting-item">
            <div class="transition-stack">
              {#key numericStepEffectKeys.fontSize}
                <div
                  class="stack-item"
                  data-testid="font-size-step-effect"
                  transition:signalMorph={{ duration: transitionDuration }}
                >
                  <CyberNumericInput
                    id="font-size"
                    bind:value={settings.fontSize}
                    min={8}
                    max={100}
                    color={currentColor}
                    label="FONT_SIZE:"
                    onstep={() => triggerNumericStepEffect('fontSize')}
                  />
                </div>
              {/key}
            </div>
          </div>

          <div class="setting-item">
            <div class="transition-stack">
              {#key numericStepEffectKeys.speed}
                <div
                  class="stack-item"
                  data-testid="speed-step-effect"
                  transition:signalMorph={{ duration: transitionDuration }}
                >
                  <CyberNumericInput
                    id="speed"
                    bind:value={settings.speed}
                    min={1}
                    max={200}
                    color={currentColor}
                    label="SPEED:"
                    onstep={() => triggerNumericStepEffect('speed')}
                  />
                </div>
              {/key}
            </div>
          </div>

          <div class="setting-item">
            <div class="transition-stack">
              {#key numericStepEffectKeys.intensity}
                <div
                  class="stack-item"
                  data-testid="intensity-step-effect"
                  transition:signalMorph={{ duration: transitionDuration }}
                >
                  <CyberNumericInput
                    id="intensity"
                    bind:value={settings.intensity}
                    min={10}
                    max={300}
                    color={currentColor}
                    label="RAIN_DENSITY:"
                    onstep={() => triggerNumericStepEffect('intensity')}
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

          <div
            class="setting-item"
            use:fallingLetters={{ value: settings.mouseInteractionMode, color: currentColor }}
          >
            <div class="transition-stack">
              {#key settings.mouseInteractionMode}
                <div class="stack-item" transition:signalMorph={{ duration: transitionDuration }}>
                  <CyberSelect
                    id="mouse-interaction-select"
                    bind:value={settings.mouseInteractionMode}
                    color={currentColor}
                    label="MOUSE_FIELD:"
                    options={['off', 'repel', 'attract']}
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
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem 0.75rem;
    color: var(--control-text);
    overflow-x: hidden;
  }

  .hud-frame {
    padding: 1.5rem;
    border: 1px solid rgba(var(--theme-color-rgb), var(--theme-border-alpha));
    background-color: var(--panel-bg);
    position: relative;
    backdrop-filter: blur(5px);
    width: 90%;
    max-width: 800px;
    box-sizing: border-box;
  }

  .back-link {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 2;
    width: 38px;
    min-width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid rgba(var(--theme-color-rgb), var(--theme-border-strong-alpha));
    background:
      linear-gradient(135deg, rgba(var(--theme-color-rgb), 0.12), transparent 42%),
      var(--control-bg);
    color: var(--control-text);
    opacity: 0.72;
    text-decoration: none;
    font-family: var(--font-mono);
    font-size: 1.7rem;
    font-weight: 700;
    line-height: 1;
    box-shadow:
      inset 0 0 8px rgba(var(--theme-color-rgb), 0.12),
      0 0 0 rgba(var(--theme-color-rgb), 0);
    transition:
      border-color 0.16s ease,
      box-shadow 0.16s ease,
      color 0.16s ease,
      opacity 0.16s ease,
      transform 0.16s ease;
  }

  .back-link::before {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 4px,
      rgba(var(--theme-color-rgb), 0.24) 5px
    );
    opacity: 0;
    transform: translateY(-100%);
  }

  .back-link:hover,
  .back-link:focus-visible {
    border-color: var(--theme-color);
    color: var(--control-inverse-text);
    opacity: 1;
    outline: none;
    transform: translateY(-1px);
    box-shadow:
      0 0 14px rgba(var(--theme-color-rgb), 0.86),
      inset 0 0 12px rgba(var(--theme-color-rgb), 0.34);
  }

  .back-link:hover::before,
  .back-link:focus-visible::before {
    opacity: 1;
    animation: backScanline 0.42s steps(5, end) infinite;
  }

  .back-link:active {
    transform: translate(1px, 1px) skewX(-7deg);
    filter: brightness(1.35) contrast(1.15);
  }

  .back-icon,
  .back-glitch-layer {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .back-icon {
    z-index: 1;
    text-shadow: 0 0 8px var(--theme-color);
  }

  .back-glitch-layer {
    z-index: 0;
    opacity: 0;
  }

  .back-glitch-layer:nth-child(1) {
    color: #ff003c;
    clip-path: polygon(0 0, 100% 0, 100% 42%, 0 42%);
  }

  .back-glitch-layer:nth-child(3) {
    color: #00e5ff;
    clip-path: polygon(0 58%, 100% 58%, 100% 100%, 0 100%);
  }

  .back-link:hover .back-glitch-layer,
  .back-link:focus-visible .back-glitch-layer {
    opacity: 0.95;
    animation: backGlitch 0.28s infinite;
  }

  .back-link:hover .back-glitch-layer:nth-child(1),
  .back-link:focus-visible .back-glitch-layer:nth-child(1) {
    transform: translate(-2px, -1px);
  }

  .back-link:hover .back-glitch-layer:nth-child(3),
  .back-link:focus-visible .back-glitch-layer:nth-child(3) {
    transform: translate(2px, 1px);
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
    font-size: clamp(2.35rem, 12vw, 5rem);
    margin-bottom: 1rem;
    letter-spacing: clamp(0.08rem, 1.1vw, 0.5rem);
    text-shadow:
      2px 0 #ff003c,
      -2px 0 #00e5ff,
      0 0 10px var(--theme-color);
  }

  .menu-controls {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .main-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
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
    gap: 0.875rem 1rem;
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
    gap: 0.75rem;
    justify-content: flex-start;
    width: 100%;
    min-height: 60px;
  }

  .transition-stack {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    width: min(100%, 200px);
    height: 60px;
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
    gap: 0.75rem;
    width: 100%;
  }

  .save-btn-container {
    margin-top: 20px;
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

  @keyframes backGlitch {
    0% {
      filter: none;
    }
    20% {
      filter: blur(1px) brightness(1.4);
    }
    45% {
      filter: none;
    }
    65% {
      filter: contrast(1.35);
    }
    100% {
      filter: none;
    }
  }

  @keyframes backScanline {
    from {
      transform: translateY(-100%);
    }
    to {
      transform: translateY(100%);
    }
  }

  :global(.active) {
    background: var(--theme-color) !important;
    color: var(--control-inverse-text) !important;
  }

  :global(:root[data-theme='light']) .hud-frame {
    box-shadow:
      0 18px 48px var(--shadow-color),
      inset 0 0 28px rgba(42, 94, 84, 0.06);
  }

  :global(:root[data-theme='light']) h1 {
    color: #17201d;
    text-shadow:
      1px 0 rgba(188, 42, 72, 0.45),
      -1px 0 rgba(0, 107, 128, 0.38),
      0 0 14px rgba(var(--theme-color-rgb), 0.28);
  }

  :global(:root[data-theme='light']) .back-link:hover,
  :global(:root[data-theme='light']) .back-link:focus-visible {
    background: rgba(20, 23, 22, 0.08);
    color: #111514;
  }

  @media (max-width: 599px) {
    .menu-container {
      justify-content: flex-start;
      padding: 1rem 0.75rem 2rem;
    }

    .hud-frame {
      width: 100%;
      padding: 3.25rem 1.25rem 1.25rem;
    }

    .back-link {
      top: 0.875rem;
      right: 0.875rem;
      width: 36px;
      min-width: 36px;
      height: 36px;
      font-size: 1.55rem;
    }

    h1 {
      margin-bottom: 1.25rem;
      overflow-wrap: anywhere;
    }

    .menu-controls {
      gap: 0.75rem;
    }

    .main-actions {
      gap: 0.75rem;
    }

    .settings-grid {
      gap: 0.75rem;
      font-size: 0.85rem;
    }

    .setting-item {
      min-height: 68px;
    }

    .transition-stack {
      width: min(100%, 200px);
      height: 68px;
    }

    .preset-wrapper {
      gap: 0.75rem;
    }

    .save-btn-container {
      margin-top: 22px;
    }
  }

  @media (max-width: 359px) {
    .hud-frame {
      padding: 3rem 1rem 1rem;
    }

    .main-actions {
      grid-template-columns: 1fr;
    }
  }
</style>
