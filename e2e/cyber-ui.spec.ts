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

  test('help modal has cyberpunk styling and key caps', async ({ page }) => {
    await page.getByRole('button', { name: 'HELP' }).click();

    const modal = page.locator('.modal-container');
    await expect(modal).toBeVisible();

    // Check for backdrop blur
    const backdrop = page.locator('.modal-backdrop');
    const backdropFilter = await backdrop.evaluate(
      (el) => window.getComputedStyle(el).backdropFilter,
    );
    expect(backdropFilter).toContain('blur');

    // Check for key caps
    const keyCap = page.locator('.key-cap').first();
    await expect(keyCap).toBeVisible();

    // Check for HUD frame borders
    const hudFrame = modal.locator('.hud-frame');
    const border = await hudFrame.evaluate((el) => window.getComputedStyle(el).border);
    expect(border).not.toBe('none');
  });

  test('CyberCheckbox has correct styling and state', async ({ page }) => {
    // Open accordion first
    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();

    const checkbox = page.locator('.cyber-checkbox').first();
    await expect(checkbox).toBeVisible();

    // Check for clip-path styling
    const clipPath = await checkbox.evaluate((el) => window.getComputedStyle(el).clipPath);
    expect(clipPath).toContain('polygon');

    // Toggle and check aria-checked
    await checkbox.click();
    await expect(checkbox).toHaveAttribute('aria-checked', 'true');

    // Check for checkmark visibility
    const checkmark = checkbox.locator('.checkmark');
    await expect(checkmark).toBeVisible();
  });

  test('falling letters appear on interaction', async ({ page }) => {
    // Open accordion first
    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();

    // Initial check: no falling letters (spans in body)
    const initialSpans = await page.locator('body > span').count();

    // Interact with a checkbox
    const checkbox = page.locator('.cyber-checkbox').first();
    await expect(checkbox).toBeVisible();
    await checkbox.click();

    // Spans should be spawned
    const activeSpans = await page.locator('body > span').count();
    expect(activeSpans).toBeGreaterThan(initialSpans);

    // Check color of a spawned letter (it should be green by default or match theme)
    const span = page.locator('body > span').first();
    const color = await span.evaluate((el) => window.getComputedStyle(el).color);
    expect(color).toMatch(/rgb/);
  });
});
