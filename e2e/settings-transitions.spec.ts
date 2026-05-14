import { test, expect } from '@playwright/test';

test.describe('Settings Global Transitions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.addInitScript(() => {
      (window as unknown as { IS_E2E: boolean }).IS_E2E = true;
    });
    // Open system configuration
    await page.getByText('SYSTEM_CONFIGURATION').click();
  });

  test('opening the dropdown does not cause layout shift', async ({ page }) => {
    const presetSelect = page.getByLabel('PRESET:').last();
    const fontSizeItem = page.locator('.setting-item:has(#font-size)').last();

    // Get initial vertical offset relative to parent
    const getOffsetTop = (locator: import('@playwright/test').Locator) =>
      locator.evaluate((el) => (el as HTMLElement).offsetTop);

    const initialOffset = await getOffsetTop(fontSizeItem);

    // Open dropdown
    await presetSelect.click();
    await expect(page.getByRole('listbox').last()).toBeVisible();

    // Offset should not change significantly (allow 2px tolerance for rendering variations)
    const afterOffset = await getOffsetTop(fontSizeItem);

    expect(Math.abs(afterOffset - initialOffset)).toBeLessThanOrEqual(2);
  });

  test('selecting a preset triggers transitions and maintains layout stability', async ({
    page,
  }) => {
    const speedInput = page.locator('#speed').last();
    const fontSizeInput = page.locator('#font-size').last();
    const presetSelect = page.getByLabel('PRESET:').last();

    // Initial values (Classic Matrix)
    await expect(speedInput).toHaveValue('50');
    await expect(fontSizeInput).toHaveValue('20');

    // Monitor position of a sibling element to ensure no layout drift
    const fontSizeBox = await page.locator('.setting-item:has(#font-size)').last().boundingBox();
    const speedBox = await page.locator('.setting-item:has(#speed)').last().boundingBox();

    // Select "CYBERPUNK PINK" preset
    await presetSelect.click();
    // Wait for dropdown to be visible
    await expect(page.getByRole('listbox').last()).toBeVisible();
    await page.getByRole('option', { name: 'CYBERPUNK PINK' }).last().click();

    // Values should update
    await expect(page.locator('#speed').last()).toHaveValue('50');
    await expect(page.locator('#font-size').last()).toHaveValue('20');
    await expect(page.getByRole('checkbox', { name: /ALL_4_DIRECTIONS/i }).last()).toHaveAttribute(
      'aria-checked',
      'true',
    );

    // Verify layout stability: The boxes should not have moved horizontally
    const fontSizeBoxAfter = await page
      .locator('.setting-item:has(#font-size)')
      .last()
      .boundingBox();
    const speedBoxAfter = await page.locator('.setting-item:has(#speed)').last().boundingBox();

    if (fontSizeBox && fontSizeBoxAfter) {
      expect(fontSizeBoxAfter.x).toBeCloseTo(fontSizeBox.x, 1);
    }
    if (speedBox && speedBoxAfter) {
      expect(speedBoxAfter.x).toBeCloseTo(speedBox.x, 1);
    }
  });

  test('changing a setting manually triggers preset transition to CUSTOM', async ({ page }) => {
    const presetSelect = page.getByLabel('PRESET:').last();
    const speedInput = page.locator('#speed').last();

    await expect(presetSelect).toContainText('CLASSIC MATRIX');

    // Change speed manually
    await speedInput.fill('75');

    // Preset should transition to CUSTOM
    await expect(page.getByLabel('PRESET:').last()).toContainText('CUSTOM');
  });
});
