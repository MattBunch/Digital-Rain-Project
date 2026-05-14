<script lang="ts">
  import BaseModal from './BaseModal.svelte';
  import CyberTextInput from './CyberTextInput.svelte';
  import CyberButton from './CyberButton.svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    color?: string;
  }

  const { isOpen, onClose, onSave, color = '#00ff41' }: Props = $props();

  let presetName = $state('');

  function handleSave() {
    if (presetName.trim()) {
      onSave(presetName.trim());
      presetName = '';
      onClose();
    }
  }

  function handleKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSave();
    }
  }

  // Reset name when modal opens
  $effect(() => {
    if (isOpen) {
      presetName = '';
    }
  });
</script>

<BaseModal {isOpen} {onClose} title="SAVE_PRESET" {color}>
  <div class="save-modal-content">
    <p class="instruction">IDENTIFY_DATA_STREAM:</p>
    <CyberTextInput
      bind:value={presetName}
      placeholder="ENTER_PRESET_NAME..."
      {color}
      label="PRESET_ID"
      id="save-preset-input"
      onkeypress={handleKeypress}
    />
  </div>

  {#snippet footer()}
    <div class="modal-actions">
      <CyberButton {color} onclick={onClose} variant="secondary">CANCEL</CyberButton>
      <CyberButton {color} onclick={handleSave} variant="primary" disabled={!presetName.trim()}>
        SAVE_SEQUENCE
      </CyberButton>
    </div>
  {/snippet}
</BaseModal>

<style>
  .save-modal-content {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 1rem 0;
  }

  .instruction {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    opacity: 0.7;
    margin: 0;
  }

  .modal-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    width: 100%;
  }
</style>
