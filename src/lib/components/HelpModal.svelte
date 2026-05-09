<script lang="ts">
  import { helpGroups } from '$lib/constants/HelpData';
  import KeyCap from './KeyCap.svelte';
  import CyberButton from './CyberButton.svelte';
  import BaseModal from './BaseModal.svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    color?: string;
  }

  const { isOpen, onClose, color = '#00ff41' }: Props = $props();
</script>

<BaseModal {isOpen} {onClose} title="SYSTEM_MANUAL" {color}>
  <div class="groups-container">
    {#each helpGroups as group (group.title)}
      <section class="help-group">
        <h3>{group.title}</h3>
        <div class="items-grid">
          {#each group.items as item (item.key)}
            <div class="help-item">
              <div class="key-wrapper">
                <KeyCap {color}>{item.key}</KeyCap>
              </div>
              <span class="description">{item.description}</span>
            </div>
          {/each}
        </div>
      </section>
    {/each}
  </div>

  {#snippet footer()}
    <CyberButton {color} onclick={onClose} variant="primary">DISMISS</CyberButton>
  {/snippet}
</BaseModal>

<style>
  .groups-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 600px) {
    .groups-container {
      grid-template-columns: 1fr;
    }
  }

  .help-group h3 {
    font-family: var(--font-ui);
    font-size: 1.2rem;
    border-bottom: 1px solid rgba(var(--theme-color), 0.2);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }

  .items-grid {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .help-item {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .key-wrapper {
    flex-shrink: 0;
    width: 80px;
    display: flex;
    justify-content: flex-start;
  }

  .description {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    opacity: 0.9;
  }
</style>
