import { test, expect } from '@playwright/test';

test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads showing the menu and CRT effects', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('DIGITAL RAIN');
    await expect(page.getByRole('button', { name: 'START' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SQUARE' })).toBeVisible();

    // Check for CRT overlay elements
    await expect(page.locator('.scanlines')).toBeVisible();
    await expect(page.locator('.vignette')).toBeVisible();
  });

  test('clicking the disco checkbox toggles UI elements', async ({ page }) => {
    const colorSelect = page.getByLabel('SYSTEM_COLOR:');
    const discoCheckbox = page.getByLabel('DISCO_MODE:');

    await expect(colorSelect).toBeVisible();

    await discoCheckbox.check();
    await expect(colorSelect).not.toBeVisible();
    await expect(page.getByLabel('REFRESH_RATE:')).toBeVisible();

    await discoCheckbox.uncheck();
    await expect(colorSelect).toBeVisible();
  });

  test('help button opens the help modal', async ({ page }) => {
    await page.getByRole('button', { name: 'HELP' }).click();
    await expect(page.getByText('SYSTEM_MANUAL')).toBeVisible();

    // Check for a few keys
    await expect(page.getByText('Arrows').first()).toBeVisible();
    await expect(page.getByText('Esc')).toBeVisible();
    // Close the modal
    await page.getByRole('button', { name: 'DISMISS' }).click();
    await expect(page.getByText('SYSTEM_MANUAL')).not.toBeVisible();
  });

  test('All 4 Directions checkbox toggles state', async ({ page }) => {
    const all4Checkbox = page.getByLabel('ALL_4_DIRECTIONS:');
    await expect(all4Checkbox).not.toBeChecked();

    await all4Checkbox.check();
    await expect(all4Checkbox).toBeChecked();
  });
});
