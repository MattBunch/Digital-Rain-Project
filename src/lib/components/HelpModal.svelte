<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { helpGroups } from '$lib/constants/HelpData';
  import KeyCap from './KeyCap.svelte';
  import CyberButton from './CyberButton.svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    color?: string;
  }

  const { isOpen, onClose, color = '#00ff41' }: Props = $props();

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

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isOpen) {
      onClose();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

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
          <h2>SYSTEM_MANUAL</h2>
          <div class="header-line"></div>
        </header>

        <div class="scroll-container">
          <div class="scroll-area">
            <div class="groups-container">
              {#each helpGroups as group (group.title)}
                <section class="help-group">
                  <h3>{group.title}</h3>
                  <div class="items-grid">
                    {#each group.items as item (item.key)}
                      <div class="help-item">
                        <div class="key-wrapper">
                          <KeyCap {color}>{item.key}</KeyCap>
                        </div>
                        <span class="description">{item.description}</span>
                      </div>
                    {/each}
                  </div>
                </section>
              {/each}
            </div>
          </div>
        </div>

        <footer>
          <div class="footer-line"></div>
          <CyberButton {color} onclick={onClose} variant="primary">DISMISS</CyberButton>
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

  /* Tech markers at the top and bottom of the scroll track */
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
    max-height: 50vh; /* Ensure it scrolls */
    scrollbar-width: thin;
    scrollbar-color: var(--theme-color) rgba(0, 0, 0, 0.3);
  }

  /* --- Advanced Cyberpunk Scrollbar --- */
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

  .groups-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 600px) {
    .groups-container {
      grid-template-columns: 1fr;
    }
  }

  .help-group h3 {
    font-family: var(--font-ui);
    font-size: 1.2rem;
    border-bottom: 1px solid rgba(var(--theme-color), 0.2);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  .items-grid {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .help-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .key-wrapper {
    flex-shrink: 0;
    width: 80px;
    display: flex;
    justify-content: flex-start;
  }

  .description {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    opacity: 0.9;
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
