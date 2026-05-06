<script lang="ts">
  import { scramble } from '$lib/utils/ScrambleAction';

  interface Props {
    onclick?: () => void;
    color?: string;
    variant?: 'primary' | 'secondary';
    children?: import('svelte').Snippet;
    class?: string;
  }

  const {
    onclick,
    color = '#00ff41',
    variant = 'primary',
    children,
    class: className = '',
  }: Props = $props();

  const glowStyle = $derived(`
    --glow-color: ${color};
    --border-color: ${color};
  `);
</script>

<button class="cyber-button {variant} {className}" style={glowStyle} {onclick}>
  <span class="glitch-layer" aria-hidden="true">{@render children?.()}</span>
  <span class="content" use:scramble>{@render children?.()}</span>
  <span class="glitch-layer" aria-hidden="true">{@render children?.()}</span>
</button>

<style>
  .cyber-button {
    position: relative;
    background: transparent;
    border: 2px solid var(--border-color);
    color: var(--border-color);
    padding: 12px 24px;
    font-family: var(--font-ui);
    font-size: 1.1rem;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.2s ease;
    clip-path: polygon(10% 0, 100% 0, 90% 100%, 0 100%);
    min-width: 160px;
  }

  .cyber-button.secondary {
    clip-path: polygon(0 0, 90% 0, 100% 100%, 10% 100%);
  }

  .cyber-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--glow-color);
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: -1;
  }

  .cyber-button:hover {
    color: black;
    text-shadow: none;
    box-shadow: 0 0 20px var(--glow-color);
  }

  .cyber-button:hover::before {
    opacity: 1;
  }

  .content {
    position: relative;
    z-index: 1;
    display: inline-block;
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

  .cyber-button:hover .glitch-layer {
    display: flex;
    animation: glitch 0.3s infinite;
  }

  .glitch-layer:nth-child(1) {
    color: #ff003c; /* Cyber Red */
    left: -2px;
    clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
  }

  .glitch-layer:nth-child(3) {
    color: #00e5ff; /* Cyber Cyan */
    left: 2px;
    clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
  }

  @keyframes glitch {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    40% {
      transform: translate(-2px, -2px);
    }
    60% {
      transform: translate(2px, 2px);
    }
    80% {
      transform: translate(2px, -2px);
    }
    100% {
      transform: translate(0);
    }
  }
</style>
