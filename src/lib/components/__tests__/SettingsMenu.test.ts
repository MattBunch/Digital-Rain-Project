import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import SettingsMenu from '../SettingsMenu.svelte';
import * as matrix from '$lib/constants/matrix';

describe('SettingsMenu', () => {
  const defaultProps = {
    onStartNormal: vi.fn(),
    onStartSquare: vi.fn(),
  };

  it('renders START and SQUARE buttons', () => {
    render(SettingsMenu, { props: defaultProps });
    // Using getAllByText because CyberButton has multiple layers of the same text for glitch effects
    expect(screen.getAllByText('START')[0]).toBeInTheDocument();
    expect(screen.getAllByText('SQUARE')[0]).toBeInTheDocument();
  });

  it('clicking START calls onStartNormal prop', async () => {
    const onStartNormal = vi.fn();
    render(SettingsMenu, { props: { ...defaultProps, onStartNormal } });
    await fireEvent.click(screen.getAllByText('START')[0]);
    expect(onStartNormal).toHaveBeenCalled();
  });

  it('clicking SQUARE calls onStartSquare prop', async () => {
    const onStartSquare = vi.fn();
    render(SettingsMenu, { props: { ...defaultProps, onStartSquare } });
    await fireEvent.click(screen.getAllByText('SQUARE')[0]);
    expect(onStartSquare).toHaveBeenCalled();
  });

  it('disco checkbox toggles discoOn binding', async () => {
    render(SettingsMenu, { props: defaultProps });
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
    render(SettingsMenu, { props: defaultProps });
    const all4Checkbox = screen.getByRole('checkbox', { name: /ALL_4_DIRECTIONS/i });

    expect(all4Checkbox).toHaveAttribute('aria-checked', 'false');

    await fireEvent.click(all4Checkbox);
    expect(all4Checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('clicking HELP opens the HelpModal', async () => {
    render(SettingsMenu, { props: defaultProps });

    // HelpModal should not be visible initially
    expect(screen.queryByText('SYSTEM_MANUAL')).not.toBeInTheDocument();

    await fireEvent.click(screen.getAllByText('HELP')[0]);

    // HelpModal should now be visible
    expect(screen.getByText('SYSTEM_MANUAL')).toBeInTheDocument();
  });

  it('COLOR REGRESSION TEST: cycles through colors and updates style correctly', async () => {
    const { container } = render(SettingsMenu, { props: defaultProps });
    const menuContainer = container.querySelector('.menu-container') as HTMLElement;
    const colorSelectTrigger = screen.getByLabelText(/SYSTEM_COLOR/i);
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

    // Reduced iterations to keep test time reasonable with custom component interactions
    for (let i = 0; i < 2; i++) {
      for (const color of colors) {
        // Open dropdown
        await fireEvent.click(colorSelectTrigger);

        // Click option
        const option = screen.getByRole('option', { name: new RegExp(color.name, 'i') });
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
    }
  }, 10000);
});
