import { test, expect } from '@playwright/test';

const mobileWidths = [320, 375, 390, 428];

async function expectNoHorizontalOverflow(page: import('@playwright/test').Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );

  expect(overflow).toBeLessThanOrEqual(1);
}

test.describe('Mobile layout', () => {
  for (const width of mobileWidths) {
    test(`menu and settings fit at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');

      await expect(page.locator('h1')).toHaveText('DIGITAL RAIN');
      await expectNoHorizontalOverflow(page);

      const frameBox = await page.locator('.hud-frame').first().boundingBox();
      expect(frameBox).not.toBeNull();
      expect(frameBox!.x).toBeGreaterThanOrEqual(0);
      expect(frameBox!.x + frameBox!.width).toBeLessThanOrEqual(width);

      await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();
      await expect(page.locator('.settings-grid')).toBeVisible();
      await expectNoHorizontalOverflow(page);

      const controls = page.locator(
        '.main-actions button, .accordion-header, .select-trigger, .step-btn, .cyber-checkbox, .cyber-square-button',
      );
      const controlCount = await controls.count();

      for (let i = 0; i < controlCount; i += 1) {
        const box = await controls.nth(i).boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(44);
        expect(box!.height).toBeGreaterThanOrEqual(44);
      }

      await page.getByRole('button', { name: /MOUSE_FIELD/i }).scrollIntoViewIfNeeded();
      await expect(page.getByRole('button', { name: /MOUSE_FIELD/i })).toBeVisible();
    });
  }

  test('modals fit narrow mobile screens', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto('/');

    await page.getByRole('button', { name: 'HELP' }).click();
    await expect(page.getByRole('dialog', { name: 'SYSTEM_MANUAL' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.getByRole('button', { name: 'DISMISS' }).click();

    await page.getByRole('button', { name: /SYSTEM_CONFIGURATION/i }).click();
    await page.getByTitle('SAVE_PRESET').click();
    await expect(page.getByRole('dialog', { name: 'SAVE_PRESET' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'SAVE_SEQUENCE' })).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
});
