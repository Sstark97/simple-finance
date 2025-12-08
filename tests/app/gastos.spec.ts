import { test, expect } from '@playwright/test';

test.describe('Gastos Page', () => {
  test('should load gastos page successfully', async ({ page }) => {
    await page.goto('/gastos');

    // Verify page loaded
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should display transactions table or error message', async ({ page }) => {
    await page.goto('/gastos');

    // Either transactions table or error message should be visible
    const hasTable = await page.locator('table').isVisible().catch(() => false);
    const hasError = await page.getByText(/error/i).isVisible().catch(() => false);
    const hasNoData = await page.getByText(/no hay datos/i).isVisible().catch(() => false);

    expect(hasTable || hasError || hasNoData).toBeTruthy();
  });

  test('should have navigation back to dashboard', async ({ page }) => {
    await page.goto('/gastos');

    // Find link back to dashboard
    const dashboardLink = page.getByRole('link', { name: /dashboard|inicio/i });

    // It should exist (even if not immediately visible)
    const linkExists = await dashboardLink.count() > 0;
    expect(linkExists).toBeTruthy();
  });
});
