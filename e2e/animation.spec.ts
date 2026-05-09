import { test, expect } from '@playwright/test';

test.describe('Animation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('clicking START hides the menu and shows the canvas', async ({ page }) => {
    await page.getByRole('button', { name: 'START' }).first().click();

    await expect(page.locator('h1')).not.toBeVisible();
    await expect(page.locator('main > canvas')).toBeVisible();

    // Pressing Escape returns to menu
    await page.keyboard.press('Escape');
    await expect(page.locator('h1')).toBeVisible();
    // The canvas should be the background one now, so main > canvas (the simulation one) should be gone
    await expect(page.locator('main > canvas')).not.toBeVisible();
  });

  test('clicking SQUARE hides the menu and shows the canvas', async ({ page }) => {
    await page.getByRole('button', { name: 'SQUARE' }).first().click();

    await expect(page.locator('h1')).not.toBeVisible();
    await expect(page.locator('main > canvas')).toBeVisible();

    // Pressing Escape returns to menu
    await page.keyboard.press('Escape');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main > canvas')).not.toBeVisible();
  });
});
