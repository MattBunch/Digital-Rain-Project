import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import AboutModal from '../AboutModal.svelte';

describe('AboutModal', () => {
  it('does not render when isOpen is false', () => {
    render(AboutModal, { props: { isOpen: false, onClose: vi.fn() } });
    expect(screen.queryByText('ABOUT_SYSTEM')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(AboutModal, { props: { isOpen: true, onClose: vi.fn() } });
    expect(screen.getByText('ABOUT_SYSTEM')).toBeInTheDocument();
    expect(screen.getByText('ACCESS_POINTS')).toBeInTheDocument();
  });

  it('calls onClose when DISMISS button is clicked', async () => {
    const onClose = vi.fn();
    render(AboutModal, { props: { isOpen: true, onClose } });

    await fireEvent.click(screen.getAllByText('DISMISS')[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    render(AboutModal, { props: { isOpen: true, onClose } });

    const backdrop = screen.getByLabelText('Close modal');
    await fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', async () => {
    const onClose = vi.fn();
    render(AboutModal, { props: { isOpen: true, onClose } });

    await fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('traps focus and cycles through links and button', async () => {
    render(AboutModal, { props: { isOpen: true, onClose: vi.fn() } });

    // Wait for the auto-focus effect
    await new Promise((resolve) => setTimeout(resolve, 100));

    const focusable = (screen.getAllByRole('link') as HTMLElement[]).concat(
      screen.getAllByText('DISMISS')[0].closest('button') as HTMLElement,
    );

    // Initial focus (first link or dismiss button depending on order)
    // Actually, in BaseModal it focuses the first focusable element.
    // In AboutModal, the first link is likely the MIT license link.
    expect(focusable).toContain(document.activeElement);

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Tab from last to first
    last.focus();
    await fireEvent.keyDown(window, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    // Shift+Tab from first to last
    await fireEvent.keyDown(window, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});
