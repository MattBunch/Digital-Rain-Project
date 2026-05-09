<script lang="ts">
  import { scramble } from '$lib/utils/ScrambleAction';
  import { hexToRgb } from '$lib/utils/MathUtils';

  interface Props {
    value: number;
    min?: number;
    max?: number;
    color?: string;
    label?: string;
    id?: string;
  }

  /* eslint-disable prefer-const */
  let { value = $bindable(10), min = 1, max = 100, color = '#00ff41', label, id }: Props = $props();
  /* eslint-enable prefer-const */

  const colorRgb = $derived(hexToRgb(color));

  function increment() {
    value = Math.min(max, value + 1);
  }

  function decrement() {
    value = Math.max(min, value - 1);
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    let newValue = parseInt(target.value);

    if (isNaN(newValue)) {
      return;
    }

    if (newValue < min) {
      newValue = min;
    }
    if (newValue > max) {
      newValue = max;
    }

    value = newValue;
    // Force the input to show the clamped value if it was out of bounds
    target.value = value.toString();
  }
</script>

<div class="cyber-numeric-container" style:--theme-color={color} style:--theme-color-rgb={colorRgb}>
  {#if label}
    <label for={id} class="cyber-label" use:scramble={label}>
      {label}
    </label>
  {/if}

  <div class="stepper-wrapper">
    <button type="button" class="step-btn decrement" onclick={decrement} aria-label="Decrease">
      [ - ]
    </button>

    <div class="input-glow-wrapper">
      <input
        {id}
        type="number"
        {value}
        {min}
        {max}
        oninput={handleInput}
        class="cyber-input"
        autocomplete="off"
      />
      <div class="scanline"></div>
    </div>

    <button type="button" class="step-btn increment" onclick={increment} aria-label="Increase">
      [ + ]
    </button>
  </div>
</div>

<style>
  .cyber-numeric-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    font-family: var(--font-mono);
    width: 200px;
    align-items: flex-end;
  }

  .cyber-label {
    color: var(--theme-color);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 2px;
  }

  .stepper-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
  }

  .input-glow-wrapper {
    position: relative;
    flex-grow: 1;
    overflow: hidden;
    /* Maintain the clip-path on the wrapper to clip the scanline */
    clip-path: polygon(0% 0%, 90% 0%, 100% 30%, 100% 100%, 10% 100%, 0% 70%);
  }

  .cyber-input {
    background: rgba(0, 0, 0, 0.85);
    border: 1px solid var(--theme-color);
    padding: 10px 5px;
    color: var(--theme-color);
    font-family: var(--font-mono);
    font-size: 1.1rem;
    outline: none;
    width: 100%;
    text-align: center;
    box-sizing: border-box;
    transition: all 0.2s ease;
    appearance: textfield;
    -moz-appearance: textfield;
  }

  /* Hide native arrows */
  .cyber-input::-webkit-outer-spin-button,
  .cyber-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .cyber-input:hover,
  .cyber-input:focus {
    background: rgba(var(--theme-color-rgb), 0.15);
    box-shadow: inset 0 0 10px rgba(var(--theme-color-rgb), 0.3);
  }

  .step-btn {
    background: transparent;
    border: none;
    color: var(--theme-color);
    font-family: var(--font-mono);
    cursor: pointer;
    font-size: 1.1rem;
    padding: 5px;
    transition: all 0.2s ease;
    user-select: none;
  }

  .step-btn:hover {
    text-shadow: 0 0 10px var(--theme-color);
    transform: scale(1.2);
    filter: brightness(1.2);
  }

  .step-btn:active {
    transform: scale(0.9);
    filter: brightness(1.5);
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
