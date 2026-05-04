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
  test('COLOR REGRESSION TEST: cycles through colors 20 times and verifies DOM updates', async ({
    page,
  }) => {
    // Increase timeout for the 160 iterations
    test.setTimeout(60000);

    await page.goto('/');
    const menuContainer = page.locator('.menu-container');
    const colorSelect = page.getByLabel('Colors:');

    for (let i = 0; i < 20; i++) {
      for (const color of colors) {
        // Change the select value
        await colorSelect.selectOption(color.name);

        if (color.name === 'random') {
          // For random, we just check if it's a valid rgb color
          const currentColor = await menuContainer.evaluate(
            (el) => window.getComputedStyle(el).color,
          );
          expect(currentColor).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
        } else {
          // For fixed colors, assert the exact computed RGB value
          await expect(menuContainer).toHaveCSS('color', color.value);
        }
      }
    }
  });
});
