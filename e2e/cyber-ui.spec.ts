import { test, expect } from '@playwright/test';

test.describe('Cyber UI Effects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('buttons have cyber styling and effects', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: 'START' });

    // Check for clip-path styling
    const clipPath = await startBtn.evaluate((el) => window.getComputedStyle(el).clipPath);
    expect(clipPath).not.toBe('none');

    // Hover and check for glitch layers (they should become visible)
    const glitchLayer = startBtn.locator('.glitch-layer').first();
    await expect(glitchLayer).not.toBeVisible();

    await startBtn.hover();
    // In E2E, we might need to wait for the animation/hover state
    await expect(glitchLayer).toBeVisible();
  });

  test('background matrix rain is present', async ({ page }) => {
    const backgroundRain = page.locator('.background-rain');
    await expect(backgroundRain).toBeVisible();

    // Check if it contains a canvas
    const canvas = backgroundRain.locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('fonts are loaded correctly', async ({ page }) => {
    // Check if the title uses the glitch font
    const title = page.locator('h1');
    const fontFamily = await title.evaluate((el) => window.getComputedStyle(el).fontFamily);
    expect(fontFamily).toContain('Rubik Glitch Pop');
  });
});
