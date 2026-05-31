<script lang="ts">
  import SettingsMenu from '../SettingsMenu.svelte';
  import { DEFAULT_SETTINGS } from '$lib/constants/presets';
  import type { IEngineSettings, ThemeMode } from '$lib/types';

  interface Props {
    settings?: IEngineSettings;
    discoColors?: string[];
    onStartNormal?: () => void;
    onStartSquare?: () => void;
  }

  const { discoColors, onStartNormal = () => {}, onStartSquare = () => {} }: Props = $props();

  let settings = $state({ ...DEFAULT_SETTINGS });
  let themeMode = $state<ThemeMode>('system');
</script>

<SettingsMenu bind:settings bind:themeMode {discoColors} {onStartNormal} {onStartSquare} />
