import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import SavePresetModal from '../SavePresetModal.svelte';

describe('SavePresetModal', () => {
  it('renders when open', () => {
    render(SavePresetModal, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
        onSave: vi.fn(),
      },
    });

    expect(screen.getByText('SAVE_PRESET')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ENTER_PRESET_NAME...')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(SavePresetModal, {
      props: {
        isOpen: false,
        onClose: vi.fn(),
        onSave: vi.fn(),
      },
    });

    expect(screen.queryByText('SAVE_PRESET')).not.toBeInTheDocument();
  });

  it('calls onSave and onClose when clicking save with a name', async () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(SavePresetModal, {
      props: {
        isOpen: true,
        onClose,
        onSave,
      },
    });

    const input = screen.getByPlaceholderText('ENTER_PRESET_NAME...');
    await fireEvent.input(input, { target: { value: 'My Preset' } });

    const saveButton = screen.getAllByText('SAVE_SEQUENCE')[0];
    await fireEvent.click(saveButton);

    expect(onSave).toHaveBeenCalledWith('My Preset');
    expect(onClose).toHaveBeenCalled();
  });

  it('save button is disabled when input is empty', () => {
    render(SavePresetModal, {
      props: {
        isOpen: true,
        onClose: vi.fn(),
        onSave: vi.fn(),
      },
    });

    const saveButton = screen.getAllByText('SAVE_SEQUENCE')[0].closest('button');
    expect(saveButton).toBeDisabled();
  });

  it('calls onClose when clicking cancel', async () => {
    const onClose = vi.fn();
    render(SavePresetModal, {
      props: {
        isOpen: true,
        onClose,
        onSave: vi.fn(),
      },
    });

    const cancelButton = screen.getAllByText('CANCEL')[0];
    await fireEvent.click(cancelButton);

    expect(onClose).toHaveBeenCalled();
  });
});
