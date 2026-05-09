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
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #000;
    z-index: 9999;
    pointer-events: none;
  }

  .crt-screen {
    position: relative;
    width: 100%;
    height: 100%;
    pointer-events: auto;
  }

  .scanlines {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
    background-size: 100% 4px;
    z-index: 10;
    pointer-events: none;
  }

  .vignette {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, transparent 50%, rgba(0, 0, 0, 0.5) 100%);
    z-index: 11;
    pointer-events: none;
  }

  .flicker {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(18, 16, 16, 0.05);
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
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background:
      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%),
      linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
    z-index: 13;
    background-size:
      100% 2px,
      3px 100%;
    pointer-events: none;
  }
</style>
