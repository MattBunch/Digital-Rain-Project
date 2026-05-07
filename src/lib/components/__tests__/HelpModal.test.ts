import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import HelpModal from '../HelpModal.svelte';

describe('HelpModal', () => {
  it('does not render when isOpen is false', () => {
    render(HelpModal, { props: { isOpen: false, onClose: vi.fn() } });
    expect(screen.queryByText('SYSTEM_MANUAL')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(HelpModal, { props: { isOpen: true, onClose: vi.fn() } });
    expect(screen.getByText('SYSTEM_MANUAL')).toBeInTheDocument();
    expect(screen.getByText('NORMAL_MODE')).toBeInTheDocument();
    expect(screen.getByText('SQUARE_MODE')).toBeInTheDocument();
  });

  it('calls onClose when DISMISS button is clicked', async () => {
    const onClose = vi.fn();
    render(HelpModal, { props: { isOpen: true, onClose } });

    // Multiple layers in CyberButton
    await fireEvent.click(screen.getAllByText('DISMISS')[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(HelpModal, { props: { isOpen: true, onClose } });

    const backdrop = screen.getByLabelText('Close modal');
    await fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();
    render(HelpModal, { props: { isOpen: true, onClose } });

    await fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders key caps for instructions', () => {
    render(HelpModal, { props: { isOpen: true, onClose: vi.fn() } });
    // Check for a few specific keys
    expect(screen.getAllByText('Arrows')[0]).toBeInTheDocument();
    expect(screen.getByText('Space')).toBeInTheDocument();
    expect(screen.getByText('Esc')).toBeInTheDocument();
  });
});
