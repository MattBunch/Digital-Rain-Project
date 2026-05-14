<script lang="ts">
  import { scramble } from '$lib/utils/ScrambleAction';
  import { hexToRgb } from '$lib/utils/MathUtils';

  interface Props {
    onclick?: () => void;
    color?: string;
    children?: import('svelte').Snippet;
    class?: string;
    title?: string;
  }

  const { onclick, color = '#00ff41', children, class: className = '', title }: Props = $props();

  const colorRgb = $derived(hexToRgb(color));
</script>

<button
  class="cyber-square-button {className}"
  style:--theme-color={color}
  style:--theme-color-rgb={colorRgb}
  {onclick}
  {title}
  aria-label={title}
>
  <span class="glitch-layer" aria-hidden="true">{@render children?.()}</span>
  <span class="content" use:scramble>{@render children?.()}</span>
  <span class="glitch-layer" aria-hidden="true">{@render children?.()}</span>
</button>

<style>
  .cyber-square-button {
    position: relative;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid var(--theme-color);
    color: var(--theme-color);
    width: 44px;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s ease;
    font-family: var(--font-mono);
    font-weight: bold;
    padding: 0;
    box-shadow: inset 0 0 5px rgba(var(--theme-color-rgb), 0.2);
  }

  .cyber-square-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--theme-color);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: -1;
  }

  .cyber-square-button:hover,
  .cyber-square-button:focus-visible {
    color: black;
    box-shadow: 0 0 15px var(--theme-color);
    outline: none;
    transform: translateY(-2px);
  }

  .cyber-square-button:hover::before,
  .cyber-square-button:focus-visible::before {
    opacity: 1;
  }

  .content {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* Glitch Effect */
  .glitch-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 0;
    opacity: 0.8;
  }

  .cyber-square-button:hover .glitch-layer,
  .cyber-square-button:focus-visible .glitch-layer {
    display: flex;
    animation: glitch 0.3s infinite;
  }

  .glitch-layer:nth-child(1) {
    color: #ff003c;
    left: -1px;
    clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
  }

  .glitch-layer:nth-child(3) {
    color: #00e5ff;
    left: 1px;
    clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
  }

  @keyframes glitch {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-1px, 1px);
    }
    40% {
      transform: translate(-1px, -1px);
    }
    60% {
      transform: translate(1px, 1px);
    }
    80% {
      transform: translate(1px, -1px);
    }
    100% {
      transform: translate(0);
    }
  }
</style>
