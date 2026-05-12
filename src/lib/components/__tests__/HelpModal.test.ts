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
    expect(screen.getByText('CONTROLS')).toBeInTheDocument();
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

    // Backdrop has role="button" but is not focusable (tabindex="-1")
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

  it('traps focus when open', async () => {
    const onClose = vi.fn();
    render(HelpModal, { props: { isOpen: true, onClose } });

    // Wait for the auto-focus effect
    await new Promise((resolve) => setTimeout(resolve, 100));

    // DISMISS button should be focused (it's in the footer snippet)
    const dismissBtn = screen.getAllByText('DISMISS')[0].closest('button');
    expect(document.activeElement).toBe(dismissBtn);

    // In HelpModal, the only focusable element is usually the DISMISS button
    // unless there are links in the content. Let's verify Tab stays on it if it's the only one
    // OR if there are others, it cycles.
    await fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(dismissBtn);
  });
});
