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

  test('pressing T toggles All 4 Directions and persists to menu', async ({ page }) => {
    await page.getByRole('button', { name: 'START' }).first().click();

    // Toggle on
    await page.keyboard.press('t');

    // Return to menu
    await page.keyboard.press('Escape');

    // Open configuration
    await page.getByText('SYSTEM_CONFIGURATION').click();

    // Verify checkbox is checked
    const checkbox = page.getByRole('checkbox', { name: /ALL_4_DIRECTIONS/i });
    await expect(checkbox).toBeChecked();

    // Start again, toggle off
    await page.getByRole('button', { name: 'START' }).first().click();
    await page.keyboard.press('t');
    await page.keyboard.press('Escape');

    // Open configuration again
    await page.getByText('SYSTEM_CONFIGURATION').click();
    await expect(checkbox).not.toBeChecked();
  });

  test('pressing X toggles Wave Distortion and persists to menu', async ({ page }) => {
    await page.getByRole('button', { name: 'START' }).first().click();

    await page.keyboard.press('x');
    await page.keyboard.press('Escape');

    await page.getByText('SYSTEM_CONFIGURATION').click();

    const checkbox = page.getByRole('checkbox', { name: /WAVE_DISTORTION/i });
    await expect(checkbox).toBeChecked();

    await page.getByRole('button', { name: 'START' }).first().click();
    await page.keyboard.press('x');
    await page.keyboard.press('Escape');

    await page.getByText('SYSTEM_CONFIGURATION').click();
    await expect(checkbox).not.toBeChecked();
  });
});
