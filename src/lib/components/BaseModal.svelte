<script lang="ts">
  import { fade, scale } from 'svelte/transition';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    color: string;
    children: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  }

  const { isOpen, onClose, title, color, children, footer }: Props = $props();

  $effect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeydown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleBackdropKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      onClose();
    }
  }
</script>

{#if isOpen}
  <div
    class="modal-backdrop"
    transition:fade={{ duration: 200 }}
    onclick={handleBackdropClick}
    onkeydown={handleBackdropKeydown}
    role="button"
    tabindex="0"
    aria-label="Close modal"
  >
    <div
      class="modal-container"
      transition:scale={{ duration: 300, start: 0.95 }}
      style:--theme-color={color}
    >
      <div class="hud-frame">
        <header>
          <h2>{title}</h2>
          <div class="header-line"></div>
        </header>

        <div class="scroll-container">
          <div class="scroll-area">
            {@render children()}
          </div>
        </div>

        <footer>
          <div class="footer-line"></div>
          {#if footer}
            {@render footer()}
          {/if}
        </footer>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  }

  .modal-container {
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
    background: rgba(0, 0, 0, 0.9);
    color: var(--theme-color);
    position: relative;
  }

  .hud-frame {
    padding: 2.5rem;
    border: 1px solid rgba(var(--theme-color), 0.3);
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: inherit;
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

  header {
    margin-bottom: 1.5rem;
  }

  h2 {
    font-family: var(--font-title);
    font-size: 2.5rem;
    margin: 0;
    text-shadow: 0 0 10px var(--theme-color);
  }

  .header-line {
    height: 2px;
    background: linear-gradient(90deg, var(--theme-color), transparent);
    margin-top: 0.5rem;
  }

  .scroll-container {
    position: relative;
    margin-bottom: 1.5rem;
    overflow: hidden;
  }

  .scroll-container::before,
  .scroll-container::after {
    content: '▼';
    position: absolute;
    right: 0;
    font-size: 8px;
    color: var(--theme-color);
    opacity: 0.5;
    width: 6px;
    text-align: center;
    pointer-events: none;
    z-index: 5;
  }

  .scroll-container::before {
    content: '▲';
    top: 0;
  }

  .scroll-container::after {
    bottom: 0;
  }

  .scroll-area {
    overflow-y: auto;
    padding-right: 1.5rem;
    max-height: 50vh;
    scrollbar-width: thin;
    scrollbar-color: var(--theme-color) rgba(0, 0, 0, 0.3);
  }

  .scroll-area::-webkit-scrollbar {
    width: 6px;
  }

  .scroll-area::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.4);
    border-left: 1px dashed rgba(var(--theme-color), 0.2);
    margin-block: 10px;
  }

  .scroll-area::-webkit-scrollbar-thumb {
    background: linear-gradient(
      to bottom,
      transparent,
      var(--theme-color),
      var(--theme-color),
      transparent
    );
    border-radius: 0px;
    box-shadow:
      0 0 10px var(--theme-color),
      inset 0 0 2px rgba(255, 255, 255, 0.8);
    border: 1px solid black;
  }

  .scroll-area::-webkit-scrollbar-thumb:hover {
    background: var(--theme-color);
    box-shadow: 0 0 20px var(--theme-color);
    cursor: pointer;
  }

  footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .footer-line {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--theme-color), transparent);
    opacity: 0.3;
  }
</style>
