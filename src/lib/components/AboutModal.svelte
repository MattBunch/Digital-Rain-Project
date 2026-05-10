<script lang="ts">
  import BaseModal from './BaseModal.svelte';
  import KeyCap from './KeyCap.svelte';
  import CyberButton from './CyberButton.svelte';
  import { aboutLinks, projectInfo, licenseInfo } from '$lib/constants/AboutData';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    color?: string;
  }

  const { isOpen, onClose, color = '#00ff41' }: Props = $props();
</script>

<BaseModal {isOpen} {onClose} title="ABOUT_SYSTEM" {color}>
  <div class="about-content">
    <section class="info-section">
      <p class="description">{projectInfo.description}</p>
      <div class="meta-grid">
        <div class="meta-item">
          <span class="label">VERSION:</span>
          <span class="value">{projectInfo.version}</span>
        </div>
        <div class="meta-item">
          <span class="label">LICENSE:</span>
          <a href={licenseInfo.url} target="_blank" rel="noopener noreferrer" class="value link">
            {licenseInfo.type}
          </a>
        </div>
      </div>
    </section>

    <section class="links-section">
      <h3>ACCESS_POINTS</h3>
      <div class="links-grid">
        {#each aboutLinks as link (link.label)}
          <a href={link.url} target="_blank" rel="noopener noreferrer" class="cyber-link">
            <KeyCap {color}>{link.label}</KeyCap>
          </a>
        {/each}
      </div>
    </section>
  </div>

  {#snippet footer()}
    <CyberButton {color} onclick={onClose} variant="primary">DISMISS</CyberButton>
  {/snippet}
</BaseModal>

<style>
  .about-content {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    font-family: var(--font-mono);
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
    opacity: 0.9;
  }

  .meta-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .meta-item {
    display: flex;
    gap: 1rem;
    font-size: 0.9rem;
  }

  .label {
    opacity: 0.6;
    min-width: 80px;
  }

  .value {
    color: var(--theme-color);
  }

  .link {
    text-decoration: none;
    border-bottom: 1px dashed var(--theme-color);
  }

  .link:hover {
    background: var(--theme-color);
    color: black;
  }

  h3 {
    font-family: var(--font-ui);
    font-size: 1.2rem;
    border-bottom: 1px solid rgba(var(--theme-color), 0.2);
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }

  .links-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .cyber-link {
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
  }

  .cyber-link:hover {
    transform: translateY(-2px);
  }
</style>
