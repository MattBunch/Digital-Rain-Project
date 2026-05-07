<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { scramble } from '$lib/utils/ScrambleAction';
  import { fallingLetters } from '$lib/utils/FallingLettersAction';

  interface Props {
    value: string;
    options: string[];
    color?: string;
    label?: string;
    id?: string;
  }

  /* eslint-disable prefer-const */
  let { value = $bindable(), options, color = '#00ff41', label, id }: Props = $props();
  /* eslint-enable prefer-const */

  let isOpen = $state(false);
  let container = $state<HTMLDivElement | null>(null);

  function toggle() {
    isOpen = !isOpen;
  }

  function selectOption(opt: string) {
    value = opt;
    isOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      isOpen = false;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle();
    }
  }

  onMount(() => {
    function handleClickOutside(event: MouseEvent) {
      if (container && !container.contains(event.target as Node)) {
        isOpen = false;
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  });

  const transitionDuration =
    typeof process !== 'undefined' && process.env.NODE_ENV === 'test' ? 0 : 150;
</script>

<div class="cyber-select-container" bind:this={container} style:--theme-color={color}>
  {#if label}
    <label for={id} class="cyber-label">
      {label}
    </label>
  {/if}

  <div class="select-wrapper">
    <button
      {id}
      type="button"
      class="select-trigger"
      class:open={isOpen}
      onclick={toggle}
      onkeydown={handleKeydown}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-label={label || 'Select option'}
    >
      <span class="glitch-layer" aria-hidden="true">{value.toUpperCase()}</span>
      <span class="value-text" use:scramble={value.toUpperCase()}>{value.toUpperCase()}</span>
      <span class="glitch-layer" aria-hidden="true">{value.toUpperCase()}</span>
      <span class="arrow" class:open={isOpen}>▼</span>
    </button>

    {#if isOpen}
      <div
        class="options-dropdown"
        role="listbox"
        transition:fade={{ duration: transitionDuration }}
      >
        <div class="scanline"></div>
        {#each options as opt (opt)}
          <button
            type="button"
            class="option-item"
            class:active={value === opt}
            role="option"
            aria-selected={value === opt}
            onclick={() => selectOption(opt)}
            use:fallingLetters={{ value: value === opt, color }}
          >
            {opt.toUpperCase()}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .cyber-select-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-family: var(--font-mono);
    width: 200px; /* Slightly wider */
    position: relative;
  }

  .cyber-label {
    color: var(--theme-color);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2px;
  }

  .select-wrapper {
    position: relative;
  }

  .select-trigger {
    width: 100%;
    background: rgba(0, 0, 0, 0.85);
    border: 1px solid var(--theme-color);
    color: var(--theme-color);
    padding: 10px 15px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.2s ease;
    clip-path: polygon(0 0, 100% 0, 100% 70%, 90% 100%, 0 100%);
    outline: none;
    position: relative;
    z-index: 2;
    overflow: hidden;
    font-weight: bold;
  }

  .select-trigger:hover,
  .select-trigger:focus-visible {
    box-shadow: 0 0 15px var(--theme-color);
    background: rgba(var(--theme-color), 0.15);
  }

  .select-trigger.open {
    border-bottom-color: transparent;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }

  .value-text {
    flex-grow: 1;
    text-align: left;
    position: relative;
    z-index: 1;
  }

  .glitch-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: none;
    justify-content: flex-start;
    align-items: center;
    padding-left: 15px;
    z-index: 0;
    opacity: 0.8;
    pointer-events: none;
  }

  .select-trigger:hover .glitch-layer {
    display: flex;
    animation: glitch-select 0.3s infinite;
  }

  .glitch-layer:nth-child(1) {
    color: #ff003c;
    left: -2px;
    clip-path: polygon(0 0, 100% 0, 100% 33%, 0 33%);
  }

  .glitch-layer:nth-child(3) {
    color: #00e5ff;
    left: 2px;
    clip-path: polygon(0 67%, 100% 67%, 100% 100%, 0 100%);
  }

  @keyframes glitch-select {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-2px, 1px);
    }
    40% {
      transform: translate(-2px, -1px);
    }
    60% {
      transform: translate(2px, 1px);
    }
    80% {
      transform: translate(2px, -1px);
    }
    100% {
      transform: translate(0);
    }
  }

  .arrow {
    font-size: 0.7rem;
    transition: transform 0.3s ease;
    margin-left: 10px;
  }

  .arrow.open {
    transform: rotate(180deg);
  }

  .options-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.98);
    border: 1px solid var(--theme-color);
    border-top: none;
    z-index: 10;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(15px);
    overflow: hidden;
  }

  .option-item {
    background: transparent;
    border: none;
    padding: 12px 15px;
    color: var(--theme-color);
    text-align: left;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    position: relative;
    text-transform: uppercase;
    font-weight: bold;
  }

  .option-item:hover,
  .option-item:focus-visible {
    background: var(--theme-color);
    color: #000 !important;
    outline: none;
  }

  .option-item.active {
    background: rgba(var(--theme-color), 0.2);
    text-decoration: underline;
  }

  .scanline {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) 50%,
      rgba(0, 0, 0, 0.15) 50%,
      rgba(0, 0, 0, 0.15) 100%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 11;
    opacity: 0.4;
  }

  .options-dropdown::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(transparent, rgba(var(--theme-color), 0.08));
    pointer-events: none;
  }
</style>
