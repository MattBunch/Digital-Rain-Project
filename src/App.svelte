<script lang="ts">
  import { onMount } from 'svelte';
  import { CoreEngine } from '$lib/engine/CoreEngine';
  import SettingsMenu from '$lib/components/SettingsMenu.svelte';
  import MatrixCanvas from '$lib/components/MatrixCanvas.svelte';
  import CRTOverlay from '$lib/components/CRTOverlay.svelte';
  import FpsCounter from '$lib/components/FpsCounter.svelte';
  import { DEFAULT_SETTINGS } from '$lib/constants/presets';
  import { getRandomColor } from '$lib/utils/MathUtils';
  import { serializeSettings, deserializeSettings } from '$lib/utils/UrlParams';
  import { loadThemeMode, resolveTheme, saveThemeMode } from '$lib/utils/ThemeUtils';
  import type { IEngineSettings, ResolvedTheme, ThemeMode } from '$lib/types';

  function getRandomColors(count = 5): string[] {
    return Array.from({ length: count }, () => getRandomColor());
  }

  function getInitialSettings(): IEngineSettings {
    if (typeof window === 'undefined') {
      return { ...DEFAULT_SETTINGS };
    }

    return { ...DEFAULT_SETTINGS, ...deserializeSettings(window.location.hash) };
  }

  function getInitialThemeMode(): ThemeMode {
    if (typeof window === 'undefined') {
      return 'system';
    }

    return loadThemeMode();
  }

  function getInitialOsPrefersLight(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia?.('(prefers-color-scheme: light)').matches ?? false;
  }

  let menuVisible = $state(true);
  let settings = $state<IEngineSettings>(getInitialSettings());
  let discoColors = $state(getRandomColors());
  let showFps = $state(false);
  let currentFps = $state(0);
  let themeMode = $state<ThemeMode>(getInitialThemeMode());
  let osPrefersLight = $state(getInitialOsPrefersLight());

  let engine = $state<CoreEngine>();
  let backgroundEngine = $state<CoreEngine>();
  const resolvedTheme = $derived<ResolvedTheme>(resolveTheme(themeMode, osPrefersLight));

  onMount(() => {
    engine = new CoreEngine();
    backgroundEngine = new CoreEngine();

    const themeQuery = window.matchMedia?.('(prefers-color-scheme: light)');
    osPrefersLight = themeQuery?.matches ?? false;

    const handleThemeChange = (event: MediaQueryListEvent) => {
      osPrefersLight = event.matches;
    };

    themeQuery?.addEventListener('change', handleThemeChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') {
        showFps = !showFps;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    const fpsInterval = setInterval(() => {
      if (engine && !menuVisible) {
        currentFps = engine.fps;
      } else if (backgroundEngine && menuVisible) {
        currentFps = backgroundEngine.fps;
      }
    }, 500);

    return () => {
      engine?.stop();
      backgroundEngine?.stop();
      themeQuery?.removeEventListener('change', handleThemeChange);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(fpsInterval);
    };
  });

  $effect(() => {
    saveThemeMode(themeMode);
  });

  $effect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
    document.documentElement.style.colorScheme = resolvedTheme;
  });

  $effect(() => {
    if (settings.discoOn && menuVisible) {
      const menuInterval = setInterval(() => {
        discoColors = getRandomColors();
      }, 1000);

      return () => {
        clearInterval(menuInterval);
      };
    }

    return undefined;
  });

  // Sync state to URL hash
  $effect(() => {
    const hash = serializeSettings(settings);
    if (window.location.hash !== '#' + hash) {
      window.history.replaceState(null, '', '#' + hash);
    }
  });

  // Sync state to engine
  $effect(() => {
    if (!engine || !backgroundEngine) {
      return;
    }

    // Main Engine
    engine.discoOn = settings.discoOn;
    engine.switchColor(settings.chosenColor);
    engine.all4Directions = settings.all4Directions;
    engine.all8Directions = settings.all8Directions;
    engine.discoFrameCounterTurnoverPoint = settings.frameCount;
    engine.fontSize = settings.fontSize;
    engine.intervalSpeed = settings.speed;
    engine.intensity = settings.intensity / 100;
    engine.charSet = settings.charSet;
    engine.customCharSet = settings.customCharSet;
    engine.perStringColor = settings.perStringColor;
    engine.waveDistortion = settings.waveDistortion;
    engine.mouseInteractionMode = settings.mouseInteractionMode;
    engine.setVisualTheme(resolvedTheme);

    // Background Engine
    backgroundEngine.switchColor(settings.chosenColor);
    backgroundEngine.discoOn = settings.discoOn;
    backgroundEngine.setDiscoColorOverride(settings.discoOn && menuVisible ? discoColors[0] : null);
    backgroundEngine.all4Directions = settings.all4Directions;
    backgroundEngine.all8Directions = settings.all8Directions;
    backgroundEngine.discoFrameCounterTurnoverPoint = settings.frameCount;
    backgroundEngine.fontSize = settings.fontSize;
    backgroundEngine.intervalSpeed = settings.speed;
    backgroundEngine.intensity = settings.intensity / 100;
    backgroundEngine.charSet = settings.charSet;
    backgroundEngine.customCharSet = settings.customCharSet;
    backgroundEngine.perStringColor = settings.perStringColor;
    backgroundEngine.waveDistortion = settings.waveDistortion;
    backgroundEngine.mouseInteractionMode = settings.mouseInteractionMode;
    backgroundEngine.setVisualTheme(resolvedTheme);
  });

  function handleStartNormal() {
    settings.mode = 'normal';
    menuVisible = false;
  }

  function handleStartSquare() {
    settings.mode = 'square';
    menuVisible = false;
  }

  function handleReturnToMenu() {
    engine?.stop();

    if (engine?.ctx && engine?.canvas) {
      engine.ctx.fillStyle = engine.getCanvasSolidFillStyle();
      engine.ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);
    }

    engine?.reset();
    menuVisible = true;
  }
</script>

<CRTOverlay>
  <FpsCounter fps={currentFps} visible={showFps} />
  <main>
    {#if menuVisible}
      <div class="background-rain">
        {#if backgroundEngine}
          <MatrixCanvas
            engine={backgroundEngine}
            mode="normal"
            onReturn={handleReturnToMenu}
            bind:discoOn={settings.discoOn}
            bind:chosenColor={settings.chosenColor}
            bind:all4Directions={settings.all4Directions}
            bind:all8Directions={settings.all8Directions}
            bind:waveDistortion={settings.waveDistortion}
            bind:mouseInteractionMode={settings.mouseInteractionMode}
            showMobileControls={false}
          />
        {/if}
      </div>
      <SettingsMenu
        bind:settings
        bind:themeMode
        {discoColors}
        onStartNormal={handleStartNormal}
        onStartSquare={handleStartSquare}
      />
    {:else if engine}
      <MatrixCanvas
        {engine}
        mode={settings.mode}
        onReturn={handleReturnToMenu}
        bind:discoOn={settings.discoOn}
        bind:chosenColor={settings.chosenColor}
        bind:all4Directions={settings.all4Directions}
        bind:all8Directions={settings.all8Directions}
        bind:waveDistortion={settings.waveDistortion}
        bind:mouseInteractionMode={settings.mouseInteractionMode}
      />
    {/if}
  </main>
</CRTOverlay>

<style>
  :root {
    --font-title: 'Rubik Glitch Pop', system-ui, -apple-system, sans-serif;
    --font-ui: 'Orbitron', sans-serif;
    --font-mono: 'Kode Mono', monospace;
  }

  :global(body) {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--page-bg);
    color: var(--page-text);
    font-family: var(--font-mono);
  }

  main {
    min-height: 100vh;
    min-height: 100dvh;
  }

  .background-rain {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: var(--background-rain-opacity);
    z-index: -1;
    pointer-events: none;
  }
</style>
