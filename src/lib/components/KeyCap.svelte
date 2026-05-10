<script lang="ts">
  import { scramble } from '$lib/utils/ScrambleAction';
  import { glitchClick } from '$lib/utils/GlitchAction';

  interface Props {
    children?: import('svelte').Snippet;
    color?: string;
  }

  const { children, color = 'var(--theme-color, #00ff41)' }: Props = $props();
</script>

<span class="key-cap" style:--key-color={color} use:scramble use:glitchClick={{ color }}>
  {@render children?.()}
</span>

<style>
  .key-cap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 2.5rem;
    height: 1.8rem;
    padding: 0 0.5rem;
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid var(--key-color);
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: bold;
    color: var(--key-color);
    box-shadow: 0 0 5px var(--key-color);
    text-transform: uppercase;
    position: relative;
    top: -1px;
    user-select: none;
  }

  .key-cap::after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 2px;
    right: 2px;
    height: 2px;
    background: var(--key-color);
    opacity: 0.5;
    border-radius: 2px;
  }
</style>
