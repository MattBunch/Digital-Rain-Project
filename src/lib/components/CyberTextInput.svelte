<script lang="ts">
  import { scramble } from '$lib/utils/ScrambleAction';
  import { hexToRgb } from '$lib/utils/MathUtils';

  interface Props {
    value: string;
    placeholder?: string;
    color?: string;
    label?: string;
    id?: string;
    onkeypress?: (event: KeyboardEvent) => void;
  }

  /* eslint-disable prefer-const */
  let {
    value = $bindable(''),
    placeholder = '',
    color = '#00ff41',
    label,
    id,
    onkeypress,
  }: Props = $props();
  /* eslint-enable prefer-const */

  const colorRgb = $derived(hexToRgb(color));

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
  }
</script>

<div class="cyber-input-container" style:--theme-color={color} style:--theme-color-rgb={colorRgb}>
  {#if label}
    <label for={id} class="cyber-label" use:scramble={label}>
      {label}
    </label>
  {/if}

  <div class="input-glow-wrapper">
    <input
      {id}
      type="text"
      {value}
      {placeholder}
      oninput={handleInput}
      {onkeypress}
      class="cyber-input"
      autocomplete="off"
    />
    <div class="scanline"></div>
  </div>
</div>

<style>
  .cyber-input-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-family: var(--font-mono);
    width: 100%;
    align-items: flex-start;
    min-height: 65px;
  }

  .cyber-label {
    color: var(--theme-color);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2px;
    height: 16px;
    display: flex;
    align-items: center;
  }

  .input-glow-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
    height: 42px;
    clip-path: polygon(0% 0%, 95% 0%, 100% 25%, 100% 100%, 5% 100%, 0% 75%);
  }

  .cyber-input {
    background: rgba(0, 0, 0, 0.85);
    border: 1px solid var(--theme-color);
    padding: 0 15px;
    height: 100%;
    color: var(--theme-color);
    font-family: var(--font-mono);
    font-size: 1.1rem;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }

  .cyber-input::placeholder {
    color: var(--theme-color);
    opacity: 0.3;
  }

  .cyber-input:hover,
  .cyber-input:focus {
    background: rgba(var(--theme-color-rgb), 0.15);
    box-shadow:
      inset 0 0 10px rgba(var(--theme-color-rgb), 0.3),
      0 0 10px var(--theme-color);
  }

  .scanline {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--theme-color);
    opacity: 0.15;
    pointer-events: none;
    animation: scanline 4s linear infinite;
    z-index: 1;
  }

  @keyframes scanline {
    0% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(50px);
    }
  }
</style>
