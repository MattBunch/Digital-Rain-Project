import { render, screen, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CyberCheckbox from '../CyberCheckbox.svelte';

describe('CyberCheckbox', () => {
  it('renders with label', () => {
    render(CyberCheckbox, { props: { id: 'test-cb', label: 'TEST_LABEL', checked: false } });
    expect(screen.getByText('TEST_LABEL')).toBeInTheDocument();
  });

  it('toggles state on click', async () => {
    render(CyberCheckbox, { props: { id: 'test-cb', label: 'TEST_LABEL', checked: false } });
    const checkbox = screen.getByRole('checkbox', { name: /TEST_LABEL/i });

    await fireEvent.click(checkbox);
    // Since we're using bindable props in Svelte 5, we can check the internal state side effects
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('toggles state on space keydown', async () => {
    render(CyberCheckbox, { props: { id: 'test-cb', label: 'TEST_LABEL', checked: false } });
    const checkbox = screen.getByRole('checkbox', { name: /TEST_LABEL/i });

    await fireEvent.keyDown(checkbox, { key: ' ' });
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('applies color prop', () => {
    render(CyberCheckbox, {
      props: { id: 'test-cb', label: 'TEST_LABEL', color: '#ff0000', checked: true },
    });
    const checkbox = screen.getByRole('checkbox', { name: /TEST_LABEL/i });
    expect(checkbox).toHaveStyle('--theme-color: #ff0000');
  });
});
