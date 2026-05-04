import { test, expect } from '@playwright/test';

test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('page loads showing the menu', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('DIGITAL RAIN');
    await expect(page.getByRole('button', { name: 'START' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SQUARE' })).toBeVisible();
  });

  test('clicking the disco checkbox toggles UI elements', async ({ page }) => {
    const colorSelect = page.getByLabel('Colors:');
    const discoCheckbox = page.getByLabel('Disco:');

    await expect(colorSelect).toBeVisible();

    await discoCheckbox.check();
    await expect(colorSelect).not.toBeVisible();
    await expect(page.getByLabel('Frame Count:')).toBeVisible();

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
