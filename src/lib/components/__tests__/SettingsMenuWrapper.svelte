<script lang="ts">
  import SettingsMenu from '../SettingsMenu.svelte';
  import { DEFAULT_SETTINGS } from '$lib/constants/presets';
  import type { IEngineSettings } from '$lib/types';

  interface Props {
    settings?: IEngineSettings;
    discoColors?: string[];
    onStartNormal?: () => void;
    onStartSquare?: () => void;
  }

  const { discoColors, onStartNormal = () => {}, onStartSquare = () => {} }: Props = $props();

  let settings = $state({ ...DEFAULT_SETTINGS });
</script>

<SettingsMenu bind:settings {discoColors} {onStartNormal} {onStartSquare} />
