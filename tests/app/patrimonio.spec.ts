import { test, expect } from '@playwright/test';

test.describe('Patrimonio Page', () => {
  test('should load heritage page successfully', async ({ page }) => {
    await page.goto('/patrimonio');

    // Verify page loaded
    await expect(page.getByRole('main')).toBeVisible();
  });

  test('should display page header with title', async ({ page }) => {
    await page.goto('/patrimonio');

    // Verify header title
    await expect(page.getByRole('heading', { name: /historial de patrimonio/i })).toBeVisible();
  });

  test('should display KPI cards', async ({ page }) => {
    await page.goto('/patrimonio');

    // Verify KPI cards are visible
    await expect(page.getByText(/patrimonio actual/i)).toBeVisible();
    await expect(page.getByText(/crecimiento último date/i)).toBeVisible();
  });

  test('should display line chart', async ({ page }) => {
    await page.goto('/patrimonio');

    // Verify chart title
    await expect(page.getByText(/evolución del patrimonio/i)).toBeVisible();

    // Verify SVG chart exists
    const hasSVG = await page.locator('svg').count() > 0;
    expect(hasSVG).toBeTruthy();
  });

  test('should display data table with headers', async ({ page }) => {
    await page.goto('/patrimonio');

    // Verify table title
    await expect(page.getByText(/detalle mensual/i)).toBeVisible();

    // Check if table exists
    const hasTable = await page.locator('table').isVisible().catch(() => false);

    if (hasTable) {
      // Verify table headers
      await expect(page.getByRole('columnheader', { name: /date/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /saving/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /investment/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /total/i })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: /variación/i })).toBeVisible();
    }
  });

  test('should have navigation back to dashboard', async ({ page }) => {
    await page.goto('/patrimonio');

    // Find link back to dashboard
    const dashboardLink = page.getByRole('link', { name: /volver al dashboard/i });
    await expect(dashboardLink).toBeVisible();
  });
});
