import { test, expect } from '@playwright/test';

test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addInitScript(() => {
      (window as unknown as { IS_E2E: boolean }).IS_E2E = true;
    });
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
    // Open accordion first
    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();

    const colorSelect = page.getByLabel(/SYSTEM_COLOR/i).last();
    await expect(colorSelect).toBeVisible();

    const discoCheckbox = page.getByRole('checkbox', { name: /DISCO_MODE/i }).last();

    await discoCheckbox.click();
    await expect(colorSelect).not.toBeVisible();
    await expect(page.getByLabel(/REFRESH_RATE/i).last()).toBeVisible();

    await discoCheckbox.click();
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
    // Open accordion first
    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();

    const all4Checkbox = page.getByRole('checkbox', { name: /ALL_4_DIRECTIONS/i }).last();
    await expect(all4Checkbox).toHaveAttribute('aria-checked', 'false');

    await all4Checkbox.click();
    await expect(page.getByRole('checkbox', { name: /ALL_4_DIRECTIONS/i }).last()).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });
});
