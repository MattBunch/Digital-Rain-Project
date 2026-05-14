<script lang="ts">
  interface Props {
    fps: number;
    visible: boolean;
  }

  const { fps, visible }: Props = $props();
</script>

{#if visible}
  <div class="fps-counter">
    <span class="label">FPS:</span>
    <span class="value">{fps}</span>
  </div>
{/if}

<style>
  .fps-counter {
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid var(--matrix-color, #00ff41);
    color: var(--matrix-color, #00ff41);
    padding: 4px 8px;
    font-family: var(--font-mono, monospace);
    font-size: 14px;
    pointer-events: none;
    z-index: 1000;
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
    display: flex;
    gap: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .label {
    opacity: 0.7;
  }

  .value {
    font-weight: bold;
    min-width: 2ch;
    text-align: right;
  }
</style>
