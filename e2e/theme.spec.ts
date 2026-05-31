import { expect, test } from '@playwright/test';

async function getRootTheme(page: import('@playwright/test').Page) {
  return page.evaluate(() => document.documentElement.dataset.theme);
}

async function blockAppBundle(page: import('@playwright/test').Page) {
  await page.route('**/src/main.ts', async (route) => {
    await route.fulfill({
      contentType: 'text/javascript',
      body: '',
    });
  });
}

async function setStoredTheme(
  page: import('@playwright/test').Page,
  themeMode: 'system' | 'dark' | 'light',
) {
  await page.addInitScript((storedTheme) => {
    localStorage.setItem('digital-rain-theme-mode', storedTheme);
  }, themeMode);
}

test.describe('Theme modes', () => {
  test('applies stored dark theme before the app bundle loads', async ({ page }) => {
    await blockAppBundle(page);
    await setStoredTheme(page, 'dark');

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect.poll(() => getRootTheme(page)).toBe('dark');
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(0, 0, 0)');
  });

  test('applies stored light theme before the app bundle loads', async ({ page }) => {
    await blockAppBundle(page);
    await setStoredTheme(page, 'light');

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    await expect.poll(() => getRootTheme(page)).toBe('light');
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(244, 241, 232)');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(244, 241, 232)');
  });

  test('system mode follows OS preference and falls back to dark', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/');
    await expect.poll(() => getRootTheme(page)).toBe('dark');

    await page.emulateMedia({ colorScheme: 'light' });
    await expect.poll(() => getRootTheme(page)).toBe('light');
  });

  test('user selected light and dark modes override system and persist', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();
    const displayMode = page.getByLabel(/DISPLAY_MODE/i).last();

    await displayMode.click();
    await page.getByRole('option', { name: 'DARK' }).last().click();
    await expect.poll(() => getRootTheme(page)).toBe('dark');

    await page.reload();
    await expect.poll(() => getRootTheme(page)).toBe('dark');

    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();
    await page
      .getByLabel(/DISPLAY_MODE/i)
      .last()
      .click();
    await page.getByRole('option', { name: 'LIGHT' }).last().click();
    await expect.poll(() => getRootTheme(page)).toBe('light');
  });

  test('light mode menu controls remain readable', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/');

    await expect.poll(() => getRootTheme(page)).toBe('light');
    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();

    const frame = page.locator('.hud-frame').first();
    const startButton = page.getByRole('button', { name: 'START' }).first();
    const colorSelect = page.getByLabel(/SYSTEM_COLOR/i).last();

    await expect(frame).toHaveCSS('background-color', /rgba\(255, 255, 255/);
    await expect(startButton).toHaveCSS('color', 'rgb(20, 23, 22)');
    await expect(colorSelect).toHaveCSS('color', 'rgb(20, 23, 22)');

    await colorSelect.click();
    const greenOption = page.getByRole('option', { name: 'GREEN' }).last();
    await expect(greenOption).toHaveCSS('color', 'rgb(17, 21, 20)');

    const backgroundRainOpacity = await page.locator('.background-rain').evaluate((element) => {
      return window.getComputedStyle(element).opacity;
    });
    expect(Number(backgroundRainOpacity)).toBeGreaterThan(0);
    expect(Number(backgroundRainOpacity)).toBeLessThanOrEqual(0.25);
  });
});
