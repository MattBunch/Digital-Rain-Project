<script lang="ts">
  import { slide } from 'svelte/transition';
  import { hexToRgb } from '$lib/utils/MathUtils';

  interface Props {
    title: string;
    isOpen?: boolean;
    color?: string;
    children?: import('svelte').Snippet;
  }

  /* eslint-disable prefer-const */
  let { title, isOpen = $bindable(false), color = '#00ff41', children }: Props = $props();
  /* eslint-enable prefer-const */

  const colorRgb = $derived(hexToRgb(color));

  function toggle() {
    isOpen = !isOpen;
  }
</script>

<div class="cyber-accordion" style:--theme-color={color} style:--theme-color-rgb={colorRgb}>
  <button
    type="button"
    class="accordion-header"
    class:open={isOpen}
    onclick={toggle}
    aria-expanded={isOpen}
  >
    <span class="tech-icon">{isOpen ? '▼' : '▶'}</span>
    <span class="title">{title}</span>
    <span class="tech-lines"></span>
  </button>

  {#if isOpen}
    <div class="accordion-content" transition:slide={{ duration: 300 }}>
      <div class="content-inner">
        {@render children?.()}
      </div>
    </div>
  {/if}
</div>

<style>
  .cyber-accordion {
    width: 100%;
    margin: 1rem 0;
    border-top: 1px solid rgba(var(--theme-color-rgb), 0.3);
    border-bottom: 1px solid rgba(var(--theme-color-rgb), 0.3);
  }

  .accordion-header {
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    border: none;
    color: var(--theme-color);
    padding: 12px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-family: var(--font-ui);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    text-align: left;
    position: relative;
    overflow: hidden;
  }

  .accordion-header:hover {
    background: rgba(var(--theme-color-rgb), 0.1);
    text-shadow: 0 0 10px var(--theme-color);
  }

  .accordion-header.open {
    background: rgba(var(--theme-color-rgb), 0.15);
    border-bottom: 1px solid var(--theme-color);
  }

  .tech-icon {
    font-size: 0.7rem;
    opacity: 0.8;
  }

  .title {
    font-weight: bold;
    flex-grow: 0;
  }

  .tech-lines {
    flex-grow: 1;
    height: 1px;
    background: linear-gradient(to right, var(--theme-color), transparent);
    opacity: 0.3;
  }

  .accordion-content {
    background: rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .content-inner {
    padding: 20px;
  }
</style>
