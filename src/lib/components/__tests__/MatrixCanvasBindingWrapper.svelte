<script lang="ts">
  import MatrixCanvas from '../MatrixCanvas.svelte';
  import type { CoreEngine } from '$lib/engine/CoreEngine';
  import type { MouseInteractionMode } from '$lib/types';

  interface Props {
    engine: CoreEngine;
    mode?: 'normal' | 'square';
    onReturn?: () => void;
    showMobileControls?: boolean;
  }

  const {
    engine,
    mode = 'normal',
    onReturn = () => {},
    showMobileControls = true,
  }: Props = $props();

  let discoOn = $state(false);
  let chosenColor = $state('green');
  let all4Directions = $state(false);
  let all8Directions = $state(false);
  let waveDistortion = $state(false);
  let mouseInteractionMode = $state<MouseInteractionMode>('off');
</script>

<MatrixCanvas
  {engine}
  {mode}
  {onReturn}
  bind:discoOn
  bind:chosenColor
  bind:all4Directions
  bind:all8Directions
  bind:waveDistortion
  bind:mouseInteractionMode
  {showMobileControls}
/>

<output data-testid="chosen-color">{chosenColor}</output>
<output data-testid="disco-on">{String(discoOn)}</output>
