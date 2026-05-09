import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import CyberSelect from '../CyberSelect.svelte';

describe('CyberSelect', () => {
  const options = ['green', 'red', 'blue'];

  it('renders with label and initial value', () => {
    render(CyberSelect, {
      props: {
        value: 'green',
        options,
        label: 'SYSTEM_COLOR',
        id: 'test-select',
      },
    });

    expect(screen.getByText('SYSTEM_COLOR')).toBeInTheDocument();
    // Use getAllByText because of glitch layers
    expect(screen.getAllByText('GREEN')[0]).toBeInTheDocument();
  });

  it('toggles dropdown visibility on click', async () => {
    render(CyberSelect, {
      props: {
        value: 'green',
        options,
      },
    });

    const trigger = screen.getByRole('button');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);

    await fireEvent.click(trigger);
    // Wait for transition to complete and element to be removed from DOM
    await waitFor(
      () => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it('selects an option and updates value', async () => {
    render(CyberSelect, {
      props: {
        value: 'green',
        options,
      },
    });

    const trigger = screen.getByRole('button');
    await fireEvent.click(trigger);

    const redOption = screen.getAllByRole('option').find((el) => el.textContent?.trim() === 'RED');

    if (!redOption) {
      throw new Error('RED option not found');
    }
    await fireEvent.click(redOption);

    // Trigger text should update to RED
    await waitFor(() => {
      // Find the text in the trigger, not the option (which should be gone)
      const triggerText = trigger.querySelector('.value-text');
      expect(triggerText?.textContent?.trim()).toBe('RED');
    });
  });

  it('closes on outside click', async () => {
    render(CyberSelect, {
      props: {
        value: 'green',
        options,
      },
    });

    const trigger = screen.getByRole('button');
    await fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Click outside
    await fireEvent.click(document.body);

    await waitFor(
      () => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it('handles keyboard navigation (Enter/Space to toggle)', async () => {
    render(CyberSelect, {
      props: {
        value: 'green',
        options,
      },
    });

    const trigger = screen.getByRole('button');

    await fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await fireEvent.keyDown(trigger, { key: ' ' }); // Space
    await waitFor(
      () => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it('handles keyboard navigation (Escape to close)', async () => {
    render(CyberSelect, {
      props: {
        value: 'green',
        options,
      },
    });

    const trigger = screen.getByRole('button');
    await fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await fireEvent.keyDown(trigger, { key: 'Escape' });
    await waitFor(
      () => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});
