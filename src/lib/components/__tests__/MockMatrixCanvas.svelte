<script lang="ts">
  import { onMount } from 'svelte';
  import type { CoreEngine } from '$lib/engine/CoreEngine';

  const { onReturn, engine, mode } = $props<{
    onReturn: () => void;
    engine: CoreEngine;
    mode: 'normal' | 'square';
    showMobileControls?: boolean;
  }>();

  onMount(() => {
    const testWindow = window as unknown as {
      __matrixCanvasInstances?: { engine: CoreEngine; mode: 'normal' | 'square' }[];
    };

    testWindow.__matrixCanvasInstances ??= [];
    const instance = { engine, mode };
    testWindow.__matrixCanvasInstances.push(instance);

    return () => {
      testWindow.__matrixCanvasInstances = testWindow.__matrixCanvasInstances?.filter(
        (currentInstance) => currentInstance !== instance,
      );
    };
  });
</script>

<button onclick={onReturn}>MOCK_RETURN</button>
