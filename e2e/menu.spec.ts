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

  test('All 4 Directions button text changes on click', async ({ page }) => {
    const all4Btn = page.getByRole('button', { name: /All 4 Directions/ });
    await expect(all4Btn).toContainText('OFF');

    await all4Btn.click();
    await expect(all4Btn).toContainText('ON');
  });
});
