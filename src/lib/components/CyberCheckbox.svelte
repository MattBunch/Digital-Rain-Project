<script lang="ts">
  import { hexToRgb } from '$lib/utils/MathUtils';

  interface Props {
    checked: boolean;
    id?: string;
    color?: string;
    label?: string;
  }

  /* eslint-disable prefer-const */
  let { checked = $bindable(false), id, color = '#00ff41', label }: Props = $props();
  /* eslint-enable prefer-const */

  const colorRgb = $derived(hexToRgb(color));

  function toggle() {
    checked = !checked;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      toggle();
    }
  }
</script>

<div class="cyber-checkbox-container">
  {#if label && id}
    <label for={id} class="cyber-label" style:--theme-color={color}>
      {label}
    </label>
  {/if}

  <div class="checkbox-wrapper">
    <input type="checkbox" {id} bind:checked class="hidden-input" aria-hidden="true" />
    <div
      class="cyber-checkbox"
      class:checked
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      tabindex="0"
      onclick={toggle}
      onkeydown={handleKeydown}
      style:--theme-color={color}
      style:--theme-color-rgb={colorRgb}
    >
      <div class="inner-box">
        {#if checked}
          <div class="checkmark">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="square"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .cyber-checkbox-container {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-family: var(--font-mono);
    min-height: 44px;
  }

  .checkbox-wrapper {
    position: relative;
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hidden-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
    margin: 0;
    pointer-events: none;
  }

  .cyber-label {
    color: var(--control-text);
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    user-select: none;
    line-height: 1.25;
    text-align: left;
  }

  .cyber-checkbox {
    width: 44px;
    height: 44px;
    background: transparent;
    border: none;
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.2s ease;
    outline: none;
  }

  .cyber-checkbox:focus-visible .inner-box {
    box-shadow: 0 0 10px var(--theme-color);
    transform: scale(1.1);
  }

  .cyber-checkbox.checked .inner-box {
    background: rgba(var(--theme-color-rgb), 0.1);
    box-shadow: inset 0 0 10px var(--theme-color);
  }

  .inner-box {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--control-bg);
    border: 1px solid var(--theme-color);
    clip-path: polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%);
    transition: all 0.2s ease;
  }

  .checkmark {
    width: 16px;
    height: 16px;
    color: var(--theme-color);
    filter: drop-shadow(0 0 5px var(--theme-color));
    animation: glitch-check 0.2s ease-out;
  }

  @keyframes glitch-check {
    0% {
      transform: scale(0) rotate(-45deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(10deg);
      opacity: 1;
      filter: hue-rotate(90deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }

  .cyber-checkbox:hover .inner-box {
    box-shadow: 0 0 15px var(--theme-color);
    border-color: var(--page-text);
  }
</style>
