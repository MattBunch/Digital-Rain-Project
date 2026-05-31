<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { hexToRgb } from '$lib/utils/MathUtils';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    color: string;
    children: import('svelte').Snippet;
    footer?: import('svelte').Snippet;
  }

  const { isOpen, onClose, title, color, children, footer }: Props = $props();
  const colorRgb = $derived(hexToRgb(color));

  let modalElement = $state<HTMLElement | null>(null);
  let previousActiveElement = $state<HTMLElement | null>(null);

  $effect(() => {
    if (isOpen) {
      previousActiveElement = document.activeElement as HTMLElement;
      // Small delay to ensure the modal is rendered before focusing
      setTimeout(() => {
        const focusable = getFocusableElements();
        if (focusable.length > 0) {
          focusable[0].focus();
        }
      }, 50);
    } else if (previousActiveElement) {
      previousActiveElement.focus();
    }
  });

  function getFocusableElements() {
    if (!modalElement) {
      return [];
    }
    return Array.from(
      modalElement.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }

    if (event.key === 'Tab' && isOpen) {
      const focusable = getFocusableElements();
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
  }

  $effect(() => {
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
</script>

{#if isOpen}
  <div
    class="modal-backdrop"
    transition:fade={{ duration: 200 }}
    onclick={handleBackdropClick}
    onkeydown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        onClose();
      }
    }}
    role="button"
    tabindex="-1"
    aria-label="Close modal"
  >
    <div
      bind:this={modalElement}
      class="modal-container"
      transition:scale={{ duration: 300, start: 0.95 }}
      style:--theme-color={color}
      style:--theme-color-rgb={colorRgb}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div class="hud-frame">
        <header>
          <h2 id="modal-title">{title}</h2>
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
    width: 100%;
    height: 100vh;
    height: 100dvh;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    z-index: 10000;
    box-sizing: border-box;
  }

  .modal-container {
    width: min(100%, 800px);
    max-width: 800px;
    max-height: min(85vh, 760px);
    max-height: min(85dvh, 760px);
    background: var(--panel-bg-strong);
    color: var(--control-text);
    position: relative;
    box-sizing: border-box;
  }

  .hud-frame {
    padding: 2.5rem;
    border: 1px solid rgba(var(--theme-color-rgb), var(--theme-border-alpha));
    position: relative;
    display: flex;
    flex-direction: column;
    max-height: inherit;
    box-sizing: border-box;
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
    font-size: clamp(1.8rem, 8vw, 2.5rem);
    margin: 0;
    text-shadow: 0 0 10px var(--theme-color);
    overflow-wrap: anywhere;
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
    max-height: 50dvh;
    scrollbar-width: thin;
    scrollbar-color: var(--theme-color) var(--scrollbar-track);
  }

  .scroll-area::-webkit-scrollbar {
    width: 6px;
  }

  .scroll-area::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
    border-left: 1px dashed rgba(var(--theme-color-rgb), 0.2);
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
    border: 1px solid var(--control-inverse-text);
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

  :global(:root[data-theme='light']) .modal-backdrop {
    background: rgba(244, 241, 232, 0.72);
  }

  :global(:root[data-theme='light']) .modal-container {
    box-shadow: 0 18px 48px var(--shadow-color);
  }

  @media (max-width: 599px) {
    .modal-backdrop {
      align-items: flex-start;
      padding: 0.75rem;
    }

    .modal-container {
      max-height: calc(100vh - 1.5rem);
      max-height: calc(100dvh - 1.5rem);
    }

    .hud-frame {
      padding: 1.25rem;
    }

    header {
      margin-bottom: 1rem;
    }

    .scroll-container {
      margin-bottom: 1rem;
    }

    .scroll-area {
      max-height: calc(100vh - 13rem);
      max-height: calc(100dvh - 13rem);
      padding-right: 0.75rem;
    }

    footer {
      gap: 1rem;
    }
  }
</style>
