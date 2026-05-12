<script lang="ts">
  import { onMount } from 'svelte';
  import { CoreEngine } from '$lib/engine/CoreEngine';
  import SettingsMenu from '$lib/components/SettingsMenu.svelte';
  import MatrixCanvas from '$lib/components/MatrixCanvas.svelte';
  import CRTOverlay from '$lib/components/CRTOverlay.svelte';
  import FpsCounter from '$lib/components/FpsCounter.svelte';
  import { DEFAULT_SETTINGS } from '$lib/constants/presets';
  import { serializeSettings, deserializeSettings } from '$lib/utils/UrlParams';
  import type { IEngineSettings } from '$lib/types';

  let menuVisible = $state(true);
  let settings = $state<IEngineSettings>({ ...DEFAULT_SETTINGS });
  let showFps = $state(false);
  let currentFps = $state(0);

  let engine = $state<CoreEngine>();
  let backgroundEngine = $state<CoreEngine>();

  onMount(() => {
    // Load settings from URL hash
    const hashSettings = deserializeSettings(window.location.hash);
    settings = { ...DEFAULT_SETTINGS, ...hashSettings };

    engine = new CoreEngine();
    backgroundEngine = new CoreEngine();

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
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(fpsInterval);
    };
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
    engine.discoFrameCounterTurnoverPoint = settings.frameCount;
    engine.fontSize = settings.fontSize;
    engine.intervalSpeed = settings.speed;

    // Background Engine
    backgroundEngine.switchColor(settings.chosenColor);
    backgroundEngine.discoOn = false; // Background should be subtle
    backgroundEngine.all4Directions = settings.all4Directions;
    backgroundEngine.fontSize = settings.fontSize;
    backgroundEngine.intervalSpeed = settings.speed;
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
      engine.ctx.fillStyle = '#000000';
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
          />
        {/if}
      </div>
      <SettingsMenu
        bind:settings
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
    overflow: hidden;
    background-color: black;
    color: #00ff41;
    font-family: var(--font-mono);
  }

  .background-rain {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.15;
    z-index: -1;
    pointer-events: none;
  }
</style>
