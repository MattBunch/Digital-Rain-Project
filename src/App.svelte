<script lang="ts">
  import { CoreEngine } from '$lib/engine/CoreEngine';
  import SettingsMenu from '$lib/components/SettingsMenu.svelte';
  import MatrixCanvas from '$lib/components/MatrixCanvas.svelte';

  let menuVisible = $state(true);
  let discoOn = $state(false);
  let chosenColor = $state('green');
  let all4Directions = $state(false);
  let frameCount = $state(10);
  let mode = $state<'normal' | 'square'>('normal');

  const engine = new CoreEngine();

  // Sync state to engine
  $effect(() => {
    engine.discoOn = discoOn;
    engine.switchColor(chosenColor);
    engine.all4Directions = all4Directions;
    engine.discoFrameCounterTurnoverPoint = frameCount;
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

<main>
  {#if menuVisible}
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

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: black;
  }
</style>
