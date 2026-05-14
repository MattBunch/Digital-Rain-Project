import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import SettingsMenuWrapper from './SettingsMenuWrapper.svelte';
import * as matrix from '$lib/constants/matrix';

describe('SettingsMenu', () => {
  it('renders START and SQUARE buttons', () => {
    render(SettingsMenuWrapper);
    expect(screen.getAllByText('START')[0]).toBeInTheDocument();
    expect(screen.getAllByText('SQUARE')[0]).toBeInTheDocument();
  });

  it('clicking START calls onStartNormal prop', async () => {
    const onStartNormal = vi.fn();
    render(SettingsMenuWrapper, { props: { onStartNormal } });
    await fireEvent.click(screen.getAllByText('START')[0]);
    expect(onStartNormal).toHaveBeenCalled();
  });

  it('clicking SQUARE calls onStartSquare prop', async () => {
    const onStartSquare = vi.fn();
    render(SettingsMenuWrapper, { props: { onStartSquare } });
    await fireEvent.click(screen.getAllByText('SQUARE')[0]);
    expect(onStartSquare).toHaveBeenCalled();
  });

  it('disco checkbox toggles discoOn binding', async () => {
    render(SettingsMenuWrapper);

    // Open accordion first
    await fireEvent.click(screen.getByText('SYSTEM_CONFIGURATION'));

    const discoCheckbox = screen.getByRole('checkbox', { name: /DISCO_MODE/i });

    // Initially false, color select should be visible
    expect(screen.getByLabelText(/SYSTEM_COLOR/i)).toBeVisible();

    await fireEvent.click(discoCheckbox);

    // Now true, wait for transitions to finish before checking the DOM
    await waitFor(
      () => {
        expect(screen.queryByLabelText(/SYSTEM_COLOR/i)).not.toBeInTheDocument();
      },
      { timeout: 2000 },
    );
    expect(screen.getByLabelText(/REFRESH_RATE/i)).toBeVisible();
  });

  it('all4Directions checkbox toggles state', async () => {
    render(SettingsMenuWrapper);

    // Open accordion first
    await fireEvent.click(screen.getByText('SYSTEM_CONFIGURATION'));

    const getAll4Checkbox = () => screen.getByRole('checkbox', { name: /ALL_4_DIRECTIONS/i });
    expect(getAll4Checkbox()).toHaveAttribute('aria-checked', 'false');

    await fireEvent.click(getAll4Checkbox());

    // Wait for transition and key re-render
    await waitFor(() => {
      expect(getAll4Checkbox()).toHaveAttribute('aria-checked', 'true');
    });
  });

  it('clicking HELP opens the HelpModal', async () => {
    render(SettingsMenuWrapper);

    // HelpModal should not be visible initially
    expect(screen.queryByText('SYSTEM_MANUAL')).not.toBeInTheDocument();

    await fireEvent.click(screen.getAllByText('HELP')[0]);

    // HelpModal should now be visible
    expect(screen.getByText('SYSTEM_MANUAL')).toBeInTheDocument();
  });

  it('clicking save preset opens the SavePresetModal', async () => {
    render(SettingsMenuWrapper);

    // Open accordion first
    await fireEvent.click(screen.getByText('SYSTEM_CONFIGURATION'));

    // SavePresetModal should not be visible initially
    expect(screen.queryByText('SAVE_PRESET')).not.toBeInTheDocument();

    const saveButton = screen.getByTitle('SAVE_PRESET');
    await fireEvent.click(saveButton);

    // SavePresetModal should now be visible
    expect(screen.getByText('SAVE_PRESET')).toBeInTheDocument();
  });

  it('COLOR REGRESSION TEST: cycles through colors and updates style correctly', async () => {
    const { container } = render(SettingsMenuWrapper);

    // Open accordion first
    await fireEvent.click(screen.getByText('SYSTEM_CONFIGURATION'));

    const menuContainer = container.querySelector('.menu-container') as HTMLElement;
    const colors = [
      { name: 'green', value: matrix.COLORS.MATRIX_GREEN },
      { name: 'red', value: matrix.COLORS.RED_VARIANTS[2] },
      { name: 'yellow', value: matrix.COLORS.YELLOW_VARIANTS[2] },
      { name: 'blue', value: matrix.COLORS.BLUE_VARIANTS[2] },
      { name: 'orange', value: matrix.COLORS.ORANGE_VARIANTS[2] },
      { name: 'pink', value: matrix.COLORS.PINK_VARIANTS[2] },
      { name: 'cyan', value: matrix.COLORS.CYAN_VARIANTS[2] },
      { name: 'random', value: 'random' },
    ];

    for (const color of colors) {
      // Re-query color select trigger because it re-renders on color change
      const colorSelectTrigger = screen.getByLabelText(/SYSTEM_COLOR/i);

      // Open dropdown
      await fireEvent.click(colorSelectTrigger);

      // Click option
      const option = await screen.findByRole('option', { name: new RegExp(color.name, 'i') });
      await fireEvent.click(option);

      await waitFor(
        () => {
          const style = menuContainer.getAttribute('style') || '';
          if (color.name === 'random') {
            const match = style.match(
              /--theme-color:\s*(rgb\(\d+,\s*\d+,\s*\d+\)|#[0-9A-Fa-f]{6})/,
            );
            expect(match).toBeTruthy();
          } else {
            const themeColor = menuContainer.style.getPropertyValue('--theme-color').trim();
            if (themeColor.startsWith('rgb')) {
              expect(themeColor).not.toBe('');
            } else {
              expect(themeColor.toLowerCase()).toBe(color.value.toLowerCase());
            }
          }
        },
        { timeout: 1000 },
      );
    }
  }, 10000);

  it('automatically identifies presets when settings match', async () => {
    render(SettingsMenuWrapper);

    // Open accordion first
    await fireEvent.click(screen.getByText('SYSTEM_CONFIGURATION'));

    const getPresetSelect = () => screen.getByLabelText(/PRESET:/i);

    // Should start with Classic Matrix (default)
    expect(getPresetSelect()).toHaveTextContent(/CLASSIC MATRIX/i);

    // Select Cyberpunk Pink preset via dropdown to verify logic
    await fireEvent.click(getPresetSelect());
    const pinkOption = await screen.findByRole('option', { name: /CYBERPUNK PINK/i });
    await fireEvent.click(pinkOption);

    await waitFor(() => {
      expect(getPresetSelect()).toHaveTextContent(/CYBERPUNK PINK/i);
    });

    // Change a setting manually (e.g., speed) -> should switch to CUSTOM
    const speedInput = screen.getByLabelText(/SPEED:/i);
    await fireEvent.input(speedInput, { target: { value: '99' } });

    await waitFor(() => {
      expect(getPresetSelect()).toHaveTextContent(/CUSTOM/i);
    });

    // Change settings back to match Classic Matrix (green, normal, speed 50, etc)
    await waitFor(() => {
      const colorSelect = screen.getByLabelText(/SYSTEM_COLOR/i);
      return colorSelect;
    });

    await fireEvent.click(screen.getByLabelText(/SYSTEM_COLOR/i));
    const greenOption = await screen.findByRole('option', { name: /GREEN/i });
    await fireEvent.click(greenOption);

    await waitFor(() => {
      const speedInput = screen.getByLabelText(/SPEED:/i);
      return speedInput;
    });
    await fireEvent.input(screen.getByLabelText(/SPEED:/i), { target: { value: '50' } });

    await waitFor(async () => {
      const all4Checkbox = screen.getByRole('checkbox', { name: /ALL_4_DIRECTIONS/i });
      if (all4Checkbox.getAttribute('aria-checked') === 'true') {
        await fireEvent.click(all4Checkbox);
      }
      // Wait for it to become false if it was true
      expect(screen.getByRole('checkbox', { name: /ALL_4_DIRECTIONS/i })).toHaveAttribute(
        'aria-checked',
        'false',
      );
    });

    await waitFor(
      () => {
        expect(getPresetSelect()).toHaveTextContent(/CLASSIC MATRIX/i);
      },
      { timeout: 2000 },
    );
  });
});
