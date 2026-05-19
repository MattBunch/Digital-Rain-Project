import { expect, test } from '@playwright/test';

async function expectCanvasHasVisiblePixels(page: import('@playwright/test').Page) {
  const canvas = page.locator('main > canvas');
  await expect(canvas).toBeVisible();
  await expect
    .poll(async () =>
      canvas.evaluate((node) => {
        const canvasElement = node as HTMLCanvasElement;
        const ctx = canvasElement.getContext('2d');
        if (!ctx || canvasElement.width === 0 || canvasElement.height === 0) {
          return 0;
        }

        const data = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height).data;
        let visiblePixels = 0;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) {
            visiblePixels += 1;
          }
        }

        return visiblePixels;
      }),
    )
    .toBeGreaterThan(0);
}

test.describe('Canvas workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('normal and square modes draw visible canvas pixels', async ({ page }) => {
    await page.getByRole('button', { name: 'START' }).first().click();
    await expectCanvasHasVisiblePixels(page);

    await page.keyboard.press('Escape');
    await expect(page.locator('h1')).toHaveText('DIGITAL RAIN');

    await page.getByRole('button', { name: 'SQUARE' }).first().click();
    await expectCanvasHasVisiblePixels(page);
  });

  test('keyboard changes persist back to the settings menu', async ({ page }) => {
    await page.getByRole('button', { name: 'START' }).first().click();

    await page.keyboard.press('4');
    await page.keyboard.press('g');
    await page.keyboard.press('g');
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();

    await expect(page.getByRole('button', { name: /SYSTEM_COLOR:/i }).last()).toContainText('BLUE');
    await expect(page.getByRole('button', { name: /MOUSE_FIELD:/i }).last()).toContainText(
      'ATTRACT',
    );
  });

  test('URL hash settings are applied on first render and update after edits', async ({ page }) => {
    await page.goto('/?hash-settings=1#c=blue&mi=repel&wd=1&s=24&v=75');
    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();

    await expect(page.getByRole('button', { name: /SYSTEM_COLOR:/i }).last()).toContainText('BLUE');
    await expect(page.getByRole('button', { name: /MOUSE_FIELD:/i }).last()).toContainText('REPEL');
    await expect(page.getByRole('checkbox', { name: /WAVE_DISTORTION/i }).last()).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(page.locator('#font-size').last()).toHaveValue('24');
    await expect(page.locator('#speed').last()).toHaveValue('75');

    await page.locator('#speed').last().fill('90');

    await expect.poll(() => page.evaluate(() => window.location.hash)).toContain('v=90');
  });

  test('custom presets survive reload', async ({ page }) => {
    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();
    await page.locator('#speed').last().fill('88');
    await page.getByTitle('SAVE_PRESET').click();

    await page.locator('#save-preset-input').fill('E2E Preset');
    await page.getByRole('button', { name: 'SAVE_SEQUENCE' }).click();

    await page.reload();
    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();

    const presetSelect = page.getByRole('button', { name: /PRESET:/i }).last();
    await presetSelect.click();
    await page.getByRole('option', { name: 'E2E PRESET' }).click();

    await expect(page.locator('#speed').last()).toHaveValue('88');
  });
});
