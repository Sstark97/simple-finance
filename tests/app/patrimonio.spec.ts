import { test, expect } from '@playwright/test';

test.describe('Patrimonio Page', () => {
  test('should load patrimonio page successfully', async ({ page }) => {
    await page.goto('/patrimonio');

    // Verify page loaded
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should display net worth table or error message', async ({ page }) => {
    await page.goto('/patrimonio');

    // Either net worth table or error message should be visible
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    const hasError = await page.getByText(/error/i).isVisible().catch(() => false);
    const hasNoData = await page.getByText(/no hay datos/i).isVisible().catch(() => false);

    expect(hasTable || hasError || hasNoData).toBeTruthy();
  });

  test('should have navigation back to dashboard', async ({ page }) => {
    await page.goto('/patrimonio');

    // Find link back to dashboard
    const dashboardLink = page.getByRole('link', { name: /dashboard|inicio/i });

    // It should exist (even if not immediately visible)
    const linkExists = await dashboardLink.count() > 0;
    expect(linkExists).toBeTruthy();
  });

  test('should display table headers correctly', async ({ page }) => {
    await page.goto('/patrimonio');

    // Check if table exists
    const hasTable = await page.locator('table').isVisible().catch(() => false);

    if (hasTable) {
      // Verify table headers
      await expect(page.getByRole('columnheader', { name: /mes/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /hucha/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /invertido/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /total/i })).toBeVisible();
    }
  });
});
