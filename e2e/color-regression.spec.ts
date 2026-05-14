import { test, expect } from '@playwright/test';

/**
 * Helper to convert hex to rgb string for Playwright CSS assertions.
 * Playwright's toHaveCSS returns computed values, which are usually rgb() or rgba().
 */
function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

const colors = [
  { name: 'green', value: hexToRgb('#00ff41') },
  { name: 'red', value: hexToRgb('#e60000') },
  { name: 'yellow', value: hexToRgb('#ffff00') },
  { name: 'blue', value: hexToRgb('#0000ff') },
  { name: 'orange', value: hexToRgb('#ff9900') },
  { name: 'pink', value: hexToRgb('#ff00ff') },
  { name: 'cyan', value: hexToRgb('#00ffff') },
  { name: 'random', value: 'random' },
];

test.describe('E2E Color Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addInitScript(() => {
      (window as unknown as { IS_E2E: boolean }).IS_E2E = true;
    });
  });

  test('COLOR REGRESSION TEST: cycles through colors and verifies CSS variable updates', async ({
    page,
  }) => {
    // Increase timeout
    test.setTimeout(60000);

    // Open accordion first
    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();

    const menuContainer = page.locator('.menu-container');
    const colorSelect = page.getByRole('button', { name: 'SYSTEM_COLOR:' }).last();

    // Iterate through colors once for stability in E2E
    for (const color of colors) {
      // Open the custom select
      await colorSelect.click();
      await expect(page.getByRole('listbox').last()).toBeVisible();

      // Click the option
      await page.getByRole('option', { name: color.name.toUpperCase() }).last().click();

      const currentThemeColor = await menuContainer.evaluate((el) =>
        el.style.getPropertyValue('--theme-color').trim(),
      );

      if (color.name === 'random') {
        // For random, we just check if it's a valid hex color (SettingsMenu uses hex)
        expect(currentThemeColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
      } else {
        // SettingsMenu sets hex values in --theme-color
        // We can check if it matches the hex value or its rgb equivalent
        // Most browsers return the exact value set in inline style if retrieved via getPropertyValue
        // but let's be flexible.
        const normalizedColor = currentThemeColor.toLowerCase();

        // Actually the colors array value is hexToRgb result.
        // Let's just compare against the known hex values.
        const hexMap: Record<string, string> = {
          green: '#00ff41',
          red: '#e60000',
          yellow: '#ffff00',
          blue: '#0000ff',
          orange: '#ff9900',
          pink: '#ff00ff',
          cyan: '#00ffff',
        };

        if (normalizedColor.startsWith('rgb')) {
          expect(normalizedColor).toBe(color.value);
        } else {
          expect(normalizedColor).toBe(hexMap[color.name]);
        }
      }
    }
  });
});
