<script lang="ts">
  import SettingsMenu from '../SettingsMenu.svelte';
  import { DEFAULT_SETTINGS } from '$lib/constants/presets';
  import type { IEngineSettings } from '$lib/types';

  interface Props {
    settings?: IEngineSettings;
    onStartNormal?: () => void;
    onStartSquare?: () => void;
  }

  const { onStartNormal = () => {}, onStartSquare = () => {} }: Props = $props();

  let settings = $state({ ...DEFAULT_SETTINGS });
</script>

<SettingsMenu bind:settings {onStartNormal} {onStartSquare} />
