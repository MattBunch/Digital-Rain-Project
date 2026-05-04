import { test, expect } from '@playwright/test';

test.describe('Animation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking START hides the menu and shows the canvas', async ({ page }) => {
    await page.getByRole('button', { name: 'START' }).click();

    await expect(page.locator('h1')).not.toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();

    // Pressing Escape returns to menu
    await page.keyboard.press('Escape');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('canvas')).not.toBeVisible();
  });

  test('clicking SQUARE hides the menu and shows the canvas', async ({ page }) => {
    await page.getByRole('button', { name: 'SQUARE' }).click();

    await expect(page.locator('h1')).not.toBeVisible();
    await expect(page.locator('canvas')).toBeVisible();

    // Pressing Escape returns to menu
    await page.keyboard.press('Escape');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('canvas')).not.toBeVisible();
  });
});
