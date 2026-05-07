<script lang="ts">
  import { CoreEngine } from '$lib/engine/CoreEngine';
  import SettingsMenu from '$lib/components/SettingsMenu.svelte';
  import MatrixCanvas from '$lib/components/MatrixCanvas.svelte';
  import CRTOverlay from '$lib/components/CRTOverlay.svelte';

  let menuVisible = $state(true);
  let discoOn = $state(false);
  let chosenColor = $state('green');
  let all4Directions = $state(false);
  let frameCount = $state(10);
  let mode = $state<'normal' | 'square'>('normal');

  const engine = new CoreEngine();
  const backgroundEngine = new CoreEngine();

  // Sync state to engine
  $effect(() => {
    engine.discoOn = discoOn;
    engine.switchColor(chosenColor);
    engine.all4Directions = all4Directions;
    engine.discoFrameCounterTurnoverPoint = frameCount;

    backgroundEngine.switchColor(chosenColor);
    backgroundEngine.discoOn = false; // Background should be subtle
  });

  function handleStartNormal() {
    mode = 'normal';
    menuVisible = false;
  }

  function handleStartSquare() {
    mode = 'square';
    menuVisible = false;
  }

  function handleReturnToMenu() {
    if (engine.intervalValid) {
      clearInterval(engine.intervalValid);
    }
    if (engine.menuInterval) {
      clearInterval(engine.menuInterval);
    }

    if (engine.ctx && engine.canvas) {
      engine.ctx.fillStyle = '#000000';
      engine.ctx.fillRect(0, 0, engine.canvas.width, engine.canvas.height);
    }

    engine.reset();
    menuVisible = true;
  }
</script>

<CRTOverlay>
  <main>
    {#if menuVisible}
      <div class="background-rain">
        <MatrixCanvas
          engine={backgroundEngine}
          mode="normal"
          onReturn={handleReturnToMenu}
          bind:discoOn
          bind:chosenColor
        />
      </div>
      <SettingsMenu
        bind:discoOn
        bind:chosenColor
        bind:all4Directions
        bind:frameCount
        onStartNormal={handleStartNormal}
        onStartSquare={handleStartSquare}
      />
    {:else}
      <MatrixCanvas {engine} {mode} onReturn={handleReturnToMenu} bind:discoOn bind:chosenColor />
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
