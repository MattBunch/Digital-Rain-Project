<script lang="ts">
  interface Props {
    children?: import('svelte').Snippet;
  }

  const { children }: Props = $props();
</script>

<div class="crt-container">
  <div class="crt-screen">
    {@render children?.()}

    <div class="scanlines"></div>
    <div class="vignette"></div>
    <div class="flicker"></div>
  </div>
</div>

<style>
  .crt-container {
    position: fixed;
    inset: 0;
    width: 100vw;
    min-height: 100dvh;
    overflow-x: hidden;
    overflow-y: auto;
    background: var(--page-bg);
    z-index: 9999;
    pointer-events: none;
    -webkit-overflow-scrolling: touch;
  }

  .crt-screen {
    position: relative;
    width: 100%;
    min-height: 100dvh;
    pointer-events: auto;
  }

  .scanlines {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: var(--scanline-bg);
    background-size: 100% 4px;
    z-index: 10;
    pointer-events: none;
  }

  .vignette {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: var(--crt-vignette-bg);
    z-index: 11;
    pointer-events: none;
  }

  .flicker {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    background: var(--crt-flicker-bg);
    opacity: 0;
    z-index: 12;
    pointer-events: none;
    animation: flicker 0.15s infinite;
  }

  @keyframes flicker {
    0% {
      opacity: 0.1;
    }
    5% {
      opacity: 0.2;
    }
    10% {
      opacity: 0.1;
    }
    15% {
      opacity: 0.3;
    }
    20% {
      opacity: 0.1;
    }
    25% {
      opacity: 0.2;
    }
    30% {
      opacity: 0.1;
    }
    35% {
      opacity: 0.4;
    }
    40% {
      opacity: 0.1;
    }
    45% {
      opacity: 0.2;
    }
    50% {
      opacity: 0.1;
    }
    55% {
      opacity: 0.3;
    }
    60% {
      opacity: 0.1;
    }
    65% {
      opacity: 0.2;
    }
    70% {
      opacity: 0.1;
    }
    75% {
      opacity: 0.4;
    }
    80% {
      opacity: 0.1;
    }
    85% {
      opacity: 0.2;
    }
    90% {
      opacity: 0.1;
    }
    95% {
      opacity: 0.3;
    }
    100% {
      opacity: 0.1;
    }
  }

  /* Distorted CRT curve */
  .crt-screen::before {
    content: ' ';
    display: block;
    position: fixed;
    inset: 0;
    background: var(--crt-curve-bg);
    z-index: 13;
    background-size:
      100% 2px,
      3px 100%;
    pointer-events: none;
  }
</style>
